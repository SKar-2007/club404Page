import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Challenge,
  Submission,
  ScheduledChallenge,
  countChars,
  getVisibleChallenges,
  loadSubmissions,
  saveSubmissions,
  loadUsername,
  saveUsername,
  buildLeaderboard,
  executeInSandbox,
  getISTDateString,
  getNextMidnightIST,
  getISTDateOffset,
  midnightIST,
  createDefaultScheduledChallenges,
  loadScheduledChallenges,
  saveScheduledChallenges,
} from "@/lib/code-golf";

export interface UseCodeGolfReturn {
  currentChallenge: Challenge | null;
  challenges: Challenge[];
  allChallenges: Challenge[];
  submissions: Submission[];
  leaderboard: ReturnType<typeof buildLeaderboard>;
  charCount: number;
  isRunning: boolean;
  lastResult: { status: "PASSED" | "FAILED" | "ERROR"; output: string } | null;
  code: string;
  username: string;
  timeRemaining: string;
  /** Current difficulty filter */
  difficulty: "easy" | "medium" | "hard";
  /** Index within the current difficulty (0-based) */
  difficultyIndex: number;
  /** Total challenges for current difficulty */
  difficultyTotal: number;
  setCode: (code: string) => void;
  setUsername: (name: string) => void;
  runCode: () => Promise<void>;
  submitCode: () => void;
  resetCode: () => void;
  selectChallenge: (id: string) => void;
  setDifficulty: (d: "easy" | "medium" | "hard") => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
}

