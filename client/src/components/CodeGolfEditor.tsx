import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Send, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeGolfEditorProps {
  code: string;
  charCount: number;
  isRunning: boolean;
  username: string;
  isLoggedIn: boolean;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  onUsernameChange: (name: string) => void;
}

export default function CodeGolfEditor({
  code,
  charCount,
  isRunning,
  username,
  isLoggedIn,
  onCodeChange,
  onRun,
  onSubmit,
  onReset,
  onUsernameChange,
}: CodeGolfEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const newVal = val.substring(0, start) + "  " + val.substring(end);
      onCodeChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
    }
  };

  const handleSubmit = () => {
    if (!isLoggedIn && !username.trim()) {
      setShowUsernameInput(true);
      return;
    }
    onSubmit();
  };

  return (
    <div className="flex flex-col border-2 border-foreground/20 bg-card">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-concrete border-b-2 border-foreground/20">
        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-xs">
          <span>~/club404-au/codegolf$</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-card border-2 border-foreground/30 font-mono text-xs">
            <Hash className="w-3 h-3 text-electric" />
            <span className="text-electric font-bold">{charCount}</span>
            <span className="text-muted-foreground">chars</span>
          </div>
        </div>
      </div>

      {/* Username input (shown when needed) */}
      {showUsernameInput && (
        <motion.div
          className="px-4 py-2 bg-card border-b-2 border-foreground/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              Username:
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="Enter your username"
              className="flex-1 h-7 px-2 bg-background border-2 border-foreground/30 font-mono text-xs focus:border-electric outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && username.trim()) {
                  setShowUsernameInput(false);
                  onSubmit();
                }
              }}
              autoFocus
            />
            <Button
              onClick={() => {
                if (username.trim()) {
                  setShowUsernameInput(false);
                  onSubmit();
                }
              }}
              className="h-7 px-3 font-mono text-xs"
            >
              OK
            </Button>
          </div>
        </motion.div>
      )}

      {/* Code area */}
      <div className="relative overflow-hidden" style={{ minHeight: "200px" }}>
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-concrete-dark text-muted-foreground/40 font-mono text-xs text-right pr-2 pt-3 select-none overflow-hidden" style={{ lineHeight: "1.6" }}>
          {code.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="w-full resize-none bg-card text-foreground font-mono text-sm p-3 pl-12 outline-none border-none"
          style={{ lineHeight: "1.6", tabSize: 2, minHeight: "200px" }}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Write your code golf solution here..."
        />
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-concrete border-t-2 border-foreground/20">
        <div className="flex items-center gap-2">
          <Button
            onClick={onRun}
            disabled={isRunning}
            className="btn-brutal text-xs px-3 py-1.5 gap-1"
          >
            <Play className="w-3 h-3" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="outline"
            className="font-mono text-xs px-3 py-1.5 gap-1 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background"
          >
            <Send className="w-3 h-3" />
            Submit
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="font-mono text-xs px-3 py-1.5 gap-1 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          <kbd className="px-1 py-0.5 border border-foreground/20 rounded text-[10px]">
            Ctrl
          </kbd>
          <span className="mx-0.5">+</span>
          <kbd className="px-1 py-0.5 border border-foreground/20 rounded text-[10px]">
            Enter
          </kbd>
          <span className="ml-1">to run</span>
        </div>
      </div>
    </div>
  );
}
