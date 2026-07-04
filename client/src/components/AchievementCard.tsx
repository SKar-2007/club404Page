import { motion } from "framer-motion";
import { Trophy, Award, TrendingUp, Star } from "lucide-react";
import { Achievement } from "@/lib/hall-of-fame";

interface AchievementCardProps {
  achievement: Achievement;
  index?: number;
}

const TYPE_CONFIG = {
  winner: {
    icon: Trophy,
    color: "text-yellow-400",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-400/10",
    label: "Winner",
  },
  contributor: {
    icon: Award,
    color: "text-electric",
    borderColor: "border-electric",
    bgColor: "bg-electric/10",
    label: "Contributor",
  },
  milestone: {
    icon: TrendingUp,
    color: "text-neon-green",
    borderColor: "border-neon-green",
    bgColor: "bg-neon-green/10",
    label: "Milestone",
  },
  other: {
    icon: Star,
    color: "text-cyber-blue",
    borderColor: "border-cyber-blue",
    bgColor: "bg-cyber-blue/10",
    label: "Achievement",
  },
};

export default function AchievementCard({
  achievement,
  index = 0,
}: AchievementCardProps) {
  const config = TYPE_CONFIG[achievement.type] || TYPE_CONFIG.other;
  const Icon = config.icon;

  const formattedDate = new Date(
    achievement.submittedAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      className={`card-brutal ${config.borderColor} flex items-start gap-4`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className={`flex-shrink-0 w-10 h-10 ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center transform rotate-45`}
        animate={{
          filter: [
            `drop-shadow(0 0 3px hsl(var(--electric) / 0.3))`,
            `drop-shadow(0 0 8px hsl(var(--electric) / 0.5))`,
            `drop-shadow(0 0 3px hsl(var(--electric) / 0.3))`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className={`w-4 h-4 ${config.color} -rotate-45`} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${config.color} ${config.borderColor} border ${config.bgColor}`}
          >
            {config.label}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {formattedDate}
          </span>
        </div>
        <h4 className="font-display font-bold text-sm text-foreground mb-0.5">
          {achievement.title}
        </h4>
        <p className="font-mono text-xs text-muted-foreground mb-1">
          {achievement.description}
        </p>
        <p className="font-mono text-xs text-electric">
          {achievement.memberName}
        </p>
        {achievement.proofUrl && (
          <a
            href={achievement.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-muted-foreground hover:text-electric transition-colors mt-1 inline-block"
          >
            View Proof →
          </a>
        )}
      </div>
    </motion.div>
  );
}
