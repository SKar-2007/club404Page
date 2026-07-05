import { useState, useCallback, useRef } from "react";
import { LANGUAGES, getLanguageById, type LanguageDef } from "@/lib/languages";

export type PlaygroundTab = "html" | "css" | "javascript";

export interface PlaygroundState {
  languageId: string;
  activeTab: PlaygroundTab;
  isRunning: boolean;
  output: string[];
  code: string;
  html: string;
  css: string;
  javascript: string;
}

const DEFAULT_WEB = getLanguageById("html-css-js");
const DEFAULT_JS = getLanguageById("javascript");
const DEFAULT_PY = getLanguageById("python");

let pyodideInstance: { runPython: (code: string) => unknown } | null = null;
let pyodidePromise: Promise<{ runPython: (code: string) => unknown }> | null =
  null;

async function loadPyodide(): Promise<{
  runPython: (code: string) => unknown;
}> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
    document.head.appendChild(script);

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Pyodide"));
    });

    // @ts-expect-error - loadPyodide loaded from CDN
    pyodideInstance = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
    });
    return pyodideInstance;
  })();

  return pyodidePromise;
}

export function usePlayground() {
  const lang = getLanguageById("html-css-js");

  const [state, setState] = useState<PlaygroundState>({
    languageId: "html-css-js",
    activeTab: "html",
    isRunning: false,
    output: [],
    code: lang.defaultCode,
    html: DEFAULT_WEB.defaultCode,
    css: "",
    javascript: "",
  });

  const [previewSrc, setPreviewSrc] = useState<string>("");
  const outputRef = useRef<string[]>([]);

  const currentLang = getLanguageById(state.languageId);

  const setLanguage = useCallback((langId: string) => {
    const newLang = getLanguageById(langId);
    setState((prev) => ({
      ...prev,
      languageId: langId,
      code: newLang.defaultCode,
      output: [],
      activeTab: "html",
    }));
    setPreviewSrc("");
  }, []);

  const setTab = useCallback((tab: PlaygroundTab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const updateCode = useCallback(
    (code: string) => {
      setState((prev) => ({ ...prev, code }));
    },
    []
  );

  const parseWebCode = (raw: string) => {
    const htmlMatch = raw.match(/<!--[\s\S]*?HTML[\s\S]*?-->([\s\S]*?)(?=<style|<script|$)/i);
    const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i);
    const scriptMatch = raw.match(/<script>([\s\S]*?)<\/script>/i);
    return {
      html: htmlMatch?.[1]?.trim() || raw,
      css: styleMatch?.[1]?.trim() || "",
      javascript: scriptMatch?.[1]?.trim() || "",
    };
  };

  const runCode = useCallback(async () => {
    setState((prev) => ({ ...prev, isRunning: true, output: [] }));
    outputRef.current = [];

    const langDef = getLanguageById(state.languageId);

    try {
      if (langDef.method === "iframe") {
        let html: string;
        let css: string;
        let js: string;

        if (state.languageId === "html-css-js") {
          ({ html, css, javascript: js } = parseWebCode(state.code));
        } else {
          html = "";
          css = "";
          js = state.code;
        }

        const sandboxHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { background: #121212; color: #fff; font-family: monospace; padding: 1rem; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    (function() {
      const _post = function(type, args) {
        window.parent.postMessage({ type: 'console', method: type, args: args.map(a => {
          try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch(e) { return String(a); }
        })}, window.location.origin);
      };
      console.log = function() { _post('log', Array.from(arguments)); };
      console.warn = function() { _post('warn', Array.from(arguments)); };
      console.error = function() { _post('error', Array.from(arguments)); };
      try {
        ${js}
      } catch(e) {
        console.error(e.message);
      }
    })();
  ${"<"}/script>
</body>
</html>`;

        setPreviewSrc(sandboxHtml);
        await new Promise((r) => setTimeout(r, 100));
        setState((prev) => ({ ...prev, isRunning: false }));
      } else if (langDef.method === "pyodite") {
        const pyodide = await loadPyodide();

        pyodide.runPython(`
import sys
class _Capture:
    def __init__(self):
        self.lines = []
    def write(self, text):
        if text.strip():
            self.lines.append(text)
    def flush(self):
        pass
_cap = _Capture()
sys.stdout = _cap
sys.stderr = _cap
`);

        try {
          pyodide.runPython(state.code);
          const captured = pyodide.runPython("_cap.lines") as string[];
          await new Promise((r) => setTimeout(r, 150));

          setState((prev) => ({
            ...prev,
            isRunning: false,
            output: (captured || []).map((l: string) => "› " + l),
          }));
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          const errMsg = msg.split("\n").pop() || msg || "Unknown error";
          setState((prev) => ({
            ...prev,
            isRunning: false,
            output: ["× " + errMsg],
          }));
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setState((prev) => ({
        ...prev,
        isRunning: false,
        output: ["× Execution failed: " + msg],
      }));
    }
  }, [state.languageId, state.code]);

  const handleConsoleMessage = useCallback((msg: MessageEvent) => {
    if (msg.data?.type === "console") {
      const prefix =
        msg.data.method === "error"
          ? "× "
          : msg.data.method === "warn"
          ? "⚠ "
          : "› ";
      const text = prefix + msg.data.args.join(" ");
      outputRef.current = [...outputRef.current.slice(-49), text];
      setState((prev) => ({ ...prev, output: [...outputRef.current] }));
    }
  }, []);

  const reset = useCallback(() => {
    const langDef = getLanguageById(state.languageId);
    setState((prev) => ({
      ...prev,
      code: langDef.defaultCode,
      output: [],
    }));
    setPreviewSrc("");
    outputRef.current = [];
  }, [state.languageId]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(state.code);
  }, [state.code]);

  return {
    ...state,
    currentLang,
    previewSrc,
    setLanguage,
    setTab,
    updateCode,
    runCode,
    reset,
    copyCode,
    handleConsoleMessage,
    languages: LANGUAGES,
  };
}