function getTimeRemaining(expiresAt: string): string {
  const now = Date.now();
  const expires = new Date(expiresAt).getTime();
  const diff = expires - now;
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getChallengesForToday(): Challenge[] {
  let scheduled = loadScheduledChallenges();

  // Seed defaults if empty
  if (scheduled.length === 0) {
    scheduled = createDefaultScheduledChallenges();
    saveScheduledChallenges(scheduled);
  }

  return getVisibleChallenges();
}

export function useCodeGolf(): UseCodeGolfReturn {
  const { profile } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    getChallengesForToday()
  );
  const [difficulty, setDifficultyState] = useState<"easy" | "medium" | "hard">("easy");
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [code, setCode] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>(() => loadSubmissions());
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    status: "PASSED" | "FAILED" | "ERROR";
    output: string;
  } | null>(null);
  const [username, setUsernameState] = useState(() => {
    const stored = loadUsername();
    return stored || "";
  });
  const [timeRemaining, setTimeRemaining] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastDayRef = useRef(getISTDateString());
  const [prevChallengeId, setPrevChallengeId] = useState<string | null>(null);

  // Filtered challenges by current difficulty
  const filteredChallenges = challenges.filter(
    (c) => c.difficulty === difficulty
  );

  // Current challenge
  const currentChallenge =
    filteredChallenges[difficultyIndex] || filteredChallenges[0] || null;

  const leaderboard = buildLeaderboard(submissions);

  // Reset code when challenge changes
  if (currentChallenge && currentChallenge.id !== prevChallengeId) {
    setPrevChallengeId(currentChallenge.id);
    if (code !== currentChallenge.starterCode) {
      setCode(currentChallenge.starterCode);
    }
    if (lastResult !== null) {
      setLastResult(null);
    }
  }

  // Listen for mod-triggered refresh
  useEffect(() => {
    const handleRefresh = () => {
      const newChallenges = getChallengesForToday();
      setChallenges(newChallenges);
      setDifficultyIndex(0);
      setLastResult(null);
    };
    window.addEventListener("codegolf-refresh", handleRefresh);
    return () => window.removeEventListener("codegolf-refresh", handleRefresh);
  }, []);

  // Check for day change every minute
  useEffect(() => {
    const checkDayChange = () => {
      const today = getISTDateString();
      if (today !== lastDayRef.current) {
        lastDayRef.current = today;
        const newChallenges = getChallengesForToday();
        setChallenges(newChallenges);
        setDifficultyIndex(0);
        setCode(
          newChallenges.find((c) => c.difficulty === difficulty)?.starterCode ||
            ""
        );
        setLastResult(null);
      }
    };

    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, [difficulty]);

  // Timer countdown to next midnight IST
  useEffect(() => {
    const updateTimer = () => {
      const next = getNextMidnightIST();
      const diff = next.getTime() - Date.now();
      if (diff <= 0) {
        setTimeRemaining("00:00:00");
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const charCount = countChars(code);

  // Auto-set username from auth profile
  useEffect(() => {
    if (profile?.full_name && !loadUsername()) {
      setUsernameState(profile.full_name);
      saveUsername(profile.full_name);
    }
  }, [profile?.full_name]);

  const setUsername = useCallback((name: string) => {
    setUsernameState(name);
    saveUsername(name);
  }, []);

  const setDifficulty = useCallback(
    (d: "easy" | "medium" | "hard") => {
      setDifficultyState(d);
      setDifficultyIndex(0);
      setLastResult(null);
    },
    []
  );

  const selectChallenge = useCallback(
    (id: string) => {
      const idx = filteredChallenges.findIndex((c) => c.id === id);
      if (idx >= 0) {
        setDifficultyIndex(idx);
        setLastResult(null);
      }
    },
    [filteredChallenges]
  );

  const nextChallenge = useCallback(() => {
    if (difficultyIndex < filteredChallenges.length - 1) {
      setDifficultyIndex((i) => i + 1);
      setLastResult(null);
    }
  }, [difficultyIndex, filteredChallenges.length]);

  const prevChallenge = useCallback(() => {
    if (difficultyIndex > 0) {
      setDifficultyIndex((i) => i - 1);
      setLastResult(null);
    }
  }, [difficultyIndex]);

  const runCode = useCallback(async () => {
    if (!currentChallenge || isRunning) return;

    setIsRunning(true);
    setLastResult(null);

    try {
      const { output, error } = await executeInSandbox(code, "");

      if (error) {
        setLastResult({ status: "ERROR", output: error });
        setIsRunning(false);
        return;
      }

      const lines = output.split("\n").filter(Boolean);
      const allPassed = currentChallenge.testCases.every((tc) => {
        const actual = lines[lines.length - 1] || "";
        return actual.trim() === tc.expectedOutput.trim();
      });

      setLastResult({
        status: allPassed ? "PASSED" : "FAILED",
        output: lines.join("\n") || "(no output)",
      });
    } catch (e) {
      setLastResult({
        status: "ERROR",
        output: e instanceof Error ? e.message : "Unknown error",
      });
    }

    setIsRunning(false);
  }, [code, currentChallenge, isRunning]);

  const submitCode = useCallback(() => {
    if (!currentChallenge || !username.trim()) return;

    const submission: Submission = {
      id: Date.now().toString(),
      challengeId: currentChallenge.id,
      code,
      charCount,
      status: lastResult?.status || "FAILED",
      output: lastResult?.output,
      executedAt: new Date().toISOString(),
      username: username.trim(),
    };

    const updated = [...submissions, submission];
    setSubmissions(updated);
    saveSubmissions(updated);
  }, [currentChallenge, code, charCount, lastResult, submissions, username]);

  const resetCode = useCallback(() => {
    if (currentChallenge) {
      setCode(currentChallenge.starterCode);
      setLastResult(null);
    }
  }, [currentChallenge]);

  return {
    currentChallenge,
    challenges: filteredChallenges,
    allChallenges: challenges,
    submissions,
    leaderboard,
    charCount,
    isRunning,
    lastResult,
    code,
    username,
    timeRemaining,
    difficulty,
    difficultyIndex,
    difficultyTotal: filteredChallenges.length,
    setCode,
    setUsername,
    runCode,
    submitCode,
    resetCode,
    selectChallenge,
    setDifficulty,
    nextChallenge,
    prevChallenge,
  };
}
