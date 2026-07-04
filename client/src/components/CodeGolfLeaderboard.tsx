import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, User } from "lucide-react";
import { LeaderboardEntry, Submission, Challenge } from "@/lib/code-golf";

interface CodeGolfLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  submissions: Submission[];
  challenges: Challenge[];
  currentUser?: string;
}

type Filter = "all" | "easy" | "medium" | "hard";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  easy: "Easy",
  medium: "Med",
  hard: "Hard",
};

const FILTER_COLORS: Record<Filter, string> = {
  all: "text-electric border-electric bg-electric/10",
  easy: "text-neon-green border-neon-green bg-neon-green/10",
  medium: "text-electric border-electric bg-electric/10",
  hard: "text-red-400 border-red-400 bg-red-400/10",
};

export default function CodeGolfLeaderboard({
  leaderboard,
  submissions,
  challenges,
  currentUser,
}: CodeGolfLeaderboardProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const challengeMap = new Map(challenges.map((c) => [c.id, c]));

  const filteredSubmissions =
    filter === "all"
      ? submissions
      : submissions.filter((s) => {
          const ch = challengeMap.get(s.challengeId);
          return ch?.difficulty === filter;
        });

  const passed = filteredSubmissions.filter((s) => s.status === "PASSED");

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

  const sorted = Array.from(userMap.entries())
    .map(([username, data]) => ({
      username,
      bestCharCount: data.best,
      totalSubmissions: data.total,
      challengesSolved: data.solved.size,
    }))
    .sort((a, b) => a.bestCharCount - b.bestCharCount);

  const getRankIcon = (index: number) => {
    if (index === 0)
      return (
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 3px hsl(48 96% 53%))",
              "drop-shadow(0 0 10px hsl(48 96% 53%))",
              "drop-shadow(0 0 3px hsl(48 96% 53%))",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
        </motion.div>
      );
    if (index === 1)
      return (
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Medal className="w-4 h-4 text-gray-300" />
        </motion.div>
      );
    if (index === 2)
      return (
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <Medal className="w-4 h-4 text-amber-600" />
        </motion.div>
      );
    return (
      <span className="w-4 h-4 flex items-center justify-center font-mono text-xs text-muted-foreground">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="card-brutal border-electric/30 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className="relative"
          animate={{
            filter: [
              "drop-shadow(0 0 4px hsl(48 96% 53%))",
              "drop-shadow(0 0 12px hsl(48 96% 53%))",
              "drop-shadow(0 0 4px hsl(48 96% 53%))",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
          </motion.div>
        </motion.div>
        <h3 className="font-display font-bold text-sm text-foreground">
          Leaderboard
        </h3>
      </div>

      {/* Difficulty filter tabs */}
      <div className="flex gap-1 mb-3">
        {(["all", "easy", "medium", "hard"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border-2 transition-colors ${
              filter === f
                ? FILTER_COLORS[f]
                : "text-muted-foreground border-foreground/20 hover:border-foreground/40"
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <User className="w-8 h-8 mx-auto text-muted-foreground/30" />
            <p className="font-mono text-xs text-muted-foreground">
              No{filter !== "all" ? " " + filter : ""} solutions yet
            </p>
            <p className="font-mono text-xs text-muted-foreground/50">
              Be the first to solve a challenge!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {sorted.map((entry, index) => (
            <motion.div
              key={entry.username}
              className={`flex items-center gap-3 p-2 border-2 ${
                entry.username === currentUser
                  ? "border-electric bg-electric/5"
                  : "border-foreground/10 bg-card/50"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="w-6 flex justify-center">
                {getRankIcon(index)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs font-bold text-foreground truncate">
                  @{entry.username}
                  {entry.username === currentUser && (
                    <span className="text-electric ml-1">(you)</span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {entry.challengesSolved} solved
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-sm font-bold text-electric">
                  {entry.bestCharCount}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  chars
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
