import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { MysteryChallenge } from "@/lib/mystery";
import { Button } from "@/components/ui/button";

interface MysteryChallengeProps {
  challenge: MysteryChallenge;
  targetPreview: string;
  showHint: boolean;
  onToggleHint: () => void;
}

const difficultyConfig = {
  easy: { label: "Easy", color: "text-neon-green border-neon-green" },
  medium: { label: "Medium", color: "text-electric border-electric" },
  hard: { label: "Hard", color: "text-destructive border-destructive" },
};

const categoryConfig: Record<string, string> = {
  "css-animation": "CSS Animation",
  svg: "SVG",
  canvas: "Canvas",
  creative: "Creative",
};

export default function MysteryChallengePanel({
  challenge,
  targetPreview,
  showHint,
  onToggleHint,
}: MysteryChallengeProps) {
  const diff = difficultyConfig[challenge.difficulty];

  return (
    <motion.div
      className="card-brutal border-cyber-blue p-0 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="terminal-block mb-0 rounded-none border-b-2 border-foreground/20">
        <div className="text-cyber-blue">Target Output</div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-sm overflow-hidden border-2 border-foreground/10 mb-4">
          <iframe
            srcDoc={targetPreview}
            className="w-full h-48"
            sandbox="allow-scripts"
            title="Target animation"
          />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span
            className={`font-mono text-xs font-bold uppercase px-2 py-1 border-2 ${diff.color}`}
          >
            {diff.label}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {categoryConfig[challenge.category] || challenge.category}
          </span>
        </div>

        <h3 className="font-display font-bold text-xl text-foreground mb-1">
          {challenge.title}
        </h3>
        <p className="font-mono text-sm text-muted-foreground mb-3">
          {challenge.description}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleHint}
          className="font-mono text-xs border-2 border-foreground/20 hover:border-cyber-blue"
        >
          {showHint ? (
            <EyeOff className="w-3 h-3 mr-1" />
          ) : (
            <Eye className="w-3 h-3 mr-1" />
          )}
          {showHint ? "Hide Hint" : "Show Hint"}
        </Button>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 p-3 bg-concrete border-2 border-foreground/10 font-mono text-xs text-muted-foreground"
          >
            {challenge.hint}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
