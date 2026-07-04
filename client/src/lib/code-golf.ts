export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  testCases: TestCase[];
  starterCode: string;
  language: string;
  createdAt: string;
  expiresAt: string;
}

export interface ScheduledChallenge extends Challenge {
  /** ISO string — when this challenge becomes visible to users (midnight IST) */
  publishAt: string;
  /** ISO string — when this challenge expires (next midnight IST) */
  expiresAt: string;
  /** Which IST calendar day this challenge belongs to (YYYY-MM-DD) */
  scheduledDate: string;
  /** Whether this challenge has been published to users */
  published: boolean;
}

export interface Submission {
  id: string;
  challengeId: string;
  code: string;
  charCount: number;
  status: "PASSED" | "FAILED" | "ERROR";
  output?: string;
  executedAt: string;
  username: string;
}

export interface LeaderboardEntry {
  username: string;
  bestCharCount: number;
  totalSubmissions: number;
  challengesSolved: number;
}

export const CHALLENGE_STORAGE_KEY = "club404-au-codegolf-challenges";
export const SUBMISSION_STORAGE_KEY = "club404-au-codegolf-submissions";
export const USER_STORAGE_KEY = "club404-au-codegolf-user";
export const SCHEDULED_STORAGE_KEY = "club404-au-codegolf-scheduled";
export const LAST_DAY_STORAGE_KEY = "club404-au-codegolf-lastday";

export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
export const EXECUTION_TIMEOUT_MS = 5000;

// ── IST Helpers ──────────────────────────────────────────────

/** Get current time as a Date object in IST */
export function nowIST(): Date {
  const utc = Date.now();
  return new Date(utc + IST_OFFSET_MS);
}

