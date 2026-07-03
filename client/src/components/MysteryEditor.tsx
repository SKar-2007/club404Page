import { motion } from "framer-motion";
import { Play, RotateCcw, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MysteryEditorProps {
  html: string;
  css: string;
  js: string;
  activeTab: "html" | "css" | "javascript";
  isRunning: boolean;
  userPreview: string;
  currentIndex: number;
  totalChallenges: number;
  onHtmlChange: (v: string) => void;
  onCssChange: (v: string) => void;
  onJsChange: (v: string) => void;
  onTabChange: (tab: "html" | "css" | "javascript") => void;
  onRun: () => void;
  onReset: () => void;
  onSubmit: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const tabs = [
  { key: "html" as const, label: "HTML" },
  { key: "css" as const, label: "CSS" },
  { key: "javascript" as const, label: "JS" },
];

export default function MysteryEditor({
  html,
  css,
  js,
  activeTab,
  isRunning,
  userPreview,
  currentIndex,
  totalChallenges,
  onHtmlChange,
  onCssChange,
  onJsChange,
  onTabChange,
  onRun,
  onReset,
  onSubmit,
  onPrev,
  onNext,
}: MysteryEditorProps) {
  const codeValue = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const onChange = activeTab === "html" ? onHtmlChange : activeTab === "css" ? onCssChange : onJsChange;

  return (
    <motion.div
      className="card-brutal p-0 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="terminal-block mb-0 rounded-none border-b-2 border-foreground/20">
        <div className="text-neon-green">~/club404-au/mystery$</div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-foreground/10">
          {/* Tabs */}
          <div className="flex border-b-2 border-foreground/10 bg-concrete-dark">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  "px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors",
                  activeTab === tab.key
                    ? "text-neon-green border-b-2 border-neon-green bg-concrete"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Area */}
          <div className="relative">
            <textarea
              value={codeValue}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-64 lg:h-80 p-4 bg-background font-mono text-sm text-foreground resize-none focus:outline-none"
              spellCheck={false}
              placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
            />
          </div>
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col">
          <div className="px-3 py-2 bg-concrete-dark border-b-2 border-foreground/10 font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Your Output
          </div>
          <div className="bg-white flex-1 min-h-[200px] lg:min-h-0">
            {userPreview ? (
              <iframe
                srcDoc={userPreview}
                className="w-full h-64 lg:h-80"
                sandbox="allow-scripts"
                title="User preview"
              />
            ) : (
              <div className="w-full h-64 lg:h-80 flex items-center justify-center bg-concrete-dark">
                <p className="font-mono text-sm text-muted-foreground">
                  Click "Run" to see your output
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between p-3 bg-concrete-dark border-t-2 border-foreground/10">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onPrev}
            disabled={currentIndex === 0}
            variant="outline"
            className="h-8 w-8 p-0 border-2 border-foreground/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-mono text-xs text-muted-foreground">
            {currentIndex + 1} / {totalChallenges}
          </span>
          <Button
            size="sm"
            onClick={onNext}
            disabled={currentIndex === totalChallenges - 1}
            variant="outline"
            className="h-8 w-8 p-0 border-2 border-foreground/20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="btn-brutal h-8 font-mono text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="h-8 font-mono text-xs border-2 border-foreground/20"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={onSubmit}
            className="h-8 font-mono text-xs bg-neon-green text-black border-2 border-foreground hover:bg-neon-green/80"
          >
            <Send className="w-3 h-3 mr-1" />
            Submit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
