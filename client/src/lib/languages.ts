export type ExecutionMethod = "iframe" | "pyodite" | "piston";

export interface LanguageDef {
  id: string;
  label: string;
  pistonLang: string;
  pistonVersion: string;
  method: ExecutionMethod;
  color: string;
  defaultCode: string;
}

export const LANGUAGES: LanguageDef[] = [
  {
    id: "html-css-js",
    label: "HTML/CSS/JS",
    pistonLang: "",
    pistonVersion: "",
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
    pistonLang: "javascript",
    pistonVersion: "18.15.0",
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
    pistonLang: "python",
    pistonVersion: "3.10.0",
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
  {
    id: "c",
    label: "C",
    pistonLang: "c",
    pistonVersion: "10.2.0",
    method: "piston",
    color: "#a8b9cc",
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, Club 404 AU!\\n");

    // Array
    int nums[] = {1, 2, 3, 4, 5};
    int len = sizeof(nums) / sizeof(nums[0]);

    printf("Numbers: ");
    for (int i = 0; i < len; i++) {
        printf("%d ", nums[i]);
    }
    printf("\\n");

    // Sum
    int sum = 0;
    for (int i = 0; i < len; i++) {
        sum += nums[i];
    }
    printf("Sum: %d\\n", sum);

    return 0;
}`,
  },
  {
    id: "cpp",
    label: "C++",
    pistonLang: "c++",
    pistonVersion: "10.2.0",
    method: "piston",
    color: "#00599c",
    defaultCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello, Club 404 AU!" << endl;

    // Vector
    vector<int> nums = {1, 2, 3, 4, 5};
    cout << "Numbers: ";
    for (int n : nums) {
        cout << n << " ";
    }
    cout << endl;

    // String
    string club = "Club 404 AU";
    cout << "Welcome to " << club << "!" << endl;

    return 0;
}`,
  },
  {
    id: "java",
    label: "Java",
    pistonLang: "java",
    pistonVersion: "15.0.2",
    method: "piston",
    color: "#ed8b00",
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Club 404 AU!");

        // Array
        int[] nums = {1, 2, 3, 4, 5};
        System.out.print("Numbers: ");
        for (int n : nums) {
            System.out.print(n + " ");
        }
        System.out.println();

        // String
        String club = "Club 404 AU";
        System.out.println("Welcome to " + club + "!");
    }
}`,
  },
  {
    id: "go",
    label: "Go",
    pistonLang: "go",
    pistonVersion: "1.16.2",
    method: "piston",
    color: "#00add8",
    defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Club 404 AU!")

    // Slice
    nums := []int{1, 2, 3, 4, 5}
    fmt.Print("Numbers: ")
    for _, n := range nums {
        fmt.Print(n, " ")
    }
    fmt.Println()

    // Map
    club := map[string]string{
        "name":    "Club 404 AU",
        "uni":     "Aliah University",
    }
    for k, v := range club {
        fmt.Printf("%s: %s\\n", k, v)
    }
}`,
  },
  {
    id: "ruby",
    label: "Ruby",
    pistonLang: "ruby",
    pistonVersion: "3.0.1",
    method: "piston",
    color: "#cc342d",
    defaultCode: `# Ruby
puts "Hello, Club 404 AU!"

# Array
nums = [1, 2, 3, 4, 5]
puts "Numbers: #{nums.join(', ')}"

# Map
club = { name: "Club 404 AU", uni: "Aliah University" }
club.each { |k, v| puts "#{k}: #{v}" }

# Block
doubled = nums.map { |n| n * 2 }
puts "Doubled: #{doubled.join(', ')}"`,
  },
  {
    id: "typescript",
    label: "TypeScript",
    pistonLang: "typescript",
    pistonVersion: "5.0.3",
    method: "piston",
    color: "#3178c6",
    defaultCode: `// TypeScript
interface Club {
  name: string;
  members: number;
}

const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};

const club: Club = { name: "Club 404 AU", members: 150 };
console.log(greet(club.name));
console.log(\`\${club.name} has \${club.members} members\`);

// Generic
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const nums: number[] = [1, 2, 3];
console.log("First:", first(nums));`,
  },
  {
    id: "php",
    label: "PHP",
    pistonLang: "php",
    pistonVersion: "8.2.3",
    method: "piston",
    color: "#777bb4",
    defaultCode: `<?php
// PHP
echo "Hello, Club 404 AU!\\n";

// Array
$nums = [1, 2, 3, 4, 5];
echo "Numbers: " . implode(", ", $nums) . "\\n";

// Associative array
$club = [
    "name" => "Club 404 AU",
    "uni" => "Aliah University",
    "members" => 150
];
foreach ($club as $key => $value) {
    echo "$key: $value\\n";
}

// Function
function greet($name) {
    return "Hello, $name!";
}
echo greet("World") . "\\n";
?>`,
  },
  {
    id: "lua",
    label: "Lua",
    pistonLang: "lua",
    pistonVersion: "5.4.4",
    method: "piston",
    color: "#000080",
    defaultCode: `-- Lua
print("Hello, Club 404 AU!")

-- Table
local nums = {1, 2, 3, 4, 5}
io.write("Numbers: ")
for _, v in ipairs(nums) do
    io.write(v .. " ")
end
print()

-- Key-value table
local club = {
    name = "Club 404 AU",
    uni = "Aliah University"
}
for k, v in pairs(club) do
    print(k .. ": " .. v)
end

-- Function
local function greet(name)
    return "Hello, " .. name .. "!"
end
print(greet("World"))`,
  },
  {
    id: "rust",
    label: "Rust",
    pistonLang: "rust",
    pistonVersion: "1.68.2",
    method: "piston",
    color: "#dea584",
    defaultCode: `// Rust
fn main() {
    println!("Hello, Club 404 AU!");

    // Vector
    let nums = vec![1, 2, 3, 4, 5];
    print!("Numbers: ");
    for n in &nums {
        print!("{} ", n);
    }
    println!();

    // String
    let club = "Club 404 AU";
    println!("Welcome to {}!", club);

    // Closure
    let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled);
}`,
  },
];

export function getLanguageById(id: string): LanguageDef {
  return LANGUAGES.find((l) => l.id === id) || LANGUAGES[0];
}
