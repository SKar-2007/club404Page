import { useState, useCallback, useMemo } from "react";
import {
  MysteryChallenge,
  MysterySubmission,
  DEFAULT_CHALLENGES,
  loadSubmissions,
  saveSubmissions,
  buildSandboxHtml,
} from "@/lib/mystery";

export interface UseMysteryReturn {
  challenges: MysteryChallenge[];
  currentChallenge: MysteryChallenge | null;
  currentIndex: number;
  submissions: MysterySubmission[];
  html: string;
  css: string;
  js: string;
  activeTab: "html" | "css" | "javascript";
  isRunning: boolean;
  showHint: boolean;
  userPreview: string;
  targetPreview: string;
  setHtml: (v: string) => void;
  setCss: (v: string) => void;
  setJs: (v: string) => void;
  setActiveTab: (tab: "html" | "css" | "javascript") => void;
  runCode: () => void;
  resetCode: () => void;
  submitCode: () => void;
  selectChallenge: (index: number) => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  toggleHint: () => void;
}

const STARTER_HTML = `<div class="container">
  <h1>Hello, Club 404 AU!</h1>
  <p>Start coding here...</p>
</div>`;

const STARTER_CSS = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Space Grotesk', sans-serif;
  background: #121212;
  color: #ffffff;
}
h1 { color: #0099ff; }`;

const STARTER_JS = `// Your animation code here`;

export function useMystery(): UseMysteryReturn {
  const [challenges] = useState<MysteryChallenge[]>(DEFAULT_CHALLENGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissions, setSubmissions] = useState<MysterySubmission[]>(() => loadSubmissions());
  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [js, setJs] = useState(STARTER_JS);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "javascript">("html");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userPreview, setUserPreview] = useState("");

  const currentChallenge = challenges[currentIndex] || null;

  // Derive target preview from challenge
  const targetPreview = useMemo(() => {
    if (!currentChallenge) return "";
    const htmlMatch = currentChallenge.targetCode.match(/<style>([\s\S]*?)<\/style>/);
    const styleContent = htmlMatch ? htmlMatch[1] : "";
    const bodyMatch = currentChallenge.targetCode.replace(/<style>[\s\S]*?<\/style>/, "").trim();
    const htmlContent = bodyMatch;
    return buildSandboxHtml(htmlContent, styleContent, "");
  }, [currentChallenge]);

  const runCode = useCallback(() => {
    setIsRunning(true);
    const preview = buildSandboxHtml(html, css, js);
    setUserPreview(preview);
    setTimeout(() => setIsRunning(false), 300);
  }, [html, css, js]);

  const resetCode = useCallback(() => {
    setHtml(STARTER_HTML);
    setCss(STARTER_CSS);
    setJs(STARTER_JS);
    setUserPreview("");
  }, []);

  const submitCode = useCallback(() => {
    if (!currentChallenge) return;
    const submission: MysterySubmission = {
      id: Date.now().toString(),
      challengeId: currentChallenge.id,
      userCode: buildSandboxHtml(html, css, js),
      matchPercentage: 0,
      peerVotes: 0,
      status: "pending",
      executedAt: new Date().toISOString(),
    };
    const updated = [...submissions, submission];
    setSubmissions(updated);
    saveSubmissions(updated);
  }, [currentChallenge, html, css, js, submissions]);

  const selectChallenge = useCallback(
    (index: number) => {
      if (index >= 0 && index < challenges.length) {
        setCurrentIndex(index);
        resetCode();
        setShowHint(false);
        setUserPreview("");
      }
    },
    [challenges.length, resetCode]
  );

  const nextChallenge = useCallback(() => {
    if (currentIndex < challenges.length - 1) {
      selectChallenge(currentIndex + 1);
    }
  }, [currentIndex, challenges.length, selectChallenge]);

  const prevChallenge = useCallback(() => {
    if (currentIndex > 0) {
      selectChallenge(currentIndex - 1);
    }
  }, [currentIndex, selectChallenge]);

  const toggleHint = useCallback(() => {
    setShowHint((h) => !h);
  }, []);

  return {
    challenges,
    currentChallenge,
    currentIndex,
    submissions,
    html,
    css,
    js,
    activeTab,
    isRunning,
    showHint,
    userPreview,
    targetPreview,
    setHtml,
    setCss,
    setJs,
    setActiveTab,
    runCode,
    resetCode,
    submitCode,
    selectChallenge,
    nextChallenge,
    prevChallenge,
    toggleHint,
  };
}
