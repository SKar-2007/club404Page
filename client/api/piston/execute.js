import { execSync } from "child_process";
import vm from "vm";
import fs from "fs";
import path from "path";
import os from "os";

const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return false;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit) {
    if (now - entry.start > RATE_LIMIT_WINDOW * 2) rateLimit.delete(ip);
  }
}, 60_000);

function runInSandbox(code, timeout = 10000) {
  let stdout = "";
  let stderr = "";

  const sandbox = {
    console: {
      log: (...args) => { stdout += args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
      error: (...args) => { stderr += args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
      warn: (...args) => { stdout += args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
      info: (...args) => { stdout += args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
      dir: (...args) => { stdout += args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
    },
    Math, Date, JSON, parseInt, parseFloat, isNaN, isFinite,
    Array, Object, String, Number, Boolean, RegExp, Map, Set,
    Promise, setTimeout, clearTimeout, setInterval, clearInterval,
    Error, TypeError, RangeError, SyntaxError, ReferenceError,
    encodeURIComponent, decodeURIComponent, escape, unescape, btoa, atob,
    URL, URLSearchParams, AbortController, fetch: globalThis.fetch,
    process: { env: {} },
  };

  const context = vm.createContext(sandbox);
  const script = new vm.Script(code, { timeout });

  try {
    script.runInContext(context, { timeout });
  } catch (e) {
    stderr += e.message + "\n";
  }

  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

function execCommand(cmd, tmpDir, timeout = 10000) {
  try {
    const result = execSync(cmd, {
      cwd: tmpDir,
      timeout,
      encoding: "utf-8",
      maxBuffer: 1024 * 1024,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { stdout: result.trim(), stderr: "" };
  } catch (e) {
    return {
      stdout: e.stdout ? e.stdout.trim() : "",
      stderr: e.stderr ? e.stderr.trim() : e.message,
    };
  }
}

function writeTempFile(code, ext) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "exec-"));
  const filePath = path.join(tmpDir, `main${ext}`);
  fs.writeFileSync(filePath, code, "utf-8");
  return { tmpDir, filePath };
}

function makeResult(stdout, stderr, compileStderr) {
  const run = { stdout, stderr, output: stdout + stderr, code: stderr ? 1 : 0, signal: null };
  if (compileStderr) {
    return { compile: { stderr: compileStderr, stdout: "", output: compileStderr, code: 1, signal: null }, run };
  }
  return { run };
}

function makeCompiledHandler(compileFn, runFn, ext) {
  return (code) => {
    const { tmpDir, filePath } = writeTempFile(code, ext);
    try {
      const compile = execCommand(compileFn(filePath, tmpDir), tmpDir);
      if (compile.stderr) {
        return makeResult("", "", compile.stderr);
      }
      const result = execCommand(runFn(filePath, tmpDir), tmpDir);
      return makeResult(result.stdout, result.stderr);
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  };
}

const LANGUAGE_HANDLERS = {
  javascript: (code) => {
    const result = runInSandbox(code);
    return makeResult(result.stdout, result.stderr);
  },
  typescript: (code) => {
    const tsCode = code
      .replace(/:\s*string/g, "")
      .replace(/:\s*number/g, "")
      .replace(/:\s*boolean/g, "")
      .replace(/:\s*any/g, "")
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, "")
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, "");
    const result = runInSandbox(tsCode);
    return makeResult(result.stdout, result.stderr);
  },
  python: (code) => {
    const { tmpDir, filePath } = writeTempFile(code, ".py");
    try {
      const result = execCommand(`python3 ${filePath}`, tmpDir);
      return makeResult(result.stdout, result.stderr);
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  },
  c: makeCompiledHandler(
    (f) => `gcc -o ${f.replace(/\.c$/, "")} ${f}`,
    (f) => f.replace(/\.c$/, ""),
    ".c"),
  "c++": makeCompiledHandler(
    (f) => `g++ -o ${f.replace(/\.cpp$/, "")} ${f}`,
    (f) => f.replace(/\.cpp$/, ""),
    ".cpp"),
  java: (code) => {
    const { tmpDir } = writeTempFile(code, ".java");
    const className = (code.match(/class\s+(\w+)/) || [])[1] || "Main";
    try {
      const compile = execCommand(`javac ${path.join(tmpDir, `${className}.java`)}`, tmpDir);
      if (compile.stderr) return makeResult("", "", compile.stderr);
      const result = execCommand(`java -cp ${tmpDir} ${className}`, tmpDir);
      return makeResult(result.stdout, result.stderr);
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  },
  go: makeCompiledHandler(
    (f, d) => `go build -o ${path.join(d, "main")} ${f}`,
    (f, d) => path.join(d, "main"),
    ".go"),
  ruby: (code) => {
    const { tmpDir, filePath } = writeTempFile(code, ".rb");
    try {
      const result = execCommand(`ruby ${filePath}`, tmpDir);
      return makeResult(result.stdout, result.stderr);
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  },
  php: (code) => {
    const { tmpDir, filePath } = writeTempFile(code, ".php");
    try {
      const result = execCommand(`php ${filePath}`, tmpDir);
      return makeResult(result.stdout, result.stderr);
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  },
  lua: (code) => {
    const { tmpDir, filePath } = writeTempFile(code, ".lua");
    try {
      const result = execCommand(`lua5.4 ${filePath} 2>/dev/null || lua ${filePath} 2>/dev/null || lua5.3 ${filePath}`, tmpDir);
      return makeResult(result.stdout, result.stderr);
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  },
  rust: makeCompiledHandler(
    (f) => `rustc -o ${f.replace(/\.rs$/, "")} ${f}`,
    (f) => f.replace(/\.rs$/, ""),
    ".rs"),
};

export default async function handler(req, res) {
  const allowed = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "*";

  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
  }

  const { language, version, files } = req.body || {};
  if (!language || !files?.length) {
    return res.status(400).json({ error: "Missing required fields: language, files" });
  }

  const code = files[0]?.content;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const pistonUrl = process.env.PISTON_API_URL;

  if (pistonUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);
      const upstreamRes = await fetch(`${pistonUrl}/api/v2/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, version, files }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!upstreamRes.ok) {
        const text = await upstreamRes.text();
        return res.status(upstreamRes.status).json({ error: text });
      }
      const data = await upstreamRes.json();
      return res.status(200).json(data);
    } catch (err) {
      if (err.name === "AbortError") {
        return res.status(504).json({ error: "Execution timed out." });
      }
    }
  }

  const handler = LANGUAGE_HANDLERS[language];
  if (!handler) {
    return res.status(200).json({
      run: {
        stdout: "",
        stderr: `Language "${language}" requires a code execution server. Set PISTON_API_URL to enable it.`,
        output: `Language "${language}" requires a code execution server.`,
        code: 1,
        signal: null,
      },
    });
  }

  try {
    const result = handler(code);
    return res.status(200).json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(200).json({
      run: { stdout: "", stderr: msg, output: msg, code: 1, signal: null },
    });
  }
}
