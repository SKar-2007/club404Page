export interface MysteryChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  targetCode: string;
  hint: string;
  category: "css-animation" | "svg" | "canvas" | "creative";
  createdAt: string;
  expiresAt: string;
}

export interface MysterySubmission {
  id: string;
  challengeId: string;
  userCode: string;
  matchPercentage: number;
  peerVotes: number;
  status: "pending" | "approved" | "needs-work";
  executedAt: string;
}

export const MYSTERY_STORAGE_KEY = "club404-au-mystery-submissions";
export const CHALLENGE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_CHALLENGES: MysteryChallenge[] = [
  {
    id: "mystery-1",
    title: "Pulsing Neon Circle",
    description: "Create a circle that pulses with a neon glow effect.",
    difficulty: "easy",
    targetCode: `<div class="circle"></div>
<style>
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #0099ff;
  animation: pulse 2s infinite;
  box-shadow: 0 0 20px #0099ff;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
</style>`,
    hint: "Use CSS animation with transform: scale()",
    category: "css-animation",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CHALLENGE_EXPIRATION_MS).toISOString(),
  },
  {
    id: "mystery-2",
    title: "Rotating Square",
    description: "Create a square that continuously rotates.",
    difficulty: "easy",
    targetCode: `<div class="square"></div>
<style>
.square {
  width: 80px;
  height: 80px;
  background: #00ff88;
  animation: rotate 3s linear infinite;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>`,
    hint: "Use @keyframes with transform: rotate()",
    category: "css-animation",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CHALLENGE_EXPIRATION_MS).toISOString(),
  },
  {
    id: "mystery-3",
    title: "Gradient Wave",
    description: "Create an animated gradient that shifts colors smoothly.",
    difficulty: "medium",
    targetCode: `<div class="wave"></div>
<style>
.wave {
  width: 100%;
  height: 100px;
  background: linear-gradient(90deg, #0099ff, #00ff88, #ff0066, #0099ff);
  background-size: 300% 100%;
  animation: wave 4s linear infinite;
}
@keyframes wave {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}
</style>`,
    hint: "Use background-size: 300% and animate background-position",
    category: "css-animation",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CHALLENGE_EXPIRATION_MS).toISOString(),
  },
  {
    id: "mystery-4",
    title: "Bouncing Ball",
    description: "Create a ball that bounces up and down.",
    difficulty: "medium",
    targetCode: `<div class="ball"></div>
<style>
.ball {
  width: 50px;
  height: 50px;
  background: #ff0066;
  border-radius: 50%;
  animation: bounce 1s ease-in-out infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-50px); }
}
</style>`,
    hint: "Use translateY with alternating values",
    category: "css-animation",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CHALLENGE_EXPIRATION_MS).toISOString(),
  },
  {
    id: "mystery-5",
    title: "Morphing Blob",
    description: "Create a shape that morphs between circle and square.",
    difficulty: "hard",
    targetCode: `<div class="blob"></div>
<style>
.blob {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #0099ff, #ff0066);
  animation: morph 4s ease-in-out infinite;
}
@keyframes morph {
  0%, 100% { border-radius: 50%; transform: rotate(0deg); }
  25% { border-radius: 30% 70% 70% 30%; }
  50% { border-radius: 50%; transform: rotate(180deg); }
  75% { border-radius: 70% 30% 30% 70%; }
}
</style>`,
    hint: "Animate border-radius with multiple values",
    category: "css-animation",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CHALLENGE_EXPIRATION_MS).toISOString(),
  },
];

export function loadSubmissions(): MysterySubmission[] {
  try {
    const stored = localStorage.getItem(MYSTERY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSubmissions(submissions: MysterySubmission[]) {
  localStorage.setItem(MYSTERY_STORAGE_KEY, JSON.stringify(submissions));
}

export function buildSandboxHtml(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #121212; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try { ${js} } catch(e) { console.error(e.message); }
  <script>
</body>
</html>`;
}
