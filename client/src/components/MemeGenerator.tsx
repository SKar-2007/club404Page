import { useState, useCallback } from "react";
import { DEFAULT_TEMPLATES, MemeTemplate } from "@/lib/memes";
import MemeEditor from "./MemeEditor";
import MemePreview from "./MemePreview";

export default function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(
    DEFAULT_TEMPLATES[0]
  );
  const [texts, setTexts] = useState<Record<string, string>>({});

  const handleTextChange = useCallback(
    (fieldId: string, value: string) => {
      setTexts((prev) => ({ ...prev, [fieldId]: value }));
    },
    []
  );

  const handleSelectTemplate = useCallback(
    (template: MemeTemplate) => {
      setSelectedTemplate(template);
      const initialTexts: Record<string, string> = {};
      template.textFields.forEach((field) => {
        initialTexts[field.id] = "";
      });
      setTexts(initialTexts);
    },
    []
  );

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {DEFAULT_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`font-mono text-xs px-3 py-1.5 border-2 transition-colors ${
              selectedTemplate.id === template.id
                ? "border-electric text-electric bg-electric/10"
                : "border-foreground/20 text-muted-foreground hover:border-foreground/40"
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <MemePreview template={selectedTemplate} texts={texts} />
        </div>
        <div>
          <MemeEditor
            template={selectedTemplate}
            texts={texts}
            onTextChange={handleTextChange}
          />
        </div>
      </div>
    </div>
  );
}
