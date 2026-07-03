import { motion } from "framer-motion";
import { CheckCircle, Circle, Wrench } from "lucide-react";
import { ChecklistItem } from "@/lib/mini-games";

interface HackerChecklistProps {
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
}

export default function HackerChecklist({
  items,
  completedCount,
  totalCount,
}: HackerChecklistProps) {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="card-brutal border-neon-green">
      <div className="flex items-center gap-2 mb-3">
        <Wrench className="w-4 h-4 text-neon-green" />
        <h4 className="font-display font-bold text-sm text-foreground">
          Hacker Checklist
        </h4>
      </div>

      <div className="space-y-2 mb-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            {item.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
              </motion.div>
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div
                className={`font-mono text-xs font-bold ${
                  item.completed ? "text-neon-green" : "text-foreground"
                }`}
              >
                {item.label}
              </div>
              {!item.completed && (
                <div className="font-mono text-[10px] text-muted-foreground">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[10px] text-muted-foreground">
          Progress: {completedCount}/{totalCount}
        </span>
        <span className="font-mono text-[10px] text-neon-green">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="w-full h-2 bg-concrete-dark border border-foreground/20 overflow-hidden">
        <motion.div
          className="h-full bg-neon-green"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {completedCount === totalCount && totalCount > 0 && (
        <motion.div
          className="mt-3 py-2 px-3 bg-neon-green/10 border border-neon-green text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-xs text-neon-green font-bold">
            Challenge Complete! You're a real hacker!
          </span>
        </motion.div>
      )}
    </div>
  );
}
