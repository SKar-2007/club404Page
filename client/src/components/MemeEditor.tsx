import { MemeTemplate } from "@/lib/memes";

interface MemeEditorProps {
  template: MemeTemplate;
  texts: Record<string, string>;
  onTextChange: (fieldId: string, value: string) => void;
}

export default function MemeEditor({
  template,
  texts,
  onTextChange,
}: MemeEditorProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
        Edit Text
      </h4>
      {template.textFields.map((field) => (
        <div key={field.id}>
          <label className="font-mono text-[10px] text-muted-foreground block mb-1">
            {field.label}
          </label>
          <input
            type="text"
            value={texts[field.id] || ""}
            onChange={(e) => onTextChange(field.id, e.target.value)}
            placeholder={field.label}
            className="w-full bg-background border-2 border-foreground/20 px-3 py-1.5 font-mono text-sm text-foreground focus:border-electric outline-none transition-colors"
          />
        </div>
      ))}
    </div>
  );
}
