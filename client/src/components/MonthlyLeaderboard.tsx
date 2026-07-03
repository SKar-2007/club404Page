import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, User } from "lucide-react";
import { LeaderboardEntry } from "@/lib/hall-of-fame";

interface MonthlyLeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

export default function MonthlyLeaderboard({
  leaderboard,
}: MonthlyLeaderboardProps) {
  const now = new Date();
  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
          <Trophy className="w-5 h-5 text-yellow-400" />
        </motion.div>
      );
    if (index === 1)
      return (
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Medal className="w-5 h-5 text-gray-300" />
        </motion.div>
      );
    if (index === 2)
      return (
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <Medal className="w-5 h-5 text-amber-600" />
        </motion.div>
      );
    return (
      <span className="w-5 h-5 flex items-center justify-center font-mono text-sm text-muted-foreground">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="card-brutal border-electric h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
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
          <TrendingUp className="w-5 h-5 text-yellow-400" />
        </motion.div>
        <h3 className="font-display font-bold text-sm text-foreground">
          Monthly Leaderboard
        </h3>
      </div>

      <div className="font-mono text-[10px] text-muted-foreground mb-4">
        {monthName}
      </div>

      {leaderboard.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <User className="w-10 h-10 mx-auto text-muted-foreground/30" />
            <p className="font-mono text-xs text-muted-foreground">
              No activity yet this month
            </p>
            <p className="font-mono text-xs text-muted-foreground/50">
              Be the first to contribute!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              className="flex items-center gap-3 p-2 border-2 border-foreground/10 bg-card/50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="w-6 flex justify-center">{getRankIcon(index)}</div>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs font-bold text-foreground truncate">
                  {entry.memberName}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-sm font-bold text-electric">
                  {entry.contributions}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {entry.contributions === 1 ? "contrib" : "contribs"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
