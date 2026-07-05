export type ExecutionMethod = "iframe" | "pyodite";

export interface LanguageDef {
  id: string;
  label: string;
  method: ExecutionMethod;
  color: string;
  defaultCode: string;
}

export const LANGUAGES: LanguageDef[] = [
  {
    id: "html-css-js",
    label: "HTML/CSS/JS",
    method: "iframe",
    color: "electric",
    defaultCode: `<!-- HTML -->
<div class="container">
  <h1>Hello, Club 404 AU!</h1>
  <button onclick="changeColor()">Click Me</button>
</div>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #121212;
  color: #fff;
  font-family: sans-serif;
}
h1 { color: #0099ff; }
button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #0099ff;
  color: #000;
  border: 3px solid #fff;
  font-weight: bold;
  cursor: pointer;
}
</style>

<script>
function changeColor() {
  const colors = ['#0099ff', '#00ff88', '#ff0066'];
  document.querySelector('h1').style.color =
    colors[Math.floor(Math.random() * colors.length)];
}
</script>`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    method: "iframe",
    color: "#f7df1e",
    defaultCode: `// JavaScript — runs in browser
console.log("Hello, Club 404 AU!");

// Array methods
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
console.log("Doubled:", doubled);

// Object
const club = { name: "Club 404 AU", members: 150 };
console.log(\`\${club.name} has \${club.members} members\`);

// Random color
const colors = ["#0099ff", "#00ff88", "#ff0066"];
console.log("Random:", colors[Math.floor(Math.random() * colors.length)]);`,
  },
  {
    id: "python",
    label: "Python",
    method: "pyodite",
    color: "#3776ab",
    defaultCode: `# Python — runs in browser via Pyodite
def greet(name):
    return f"Hello, {name}!"

# List comprehension
squares = [x**2 for x in range(10)]
print("Squares:", squares)

# Dictionary
club = {
    "name": "Club 404 AU",
    "uni": "Aliah University",
    "members": 150
}
for key, value in club.items():
    print(f"{key}: {value}")

# F-string
print(greet("World"))
print("Error 404: Limits not found.")`,
  },
];

export function getLanguageById(id: string): LanguageDef {
  return LANGUAGES.find((l) => l.id === id) || LANGUAGES[0];
}
