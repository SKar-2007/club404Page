import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemeTemplate } from "@/lib/memes";

interface MemePreviewProps {
  template: MemeTemplate;
  texts: Record<string, string>;
}

export default function MemePreview({ template, texts }: MemePreviewProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = template.imageUrl;
    link.target = "_blank";
    link.download = `${template.name.toLowerCase().replace(/\s+/g, "-")}-meme`;
    link.click();
  };

  return (
    <div className="space-y-3">
      <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
        Preview
      </h4>

      <div className="border-4 border-foreground overflow-hidden bg-concrete-dark">
        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
          <img
            src={template.imageUrl}
            alt={template.name}
            className="absolute inset-0 w-full h-full object-contain"
          />

          {template.textFields.map((field) => {
            const text = texts[field.id] || field.label;
            return (
              <div
                key={field.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${field.position.x}%`,
                  top: `${field.position.y}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: "clamp(14px, 3vw, 22px)",
                  fontFamily: "Impact, Arial Black, sans-serif",
                  fontWeight: "bold",
                  color: field.style.color,
                  textShadow:
                    field.style.strokeWidth > 0
                      ? `
                        -${field.style.strokeWidth}px -${field.style.strokeWidth}px 0 ${field.style.strokeColor},
                        ${field.style.strokeWidth}px -${field.style.strokeWidth}px 0 ${field.style.strokeColor},
                        -${field.style.strokeWidth}px ${field.style.strokeWidth}px 0 ${field.style.strokeColor},
                        ${field.style.strokeWidth}px ${field.style.strokeWidth}px 0 ${field.style.strokeColor}
                      `
                      : "none",
                  textAlign: "center",
                  maxWidth: "45%",
                  lineHeight: "1.2",
                  wordBreak: "break-word",
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleDownload}
        className="btn-brutal w-full flex items-center justify-center gap-2 text-sm"
      >
        <Download className="w-4 h-4" />
        Open Original
      </Button>
    </div>
  );
}