/** Get today's IST date as YYYY-MM-DD */
export function getISTDateString(date?: Date): string {
  const d = date || nowIST();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Get midnight IST for a given YYYY-MM-DD as a UTC ISO string */
export function midnightIST(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  // Midnight IST = 18:30 UTC previous day
  const utcMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0) - IST_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

/** Get noon IST (12:00 PM IST) for a given YYYY-MM-DD as a UTC ISO string — mod upload window opens */
export function noonIST(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, 12, 0, 0, 0) - IST_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

/** Check if current IST time is past midnight (i.e., a new day has started) */
export function isNewDayIST(): boolean {
  const today = getISTDateString();
  const lastSeen = localStorage.getItem(LAST_DAY_STORAGE_KEY);
  if (lastSeen !== today) {
    localStorage.setItem(LAST_DAY_STORAGE_KEY, today);
    return lastSeen !== null; // true if it changed (not first load)
  }
  return false;
}

/** Get next IST midnight as a Date (for countdown timers) */
export function getNextMidnightIST(): Date {
  const ist = nowIST();
  const tomorrow = new Date(
    Date.UTC(
      ist.getUTCFullYear(),
      ist.getUTCMonth(),
      ist.getUTCDate() + 1,
      0, 0, 0, 0
    )
  );
  // Convert back to real UTC by subtracting IST offset
  return new Date(tomorrow.getTime() - IST_OFFSET_MS);
}

// ── Scheduled Challenge Storage ──────────────────────────────

export function loadScheduledChallenges(): ScheduledChallenge[] {
  try {
    const stored = localStorage.getItem(SCHEDULED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveScheduledChallenges(challenges: ScheduledChallenge[]) {
  localStorage.setItem(SCHEDULED_STORAGE_KEY, JSON.stringify(challenges));
}

/**
 * Get challenges visible to users right now.
 * A challenge is visible if:
 *   1. scheduledDate === today's IST date
 *   2. current time >= publishAt (midnight IST)
 *   3. current time < expiresAt (next midnight IST)
 */
export function getVisibleChallenges(): ScheduledChallenge[] {
  const today = getISTDateString();
  const now = Date.now();
  const all = loadScheduledChallenges();

  return all.filter((c) => {
    if (c.scheduledDate !== today) return false;
    const publishTime = new Date(c.publishAt).getTime();
    const expireTime = new Date(c.expiresAt).getTime();
    return now >= publishTime && now < expireTime;
  });
}

/**
 * Get challenges that mods have uploaded for tomorrow (or a future date)
 * but are not yet visible to users. Visible only in mod panel.
 */
export function getUpcomingChallenges(): ScheduledChallenge[] {
  const today = getISTDateString();
  const now = Date.now();
  const all = loadScheduledChallenges();

  return all.filter((c) => {
    if (c.scheduledDate <= today) return false;
    // Show if we're within 12 hours of the scheduled date (mod preview window)
    const publishTime = new Date(c.publishAt).getTime();
    return now < publishTime;
  });
}

/**
 * Get all challenges for a specific IST date (for mod view).
 */
export function getChallengesForDate(dateStr: string): ScheduledChallenge[] {
  return loadScheduledChallenges().filter(
    (c) => c.scheduledDate === dateStr
  );
}

// ── Default Challenges (seed data) ──────────────────────────

export function createDefaultScheduledChallenges(): ScheduledChallenge[] {
  const today = getISTDateString();
  const tomorrow = getISTDateOffset(1);

  const defaults: ScheduledChallenge[] = [
    {
      id: `golf-${today}-e1`,
      title: "Hello World",
      description:
        'Write a program that prints "Hello, World!" to the console.',
      difficulty: "easy",
      testCases: [
        {
          input: "",
          expectedOutput: "Hello, World!",
          description: "Should print Hello, World!",
        },
      ],
      starterCode: "console.log('Hello, World!');",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(today),
      expiresAt: midnightIST(tomorrow),
      scheduledDate: today,
      published: true,
    },
    {
      id: `golf-${today}-e2`,
      title: "Reverse String",
      description: "Write a function that reverses a string.",
      difficulty: "easy",
      testCases: [
        { input: "hello", expectedOutput: "olleh", description: "Reverse 'hello'" },
        { input: "abc", expectedOutput: "cba", description: "Reverse 'abc'" },
        { input: "", expectedOutput: "", description: "Empty string" },
      ],
      starterCode: "function reverse(str){\n  // your code\n}",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(today),
      expiresAt: midnightIST(tomorrow),
      scheduledDate: today,
      published: true,
    },
    {
      id: `golf-${today}-e3`,
      title: "Sum of Array",
      description:
        "Write a function that returns the sum of all numbers in an array.",
      difficulty: "easy",
      testCases: [
        { input: "[1,2,3]", expectedOutput: "6", description: "Sum [1,2,3]" },
        { input: "[10,20,30,40]", expectedOutput: "100", description: "Sum [10,20,30,40]" },
        { input: "[]", expectedOutput: "0", description: "Empty array" },
      ],
      starterCode: "function sum(arr){\n  // your code\n}",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(today),
      expiresAt: midnightIST(tomorrow),
      scheduledDate: today,
      published: true,
    },
    {
      id: `golf-${today}-m1`,
      title: "FizzBuzz",
      description:
        'Print numbers 1-100. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", both print "FizzBuzz".',
      difficulty: "medium",
      testCases: [
        { input: "1", expectedOutput: "1", description: "Number 1" },
        { input: "3", expectedOutput: "Fizz", description: "Multiple of 3" },
        { input: "5", expectedOutput: "Buzz", description: "Multiple of 5" },
        { input: "15", expectedOutput: "FizzBuzz", description: "Multiple of both" },
      ],
      starterCode: "for(let i=1;i<=100;i++){\n  // your logic\n}",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(today),
      expiresAt: midnightIST(tomorrow),
      scheduledDate: today,
      published: true,
    },
    {
      id: `golf-${today}-m2`,
      title: "Palindrome Check",
      description:
        "Write a function that checks if a string is a palindrome.",
      difficulty: "medium",
      testCases: [
        { input: "racecar", expectedOutput: "true", description: "Is palindrome" },
        { input: "hello", expectedOutput: "false", description: "Not palindrome" },
        { input: "A", expectedOutput: "true", description: "Single char" },
      ],
      starterCode: "function isPalindrome(str){\n  // your code\n}",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(today),
      expiresAt: midnightIST(tomorrow),
      scheduledDate: today,
      published: true,
    },
    {
      id: `golf-${today}-m3`,
      title: "Factorial",
      description: "Write a function that calculates the factorial of a number.",
      difficulty: "medium",
      testCases: [
        { input: "5", expectedOutput: "120", description: "5! = 120" },
        { input: "0", expectedOutput: "1", description: "0! = 1" },
        { input: "10", expectedOutput: "3628800", description: "10! = 3628800" },
      ],
      starterCode: "function factorial(n){\n  // your code\n}",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(today),
      expiresAt: midnightIST(tomorrow),
      scheduledDate: today,
      published: true,
    },
    {
      id: `golf-${today}-h1`,
      title: "Fibonacci",
      description: "Write a function that returns the nth Fibonacci number.",
      difficulty: "hard",
      testCases: [
        { input: "0", expectedOutput: "0", description: "F(0) = 0" },
        { input: "1", expectedOutput: "1", description: "F(1) = 1" },
        { input: "10", expectedOutput: "55", description: "F(10) = 55" },
      ],
      starterCode: "function fibonacci(n){\n  // your code\n}",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(today),
      expiresAt: midnightIST(tomorrow),
      scheduledDate: today,
      published: true,
    },
  ];

  return defaults;
}

// ── Utility ──────────────────────────────────────────────────

/** Get IST date string offset by N days from today */
export function getISTDateOffset(daysOffset: number): string {
  const ist = nowIST();
  const target = new Date(
    Date.UTC(
      ist.getUTCFullYear(),
      ist.getUTCMonth(),
      ist.getUTCDate() + daysOffset,
      0, 0, 0, 0
    )
  );
  const y = target.getUTCFullYear();
  const m = String(target.getUTCMonth() + 1).padStart(2, "0");
  const d = String(target.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function countChars(code: string): number {
  return code.trim().replace(/\r\n/g, "\n").length;
}

export function loadSubmissions(): Submission[] {
  try {
    const stored = localStorage.getItem(SUBMISSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSubmissions(submissions: Submission[]) {
  localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(submissions));
}

export function loadUsername(): string {
  return localStorage.getItem(USER_STORAGE_KEY) || "";
}

export function saveUsername(username: string) {
  localStorage.setItem(USER_STORAGE_KEY, username);
}

export function buildLeaderboard(submissions: Submission[]): LeaderboardEntry[] {
  const passed = submissions.filter((s) => s.status === "PASSED");

  const userMap = new Map<
    string,
    { best: number; total: number; solved: Set<string> }
  >();

  passed.forEach((s) => {
    const existing = userMap.get(s.username) || {
      best: Infinity,
      total: 0,
      solved: new Set(),
    };
    existing.best = Math.min(existing.best, s.charCount);
    existing.total += 1;
    existing.solved.add(s.challengeId);
    userMap.set(s.username, existing);
  });

  return Array.from(userMap.entries())
    .map(([username, data]) => ({
      username,
      bestCharCount: data.best,
      totalSubmissions: data.total,
      challengesSolved: data.solved.size,
    }))
    .sort((a, b) => a.bestCharCount - b.bestCharCount);
}

export function executeInSandbox(
  code: string,
  _testInput: string
): Promise<{ output: string; error?: string }> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.sandbox = "allow-scripts";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const timeout = setTimeout(() => {
      document.body.removeChild(iframe);
      resolve({ output: "", error: `Execution timed out (${EXECUTION_TIMEOUT_MS / 1000}s)` });
    }, EXECUTION_TIMEOUT_MS);

    const handler = (e: MessageEvent) => {
      if (e.data?.type === "golf-output") {
        clearTimeout(timeout);
        window.removeEventListener("message", handler);
        document.body.removeChild(iframe);
        resolve({ output: e.data.output || "", error: e.data.error });
      }
    };

    window.addEventListener("message", handler);

    const wrappedCode = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script>
(function() {
  const _output = [];
  const _origLog = console.log;
  console.log = function() {
    _output.push(Array.from(arguments).map(a => 
      typeof a === 'object' ? JSON.stringify(a) : String(a)
    ).join(' '));
    _origLog.apply(console, arguments);
  };
  
  try {
    ${code}
    setTimeout(() => {
      window.parent.postMessage({ type: 'golf-output', output: _output.join('\\n') }, '*');
    }, 100);
  } catch(e) {
    window.parent.postMessage({ type: 'golf-output', output: _output.join('\\n'), error: e.message }, '*');
  }
})();
</script>
</body>
</html>`;

    iframe.srcdoc = wrappedCode;
  });
}
