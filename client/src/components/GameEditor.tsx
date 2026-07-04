import { useRef, useEffect } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export default function GameEditor({
  code,
  onCodeChange,
  onRun,
  onReset,
  isRunning,
}: GameEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [code]);

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
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5 bg-concrete border-b border-foreground/10">
        <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
          Code Editor
        </span>
        <div className="flex items-center gap-1.5 text-muted-foreground/50 font-mono text-[10px]">
          <kbd className="px-1 py-0.5 border border-foreground/20 rounded text-[10px]">Tab</kbd>
          <span>for indent</span>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-concrete-dark text-muted-foreground/40 font-mono text-xs text-right pr-2 pt-3 select-none overflow-hidden">
          {code.split("\n").map((_, i) => (
            <div key={i} style={{ lineHeight: "1.6" }}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="w-full h-full resize-none bg-card text-foreground font-mono text-sm p-3 pl-12 outline-none border-none"
          style={{ lineHeight: "1.6", tabSize: 2, minHeight: "200px" }}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Write your game code here..."
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-concrete border-t-2 border-foreground/20">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="btn-brutal text-xs px-4 py-2 gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          {isRunning ? "Running..." : "Run"}
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="font-mono text-xs px-3 py-2 gap-1.5 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
