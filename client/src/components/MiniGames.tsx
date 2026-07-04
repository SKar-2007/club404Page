import { useState, useCallback, useMemo } from "react";
import { DEFAULT_TEMPLATES, GameTemplate, ChecklistItem } from "@/lib/mini-games";
import GamePreview from "./GamePreview";
import GameEditor from "./GameEditor";
import HackerChecklist from "./HackerChecklist";

export default function MiniGames() {
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate>(
    DEFAULT_TEMPLATES[0]
  );
  const [code, setCode] = useState(DEFAULT_TEMPLATES[0].starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [rawChecklist, setRawChecklist] = useState<ChecklistItem[]>(
    DEFAULT_TEMPLATES[0].checklist
  );

  const checklist = useMemo(() => {
    return rawChecklist.map((item) => {
      if (item.completed) return item;
      const regex = new RegExp(item.pattern, "i");
      return { ...item, completed: regex.test(code) };
    });
  }, [code, rawChecklist]);

  const handleSelectTemplate = useCallback(
    (template: GameTemplate) => {
      setSelectedTemplate(template);
      setCode(template.starterCode);
      setRawChecklist(template.checklist.map((item) => ({ ...item, completed: false })));
      setIsRunning(false);
    },
    []
  );

  const handleRun = () => {
    setIsRunning(false);
    setTimeout(() => setIsRunning(true), 100);
  };

  const handleReset = () => {
    setCode(selectedTemplate.starterCode);
    setRawChecklist(selectedTemplate.checklist.map((item) => ({ ...item, completed: false })));
    setIsRunning(false);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner":
        return "text-neon-green border-neon-green bg-neon-green/10";
      case "intermediate":
        return "text-electric border-electric bg-electric/10";
      case "advanced":
        return "text-red-400 border-red-400 bg-red-400/10";
      default:
        return "text-muted-foreground border-foreground/20";
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {DEFAULT_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`font-mono text-xs px-3 py-1.5 border-2 transition-colors ${
              selectedTemplate.id === template.id
                ? "border-neon-green text-neon-green bg-neon-green/10"
                : "border-foreground/20 text-muted-foreground hover:border-foreground/40"
            }`}
          >
            {template.name}
            <span className={`ml-1.5 text-[9px] px-1 py-0.5 border ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-3">
        <p className="font-mono text-xs text-muted-foreground">
          {selectedTemplate.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div>
          <GamePreview code={code} isRunning={isRunning} />
        </div>
        <div>
          <GameEditor
            code={code}
            onCodeChange={setCode}
            onRun={handleRun}
            onReset={handleReset}
            isRunning={isRunning}
          />
        </div>
      </div>

      <HackerChecklist
        items={checklist}
        completedCount={completedCount}
        totalCount={checklist.length}
      />
    </div>
  );
}
