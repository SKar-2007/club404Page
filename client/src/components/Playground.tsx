import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayground } from "@/hooks/use-playground";
import { useCodeGolf } from "@/hooks/use-code-golf";
import { useMystery } from "@/hooks/use-mystery";
import MemeGenerator from "@/components/MemeGenerator";
import MiniGames from "@/components/MiniGames";
import { Button } from "@/components/ui/button";
import CodeGolfChallenge from "@/components/CodeGolfChallenge";
import CodeGolfEditor from "@/components/CodeGolfEditor";
import CodeGolfLeaderboard from "@/components/CodeGolfLeaderboard";
import ModChallengePanel from "@/components/ModChallengePanel";
import MysteryChallengePanel from "@/components/MysteryChallenge";
import MysteryEditor from "@/components/MysteryEditor";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  ChevronDown,
  Target,
  Code2,
  Crosshair,
} from "lucide-react";

type PlaygroundMode = "playground" | "codegolf" | "mystery" | "memes" | "games";

interface PlaygroundProps {
  mode?: "embedded" | "fullpage";
}

export default function Playground({ mode = "embedded" }: PlaygroundProps) {
  const {
    languageId,
    code,
    isRunning,
    output,
    previewSrc,
    currentLang,
    languages,
    setLanguage,
    updateCode,
    runCode,
    reset,
    copyCode,
    handleConsoleMessage,
  } = usePlayground();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "output">("editor");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [playgroundMode, setPlaygroundMode] = useState<PlaygroundMode>("playground");

  // Code Golf hook
  const codeGolf = useCodeGolf();

  // Mystery Output hook
  const mystery = useMystery();

  useEffect(() => {
    window.addEventListener("message", handleConsoleMessage);
    return () => window.removeEventListener("message", handleConsoleMessage);
  }, [handleConsoleMessage]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    copyCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const newVal = val.substring(0, start) + "  " + val.substring(end);
      updateCode(newVal);
      // Restore cursor
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
  };

  const isWebMode = currentLang.method === "iframe" && currentLang.id === "html-css-js";
  const isJsMode = currentLang.method === "iframe" && currentLang.id === "javascript";

  const containerClass =
    mode === "fullpage"
      ? "min-h-[calc(100vh-5rem)] pt-24 pb-12"
      : "py-20";

  return (
    <section
      id="playground"
      className={`${containerClass} bg-concrete-dark relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-32 h-32 bg-electric/5 border-2 border-electric/20 transform rotate-12" />
        <div className="absolute bottom-16 right-16 w-24 h-24 bg-neon-green/5 border-2 border-neon-green/20 transform -rotate-12" />
        <div className="absolute top-1/2 right-1/4 w-2 h-40 bg-cyber-blue/10 transform rotate-45" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          {mode === "embedded" && (
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-black text-4xl md:text-6xl mb-4 text-foreground">
                Try It <span className="text-electric">Yourself</span>
              </h2>
              <div className="terminal-block max-w-xl mx-auto">
                <div className="text-foreground">
                  $ club404.playground.init()
                </div>
              </div>
              <div className="divider-brutal mt-6" />
            </motion.div>
          )}

          {/* Terminal window chrome */}
          <motion.div
            className="playground-window"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Title bar */}
            <div className="playground-titlebar">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d4a528]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-xs">
                <Terminal className="w-3.5 h-3.5" />
                <span>~/club404-au/</span>
                <span className="text-electric font-bold">
                  {playgroundMode === "playground"
                    ? "playground"
                    : playgroundMode === "codegolf"
                    ? "codegolf"
                    : playgroundMode === "mystery"
                    ? "mystery"
                    : playgroundMode === "games"
                    ? "games"
                    : "memes"}
                </span>
                <span>$</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPlaygroundMode("playground")}
                  className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    playgroundMode === "playground"
                      ? "bg-electric text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  Playground
                </button>
                <button
                  onClick={() => setPlaygroundMode("codegolf")}
                  className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    playgroundMode === "codegolf"
                      ? "bg-neon-green text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Target className="w-3 h-3" />
                  Code Golf
                </button>
                <button
                  onClick={() => setPlaygroundMode("mystery")}
                  className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    playgroundMode === "mystery"
                      ? "bg-cyber-blue text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Crosshair className="w-3 h-3" />
                  Mystery
                </button>
                <button
                  onClick={() => setPlaygroundMode("memes")}
                  className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    playgroundMode === "memes"
                      ? "bg-yellow-400 text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-[10px]">😂</span>
                  Memes
                </button>
                <button
                  onClick={() => setPlaygroundMode("games")}
                  className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    playgroundMode === "games"
                      ? "bg-red-400 text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-[10px]">🎮</span>
                  Games
                </button>
              </div>
            </div>

            {/* Language dropdown + controls bar — only show in playground mode */}
            {playgroundMode === "playground" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 py-2.5 bg-concrete-dark border-b-2 border-foreground/20">
              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="playground-lang-btn"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: currentLang.color }}
                  />
                  <span className="font-mono text-sm font-bold">
                    {currentLang.label}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      langDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="playground-lang-dropdown"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => {
                            setLanguage(l.id);
                            setLangDropdownOpen(false);
                          }}
                          className={`playground-lang-option ${
                            languageId === l.id ? "playground-lang-option-active" : ""
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: l.color }}
                          />
                          <span className="font-mono text-sm">{l.label}</span>
                          {l.method === "piston" && (
                            <span className="ml-auto text-[10px] text-muted-foreground/50 font-mono">
                              API
                            </span>
                          )}
                          {l.method === "pyodite" && (
                            <span className="ml-auto text-[10px] text-muted-foreground/50 font-mono">
                              WASM
                            </span>
                          )}
                          {l.method === "iframe" && l.id === "html-css-js" && (
                            <span className="ml-auto text-[10px] text-muted-foreground/50 font-mono">
                              Browser
                            </span>
                          )}
                          {l.method === "iframe" && l.id === "javascript" && (
                            <span className="ml-auto text-[10px] text-muted-foreground/50 font-mono">
                              Browser
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:block w-px h-6 bg-foreground/20" />

              {/* Keyboard shortcut hint */}
              <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground/50 font-mono text-[10px] ml-auto">
                <kbd className="px-1 py-0.5 border border-foreground/20 rounded text-[10px]">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 border border-foreground/20 rounded text-[10px]">
                  Enter
                </kbd>
                <span className="ml-1">to run</span>
              </div>
            </div>
            )}

            {/* Code Golf content */}
            {playgroundMode === "codegolf" && (
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-4 space-y-4">
                  <ModChallengePanel
                    onChallengesUpdated={() => {
                      // Force hook to re-read challenges
                      window.dispatchEvent(new Event("codegolf-refresh"));
                    }}
                  />
                  {codeGolf.currentChallenge ? (
                    <CodeGolfChallenge
                      challenge={codeGolf.currentChallenge}
                      allChallenges={codeGolf.allChallenges}
                      timeRemaining={codeGolf.timeRemaining}
                      lastResult={codeGolf.lastResult}
                      difficulty={codeGolf.difficulty}
                      difficultyIndex={codeGolf.difficultyIndex}
                      difficultyTotal={codeGolf.difficultyTotal}
                      onSetDifficulty={codeGolf.setDifficulty}
                      onNext={codeGolf.nextChallenge}
                      onPrev={codeGolf.prevChallenge}
                      onSelectChallenge={codeGolf.selectChallenge}
                    />
                  ) : (
                    <div className="card-brutal border-muted-foreground/20 p-8 text-center">
                      <p className="font-mono text-sm text-muted-foreground">
                        No challenges available right now.
                      </p>
                      <p className="font-mono text-xs text-muted-foreground/50 mt-2">
                        Challenges refresh daily at 12:00 AM IST.
                      </p>
                    </div>
                  )}
                  {codeGolf.currentChallenge && (
                    <CodeGolfEditor
                      code={codeGolf.code}
                      charCount={codeGolf.charCount}
                      isRunning={codeGolf.isRunning}
                      username={codeGolf.username}
                      onCodeChange={codeGolf.setCode}
                      onRun={codeGolf.runCode}
                      onSubmit={codeGolf.submitCode}
                      onReset={codeGolf.resetCode}
                      onUsernameChange={codeGolf.setUsername}
                    />
                  )}
                </div>
                <div className="hidden md:block w-[2px] bg-foreground/20 shrink-0" />
                <div className="w-full md:w-72 p-4">
                  <CodeGolfLeaderboard
                    leaderboard={codeGolf.leaderboard}
                    submissions={codeGolf.submissions}
                    challenges={codeGolf.allChallenges}
                    currentUser={codeGolf.username}
                  />
                </div>
              </div>
            )}

            {/* Mystery Output content */}
            {playgroundMode === "mystery" && mystery.currentChallenge && (
              <div className="p-4">
                {/* Challenge selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mystery.challenges.map((ch, i) => (
                    <button
                      key={ch.id}
                      onClick={() => mystery.selectChallenge(i)}
                      className={`font-mono text-xs px-3 py-1.5 border-2 transition-colors ${
                        i === mystery.currentIndex
                          ? "border-cyber-blue text-cyber-blue bg-cyber-blue/10"
                          : "border-foreground/20 text-muted-foreground hover:border-foreground/40"
                      }`}
                    >
                      {ch.title}
                    </button>
                  ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  <MysteryChallengePanel
                    challenge={mystery.currentChallenge}
                    targetPreview={mystery.targetPreview}
                    showHint={mystery.showHint}
                    onToggleHint={mystery.toggleHint}
                  />
                  <MysteryEditor
                    html={mystery.html}
                    css={mystery.css}
                    js={mystery.js}
                    activeTab={mystery.activeTab}
                    isRunning={mystery.isRunning}
                    userPreview={mystery.userPreview}
                    currentIndex={mystery.currentIndex}
                    totalChallenges={mystery.challenges.length}
                    onHtmlChange={mystery.setHtml}
                    onCssChange={mystery.setCss}
                    onJsChange={mystery.setJs}
                    onTabChange={mystery.setActiveTab}
                    onRun={mystery.runCode}
                    onReset={mystery.resetCode}
                    onSubmit={mystery.submitCode}
                    onPrev={mystery.prevChallenge}
                    onNext={mystery.nextChallenge}
                  />
                </div>
              </div>
            )}

            {/* Memes content */}
            {playgroundMode === "memes" && (
              <MemeGenerator />
            )}

            {/* Games content */}
            {playgroundMode === "games" && (
              <MiniGames />
            )}

            {/* Mobile view toggle */}
            {playgroundMode === "playground" && (
            <div className="md:hidden flex border-b-2 border-foreground">
              <button
                onClick={() => setMobileView("editor")}
                className={`flex-1 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                  mobileView === "editor"
                    ? "bg-electric text-black"
                    : "bg-concrete text-muted-foreground"
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setMobileView("output")}
                className={`flex-1 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                  mobileView === "output"
                    ? "bg-electric text-black"
                    : "bg-concrete text-muted-foreground"
                }`}
              >
                {isWebMode || isJsMode ? "Preview" : "Output"}
              </button>
            </div>
            )}

            {/* Main body — playground mode only */}
            {playgroundMode === "playground" && (
            <div className="flex flex-col md:flex-row">
              {/* Editor pane */}
              <div
                className={`playground-editor-pane ${
                  mobileView !== "editor" ? "hidden md:flex" : "flex"
                }`}
              >
                {/* Code area */}
                <div className="playground-code-wrapper">
                  <div className="playground-line-numbers" aria-hidden="true">
                    {code.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    ref={textareaRef}
                    className="playground-textarea"
                    value={code}
                    onChange={(e) => updateCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder={`Write ${currentLang.label} code here...`}
                  />
                </div>
              </div>

              {/* Resize handle (desktop only) */}
              <div className="hidden md:block w-[2px] bg-foreground/20 shrink-0" />

              {/* Preview / Output pane */}
              <div
                className={`playground-preview-pane ${
                  mobileView !== "output" ? "hidden md:flex" : "flex"
                }`}
              >
                <div className="playground-preview-header">
                  <span className="text-muted-foreground font-mono text-xs">
                    {isWebMode || isJsMode ? "PREVIEW" : "OUTPUT"}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isRunning
                          ? "bg-yellow-400 animate-pulse"
                          : "bg-neon-green"
                      }`}
                    />
                    <span className="text-muted-foreground font-mono text-xs">
                      {isRunning ? "Running..." : "Ready"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 bg-white relative">
                  {/* Web / JS: iframe preview */}
                  {(isWebMode || isJsMode) && (
                    <>
                      {previewSrc ? (
                        <iframe
                          ref={iframeRef}
                          srcDoc={previewSrc}
                          className="w-full h-full border-0"
                          sandbox="allow-scripts"
                          title="Playground preview"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-concrete-dark">
                          <div className="text-center space-y-3">
                            <div className="w-12 h-12 mx-auto border-2 border-muted-foreground/30 rounded-lg flex items-center justify-center">
                              <Play className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                              Click Run to see output
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Compiled / Python: text output */}
                  {!(isWebMode || isJsMode) && (
                    <div className="w-full h-full bg-concrete-dark p-4 overflow-auto font-mono text-sm">
                      {output.length > 0 ? (
                        output.map((line, i) => (
                          <div
                            key={i}
                            className={`py-0.5 whitespace-pre-wrap break-all ${
                              line.startsWith("×") || line.startsWith("  ")
                                ? "text-red-400"
                                : "text-foreground"
                            }`}
                          >
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <div className="w-12 h-12 mx-auto border-2 border-muted-foreground/30 rounded-lg flex items-center justify-center">
                              <Play className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                            <p className="font-mono text-sm text-muted-foreground">
                              Click Run to execute
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Console output — web mode only, playground mode */}
            {playgroundMode === "playground" && (isWebMode || isJsMode) && output.length > 0 && (
              <div className="border-t-2 border-foreground/20">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-concrete border-b border-foreground/10">
                  <Terminal className="w-3 h-3 text-neon-green" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Console
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/50">
                    ({output.length})
                  </span>
                </div>
                <div
                  ref={consoleRef}
                  className="playground-console max-h-32 overflow-y-auto"
                >
                  {output.map((line, i) => (
                    <div key={i} className="playground-console-line">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Control bar — playground mode only */}
            {playgroundMode === "playground" && (
            <div className="playground-controls">
              <div className="flex items-center gap-2">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="btn-brutal text-xs px-4 py-2 gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isRunning
                    ? currentLang.method === "piston"
                      ? "Compiling..."
                      : "Running..."
                    : "Run Code"}
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  className="font-mono text-xs px-3 py-2 gap-1.5 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="font-mono text-xs px-3 py-2 gap-1.5 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-neon-green" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                {isRunning ? (
                  <span className="text-neon-green">Executing...</span>
                ) : (
                  <span>
                    {currentLang.method === "piston"
                      ? "Ready (via Piston API)"
                      : currentLang.method === "pyodite"
                      ? "Ready (via Pyodite)"
                      : "Ready"}
                  </span>
                )}
              </div>
            </div>
            )}
          </motion.div>

          {/* Full page link */}
          {mode === "embedded" && (
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <a
                href="/playground"
                className="font-mono text-sm text-electric hover:text-foreground transition-colors inline-flex items-center gap-2 group"
              >
                <span>Open Full Editor</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
