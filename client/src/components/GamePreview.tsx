import { useRef, useEffect } from "react";

interface GamePreviewProps {
  code: string;
  isRunning: boolean;
}

export default function GamePreview({ code, isRunning }: GamePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
    canvas { display: block; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;

    iframeRef.current.srcdoc = html;
  }, [code, isRunning]);

  return (
    <div className="border-4 border-foreground bg-black overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-concrete border-b border-foreground/10">
        <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
          Game Preview
        </span>
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isRunning ? "bg-yellow-400 animate-pulse" : "bg-neon-green"
            }`}
          />
          <span className="text-muted-foreground font-mono text-xs">
            {isRunning ? "Running" : "Ready"}
          </span>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full border-0"
        style={{ height: "400px" }}
        sandbox="allow-scripts"
        title="Game Preview"
      />
    </div>
  );
}
