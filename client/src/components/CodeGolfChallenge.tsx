import { motion } from "framer-motion";
import {
  Timer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Challenge } from "@/lib/code-golf";

interface CodeGolfChallengeProps {
  challenge: Challenge;
  allChallenges: Challenge[];
  timeRemaining: string;
  lastResult: { status: "PASSED" | "FAILED" | "ERROR"; output: string } | null;
  difficulty: "easy" | "medium" | "hard";
  difficultyIndex: number;
  difficultyTotal: number;
  onSetDifficulty: (d: "easy" | "medium" | "hard") => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectChallenge: (id: string) => void;
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    color: "text-neon-green",
    border: "border-neon-green",
    bg: "bg-neon-green/10",
  },
  medium: {
    label: "Medium",
    color: "text-electric",
    border: "border-electric",
    bg: "bg-electric/10",
  },
  hard: {
    label: "Hard",
    color: "text-red-400",
    border: "border-red-400",
    bg: "bg-red-400/10",
  },
};

export default function CodeGolfChallenge({
  challenge,
  allChallenges,
  timeRemaining,
  lastResult,
  difficulty,
  difficultyIndex,
  difficultyTotal,
  onSetDifficulty,
  onNext,
  onPrev,
}: CodeGolfChallengeProps) {
  const diffConfig = DIFFICULTY_CONFIG[difficulty];

  return (
    <motion.div
      className="card-brutal border-neon-green/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      key={challenge.id}
    >
      {/* Top row: difficulty badge, timer, nav arrows */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider ${diffConfig.color} border-2 ${diffConfig.border} ${diffConfig.bg}`}
          >
            {diffConfig.label}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Timer className="w-3.5 h-3.5" />
            <span>{timeRemaining}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={difficultyIndex === 0}
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-muted-foreground min-w-[3ch] text-center">
            {difficultyTotal > 0 ? difficultyIndex + 1 : 0}/{difficultyTotal}
          </span>
          <button
            onClick={onNext}
            disabled={difficultyIndex >= difficultyTotal - 1}
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty tabs with per-difficulty counts */}
      <div className="flex items-center gap-2 mb-4">
        {(["easy", "medium", "hard"] as const).map((diff) => {
          const count = allChallenges.filter((c) => c.difficulty === diff).length;
          const cfg = DIFFICULTY_CONFIG[diff];
          const isActive = difficulty === diff;
          return (
            <button
              key={diff}
              onClick={() => onSetDifficulty(diff)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border-2 transition-colors ${
                isActive
                  ? `${cfg.color} ${cfg.border} ${cfg.bg}`
                  : "text-muted-foreground border-foreground/20 hover:border-foreground/40"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Challenge content */}
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          {challenge.title}
        </h3>

        <p className="font-mono text-sm text-muted-foreground mb-4">
          {challenge.description}
        </p>

        <div className="space-y-2 mb-4">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Test Cases:
          </span>
          {challenge.testCases.map((tc, i) => (
            <div
              key={i}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
            >
              <span className="text-neon-green">&#10003;</span>
              <span>
                Input:{" "}
                <span className="text-foreground">{tc.input || "(empty)"}</span>
              </span>
              <span>&rarr;</span>
              <span>
                Expected:{" "}
                <span className="text-electric">{tc.expectedOutput}</span>
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Result feedback */}
      {lastResult && (
        <motion.div
          className={`p-3 border-2 ${
            lastResult.status === "PASSED"
              ? "border-neon-green bg-neon-green/5"
              : lastResult.status === "FAILED"
              ? "border-red-400 bg-red-400/5"
              : "border-yellow-400 bg-yellow-400/5"
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 font-mono text-sm">
            {lastResult.status === "PASSED" && (
              <>
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green">All test cases passed!</span>
              </>
            )}
            {lastResult.status === "FAILED" && (
              <>
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Some test cases failed</span>
              </>
            )}
            {lastResult.status === "ERROR" && (
              <>
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">
                  Error: {lastResult.output}
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
