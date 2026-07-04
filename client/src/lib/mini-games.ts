export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  starterCode: string;
  checklist: ChecklistItem[];
  category: "physics" | "puzzle" | "arcade" | "creative";
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  pattern: string;
  completed: boolean;
}

export const GAME_STORAGE_KEY = "club404-au-games";

export const DEFAULT_TEMPLATES: GameTemplate[] = [
  {
    id: "bouncing-ball",
    name: "Bouncing Ball",
    description: "A ball bounces with physics. Click to launch, arrow keys to apply force!",
    difficulty: "beginner",
    starterCode: `<canvas id="g" width="400" height="400" style="background:#111"></canvas>
<script>
  const c = document.getElementById('g').getContext('2d');
  let bx=200, by=200, vx=3, vy=0, trail=[];
  // --- TWEAKABLE VARIABLES ---
  const GRAVITY = 0.4;     // Try 0.1 (floaty) or 1.5 (heavy)!
  const BOUNCE = 0.85;     // Try 0.5 (less bounce) or 1.0 (infinite!)
  const BALL_COLOR = '#00ffff'; // Try '#ff0066', 'lime', or 'gold'!
  const BALL_SIZE = 16;    // Try 8 (small) or 32 (big)!
  // ---------------------------
  function draw() {
    c.fillStyle='rgba(0,0,0,0.15)';
    c.fillRect(0,0,400,400);
    // Draw trail
    trail.forEach((t,i) => {
      c.fillStyle = 'rgba(0,255,255,'+((i/trail.length)*0.3)+')';
      c.beginPath();
      c.arc(t.x, t.y, BALL_SIZE/2, 0, Math.PI*2);
      c.fill();
    });
    // Draw ball
    c.fillStyle = BALL_COLOR;
    c.beginPath();
    c.arc(bx, by, BALL_SIZE/2, 0, Math.PI*2);
    c.fill();
    // Draw border glow
    c.strokeStyle = 'rgba(0,255,255,0.3)';
    c.lineWidth = 2;
    c.strokeRect(1,1,398,398);
  }
  function update() {
    vy += GRAVITY;
    bx += vx; by += vy;
    // Bounce off walls
    if(bx < BALL_SIZE/2) { bx = BALL_SIZE/2; vx = -vx * BOUNCE; }
    if(bx > 400-BALL_SIZE/2) { bx = 400-BALL_SIZE/2; vx = -vx * BOUNCE; }
    if(by > 400-BALL_SIZE/2) { by = 400-BALL_SIZE/2; vy = -vy * BOUNCE; }
    if(by < BALL_SIZE/2) { by = BALL_SIZE/2; vy = -vy * BOUNCE; }
    // Store trail
    trail.push({x:bx, y:by});
    if(trail.length > 20) trail.shift();
    draw();
    requestAnimationFrame(update);
  }
  update();
  // Click to launch ball upward
  window.onclick = () => { vy = -12; vx = (Math.random()-0.5)*8; };
  // Arrow keys to apply force
  window.onkeydown = (e) => {
    if(e.key==='ArrowLeft') vx -= 3;
    if(e.key==='ArrowRight') vx += 3;
    if(e.key==='ArrowUp') vy -= 5;
  };
</script>`,
    checklist: [
      { id: "check-gravity", label: "Change GRAVITY", description: "Modify the GRAVITY variable", pattern: "GRAVITY\\s*=\\s*(?!0\\.4)\\d+\\.?\\d*", completed: false },
      { id: "check-bounce", label: "Change BOUNCE", description: "Modify the BOUNCE variable", pattern: "BOUNCE\\s*=\\s*(?!0\\.85)\\d+\\.?\\d*", completed: false },
      { id: "check-color", label: "Change ball color", description: "Modify BALL_COLOR", pattern: "BALL_COLOR\\s*=\\s*['\"]((?!#00ffff)[a-zA-Z#0-9]+)['\"]", completed: false },
      { id: "check-size", label: "Change ball size", description: "Modify BALL_SIZE", pattern: "BALL_SIZE\\s*=\\s*(?!16)\\d+", completed: false },
    ],
    category: "physics",
  },
  {
    id: "snake-game",
    name: "Snake Game",
    description: "Classic snake. Use arrow keys or WASD to move, eat food to grow. Don't hit walls or yourself!",
    difficulty: "intermediate",
    starterCode: `<canvas id="g" width="400" height="400" style="background:#111"></canvas>
<script>
  const c = document.getElementById('g').getContext('2d');
  const S = 20;
  let snake = [{x:10,y:10}], food, dir = {x:1,y:0}, nextDir = {x:1,y:0};
  let score = 0, gameOver = false;
  // --- TWEAKABLE VARIABLES ---
  const SPEED = 120;           // Try 60 (fast) or 200 (slow)!
  const SNAKE_COLOR = '#00ff88'; // Try 'cyan', '#ff0066', or 'gold'!
  const FOOD_COLOR = '#ff0066';  // Try 'lime', 'cyan', or 'yellow'!
  // ---------------------------
  function spawnFood() {
    do { food = {x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)}; }
    while(snake.some(s => s.x===food.x && s.y===food.y));
  }
  spawnFood();
  function draw() {
    c.fillStyle='#111'; c.fillRect(0,0,400,400);
    // Draw grid (subtle)
    c.strokeStyle='rgba(255,255,255,0.03)';
    for(let i=0;i<20;i++) { c.beginPath(); c.moveTo(i*S,0); c.lineTo(i*S,400); c.stroke(); }
    for(let i=0;i<20;i++) { c.beginPath(); c.moveTo(0,i*S); c.lineTo(400,i*S); c.stroke(); }
    // Draw food with glow
    c.fillStyle = FOOD_COLOR;
    c.shadowColor = FOOD_COLOR;
    c.shadowBlur = 10;
    c.fillRect(food.x*S+2, food.y*S+2, S-4, S-4);
    c.shadowBlur = 0;
    // Draw snake
    snake.forEach((s, i) => {
      c.fillStyle = i===0 ? '#ffffff' : SNAKE_COLOR;
      c.shadowColor = SNAKE_COLOR;
      c.shadowBlur = i===0 ? 8 : 4;
      c.fillRect(s.x*S+1, s.y*S+1, S-2, S-2);
    });
    c.shadowBlur = 0;
    // Score
    c.fillStyle='#fff'; c.font='bold 16px monospace';
    c.fillText('Score: '+score, 10, 25);
    // Controls hint
    c.fillStyle='rgba(255,255,255,0.4)'; c.font='10px monospace';
    c.fillText('Arrow Keys / WASD to move', 10, 395);
    if(gameOver) {
      c.fillStyle='rgba(0,0,0,0.7)'; c.fillRect(0,0,400,400);
      c.fillStyle='#ff0066'; c.font='bold 24px monospace';
      c.textAlign='center'; c.fillText('GAME OVER',200,180);
      c.fillStyle='#fff'; c.font='14px monospace';
      c.fillText('Score: '+score,200,210);
      c.fillText('Press any key to restart',200,240);
      c.textAlign='left';
    }
  }
  function update() {
    if(gameOver) return;
    dir = nextDir;
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    // Wall collision
    if(head.x<0||head.x>=20||head.y<0||head.y>=20) { gameOver=true; draw(); return; }
    // Self collision
    if(snake.some(s => s.x===head.x && s.y===head.y)) { gameOver=true; draw(); return; }
    snake.unshift(head);
    if(head.x===food.x && head.y===food.y) { score+=10; spawnFood(); }
    else snake.pop();
    draw();
  }
  setInterval(update, SPEED);
  draw();
  // Arrow keys + WASD controls
  window.onkeydown = (e) => {
    const key = e.key.toLowerCase();
    // Prevent page scrolling
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' '].includes(key)) {
      e.preventDefault();
    }
    if(gameOver) { snake=[{x:10,y:10}]; score=0; gameOver=false; spawnFood(); return; }
    if((key==='arrowup'||key==='w') && dir.y!==1) nextDir={x:0,y:-1};
    if((key==='arrowdown'||key==='s') && dir.y!==-1) nextDir={x:0,y:1};
    if((key==='arrowleft'||key==='a') && dir.x!==1) nextDir={x:-1,y:0};
    if((key==='arrowright'||key==='d') && dir.x!==-1) nextDir={x:1,y:0};
  };
  window.onclick = () => { if(gameOver) { snake=[{x:10,y:10}]; score=0; gameOver=false; spawnFood(); } };
</script>`,
    checklist: [
      { id: "check-speed", label: "Change SPEED", description: "Modify the SPEED variable", pattern: "SPEED\\s*=\\s*(?!120)\\d+", completed: false },
      { id: "check-color", label: "Change snake color", description: "Modify SNAKE_COLOR", pattern: "SNAKE_COLOR\\s*=\\s*['\"]((?!#00ff88)[a-zA-Z#0-9]+)['\"]", completed: false },
      { id: "check-food", label: "Change food color", description: "Modify FOOD_COLOR", pattern: "FOOD_COLOR\\s*=\\s*['\"]((?!#ff0066)[a-zA-Z#0-9]+)['\"]", completed: false },
    ],
    category: "arcade",
  },
  {
    id: "pacman",
    name: "Pac-Dot Maze",
    description: "Eat all dots, avoid ghosts! Power pellets let you eat ghosts. Arrow keys or WASD to move.",
    difficulty: "intermediate",
    starterCode: `<canvas id="g" width="400" height="400" style="background:#111"></canvas>
<script>
  const c = document.getElementById('g').getContext('2d');
  const S = 20;
  // 0=wall, 1=dot, 2=empty, 3=power pellet
  const MAP = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0],
    [0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0],
    [0,1,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,1,0],
    [0,1,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,1,0],
    [0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,2,2,2,2,2,2,2,2,0,1,0,0,0,0],
    [0,0,0,0,1,0,2,0,0,2,2,0,0,2,0,1,0,0,0,0],
    [2,2,2,2,1,2,2,0,2,2,2,2,0,2,2,1,2,2,2,2],
    [0,0,0,0,1,0,2,0,0,0,0,0,0,2,0,1,0,0,0,0],
    [0,0,0,0,1,0,2,2,2,2,2,2,2,2,0,1,0,0,0,0],
    [0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0],
    [0,3,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,3,0],
    [0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0],
    [0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  let maze, px, py, dir, nextDir, score, gameOver, gameWon, totalDots, dotsEaten;
  let ghosts, powerTimer, ghostsEaten;
  // --- TWEAKABLE VARIABLES ---
  const SPEED = 150;            // Try 80 (fast) or 220 (slow)!
  const PAC_COLOR = '#ffff00';  // Try 'lime', 'cyan', or '#ff0066'!
  const GHOST_COLOR = '#ff0066'; // Try 'cyan', 'magenta', or 'orange'!
  const POWER_GHOST_COLOR = '#00aaff'; // Ghost color when vulnerable!
  const DOT_COLOR = '#ffcc00';   // Try 'white', 'cyan', or 'lime'!
  // ---------------------------
  function init() {
    maze = MAP.map(r => [...r]);
    // Pac starts in center, ghosts at corners
    px=9; py=10; dir={x:0,y:0}; nextDir={x:0,y:0};
    score=0; gameOver=false; gameWon=false; dotsEaten=0; powerTimer=0; ghostsEaten=0;
    // Spawn ghosts at the 4 corners
    ghosts = [
      {x:1,y:1,dir:{x:1,y:0},type:'chase',frightened:false},
      {x:18,y:1,dir:{x:-1,y:0},type:'ambush',frightened:false},
      {x:1,y:18,dir:{x:1,y:0},type:'patrol',frightened:false},
    ];
    totalDots=0;
    maze.forEach(r => r.forEach(v => { if(v===1||v===3) totalDots++; }));
  }
  function canMove(x,y) {
    if(y<0||y>=20) return false;
    if(x<0) x=19; if(x>19) x=0;
    return maze[y][x] !== 0;
  }
  function draw() {
    c.fillStyle='#0a0a1a'; c.fillRect(0,0,400,400);
    // Draw maze
    for(let y=0;y<20;y++) {
      for(let x=0;x<20;x++) {
        const v = maze[y][x];
        if(v===0) {
          // Wall with 3D effect
          c.fillStyle='#1a1a3e';
          c.fillRect(x*S,y*S,S,S);
          c.fillStyle='#252550';
          c.fillRect(x*S,y*S,S,3);
          c.fillRect(x*S,y*S,3,S);
        } else if(v===1) {
          c.fillStyle=DOT_COLOR;
          c.beginPath();
          c.arc(x*S+S/2,y*S+S/2,3,0,Math.PI*2);
          c.fill();
        } else if(v===3) {
          // Pulsing power pellet
          const pulse = Math.sin(Date.now()/200)*2+5;
          c.fillStyle=DOT_COLOR;
          c.shadowColor=DOT_COLOR;
          c.shadowBlur=12;
          c.beginPath();
          c.arc(x*S+S/2,y*S+S/2,pulse,0,Math.PI*2);
          c.fill();
          c.shadowBlur=0;
        }
      }
    }
    // Draw ghosts
    ghosts.forEach((g,i) => {
      const color = g.frightened ? POWER_GHOST_COLOR : GHOST_COLOR;
      c.fillStyle = color;
      c.shadowColor = color;
      c.shadowBlur = g.frightened ? 12 : 6;
      // Ghost body
      c.beginPath();
      c.arc(g.x*S+S/2,g.y*S+S/2-2,S/2-1,Math.PI,0);
      // Wavy bottom
      const wave = Math.sin(Date.now()/100+i)*2;
      c.lineTo(g.x*S+S-1,g.y*S+S-2+wave);
      c.lineTo(g.x*S+S/2,g.y*S+S-4-wave);
      c.lineTo(g.x*S+1,g.y*S+S-2+wave);
      c.closePath();
      c.fill();
      c.shadowBlur=0;
      // Eyes (only if not frightened)
      if(!g.frightened) {
        c.fillStyle='#fff';
        c.beginPath(); c.arc(g.x*S+7,g.y*S+7,4,0,Math.PI*2); c.fill();
        c.beginPath(); c.arc(g.x*S+13,g.y*S+7,4,0,Math.PI*2); c.fill();
        // Pupils following direction
        c.fillStyle='#11f';
        c.beginPath(); c.arc(g.x*S+7+g.dir.x*2,g.y*S+7+g.dir.y*2,2,0,Math.PI*2); c.fill();
        c.beginPath(); c.arc(g.x*S+13+g.dir.x*2,g.y*S+7+g.dir.y*2,2,0,Math.PI*2); c.fill();
      } else {
        // Frightened face
        c.fillStyle='#fff';
        c.beginPath(); c.arc(g.x*S+7,g.y*S+7,2,0,Math.PI*2); c.fill();
        c.beginPath(); c.arc(g.x*S+13,g.y*S+7,2,0,Math.PI*2); c.fill();
      }
    });
    // Draw pac-man
    c.fillStyle=PAC_COLOR;
    c.shadowColor=PAC_COLOR;
    c.shadowBlur=10;
    c.beginPath();
    const mouth = Math.sin(Date.now()/80)*0.3+0.1;
    const angle = dir.x===1?0:dir.x===-1?Math.PI:dir.y===-1?Math.PI*1.5:Math.PI*0.5;
    c.arc(px*S+S/2,py*S+S/2,S/2-1,angle+mouth,angle+Math.PI*2-mouth);
    c.lineTo(px*S+S/2,py*S+S/2);
    c.fill();
    c.shadowBlur=0;
    // HUD
    c.fillStyle='#fff'; c.font='bold 14px monospace';
    c.fillText('Score: '+score, 10, 18);
    // Power timer
    if(powerTimer > 0) {
      c.fillStyle=POWER_GHOST_COLOR;
      c.fillText('POWER: '+Math.ceil(powerTimer/10), 10, 36);
    }
    c.fillStyle='rgba(255,255,255,0.5)'; c.font='11px monospace';
    c.fillText('Dots: '+dotsEaten+'/'+totalDots, 10, 395);
    c.fillText('Ghosts eaten: '+ghostsEaten, 280, 395);
    // Game over screen
    if(gameOver) {
      c.fillStyle='rgba(0,0,0,0.8)'; c.fillRect(0,0,400,400);
      c.fillStyle='#ff0066'; c.font='bold 28px monospace';
      c.textAlign='center'; c.fillText('GAME OVER',200,170);
      c.fillStyle='#fff'; c.font='16px monospace';
      c.fillText('Score: '+score,200,200);
      c.fillText('Dots eaten: '+dotsEaten+'/'+totalDots,200,225);
      c.fillStyle='#aaa'; c.font='12px monospace';
      c.fillText('Click or press any key to restart',200,260);
      c.textAlign='left';
    }
    // Win screen
    if(gameWon) {
      c.fillStyle='rgba(0,0,0,0.8)'; c.fillRect(0,0,400,400);
      c.fillStyle='#00ff88'; c.font='bold 28px monospace';
      c.textAlign='center'; c.fillText('YOU WIN!',200,170);
      c.fillStyle='#fff'; c.font='16px monospace';
      c.fillText('Score: '+score,200,200);
      c.fillText('Ghosts eaten: '+ghostsEaten,200,225);
      c.fillStyle='#aaa'; c.font='12px monospace';
      c.fillText('Click or press any key to play again',200,260);
      c.textAlign='left';
    }
  }
  function moveGhost(g) {
    const dirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
    let nx = g.x+g.dir.x, ny = g.y+g.dir.y;
    // Wrap
    if(nx<0) nx=19; if(nx>19) nx=0;
    if(canMove(nx,ny)) {
      g.x=nx; g.y=ny;
    } else {
      // Pick new direction
      const valid = dirs.filter(d => {
        if(d.x===-g.dir.x && d.y===-g.dir.y) return false; // No reverse
        return canMove(g.x+d.x,g.y+d.y);
      });
      if(valid.length > 0) {
        if(g.type==='chase' && !g.frightened) {
          // Chase: move toward player
          valid.sort((a,b) => {
            const da = Math.abs(g.x+a.x-px)+Math.abs(g.y+a.y-py);
            const db = Math.abs(g.x+b.x-px)+Math.abs(g.y+b.y-py);
            return da-db;
          });
          g.dir = valid[0];
        } else if(g.type==='ambush' && !g.frightened) {
          // Ambush: target ahead of player
          const tx = px+dir.x*4, ty = py+dir.y*4;
          valid.sort((a,b) => {
            const da = Math.abs(g.x+a.x-tx)+Math.abs(g.y+a.y-ty);
            const db = Math.abs(g.x+b.x-tx)+Math.abs(g.y+b.y-ty);
            return da-db;
          });
          g.dir = valid[0];
        } else {
          // Random or frightened
          g.dir = valid[Math.floor(Math.random()*valid.length)];
        }
      } else {
        // Dead end, reverse
        g.dir = {x:-g.dir.x, y:-g.dir.y};
      }
      g.x += g.dir.x; g.y += g.dir.y;
      if(g.x<0) g.x=19; if(g.x>19) g.x=0;
    }
  }
  function update() {
    if(gameOver||gameWon) return;
    dir = nextDir;
    let nx = px+dir.x, ny = py+dir.y;
    if(nx<0) nx=19; if(nx>19) nx=0;
    if(dir.x!==0||dir.y!==0) {
      if(canMove(nx,ny)) { px=nx; py=ny; }
    }
    // Eat dot
    if(maze[py][px]===1) { maze[py][px]=2; score+=10; dotsEaten++; }
    // Eat power pellet
    if(maze[py][px]===3) {
      maze[py][px]=2; score+=50; dotsEaten++;
      powerTimer = 50; // ~7.5 seconds at SPEED 150
      ghosts.forEach(g => g.frightened = true);
      ghostsEaten = 0;
    }
    // Power timer
    if(powerTimer > 0) {
      powerTimer--;
      if(powerTimer <= 0) {
        ghosts.forEach(g => g.frightened = false);
      }
    }
    // Check win
    if(dotsEaten>=totalDots) { gameWon=true; draw(); return; }
    // Move ghosts
    ghosts.forEach(g => moveGhost(g));
    // Check collision
    ghosts.forEach(g => {
      if(g.x===px && g.y===py) {
        if(g.frightened) {
          // Eat ghost - respawn at its corner
          score += 200 * (ghostsEaten+1);
          ghostsEaten++;
          if(g.type==='chase') { g.x=1; g.y=1; }
          else if(g.type==='ambush') { g.x=18; g.y=1; }
          else { g.x=1; g.y=18; }
          g.frightened = false;
        } else {
          gameOver = true;
        }
      }
    });
    draw();
  }
  init();
  setInterval(update, SPEED);
  draw();
  // Arrow keys + WASD controls
  window.onkeydown = (e) => {
    const key = e.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' '].includes(key)) {
      e.preventDefault();
    }
    if(gameOver||gameWon) { init(); draw(); return; }
    if((key==='arrowup'||key==='w') && dir.y!==1) nextDir={x:0,y:-1};
    if((key==='arrowdown'||key==='s') && dir.y!==-1) nextDir={x:0,y:1};
    if((key==='arrowleft'||key==='a') && dir.x!==1) nextDir={x:-1,y:0};
    if((key==='arrowright'||key==='d') && dir.x!==-1) nextDir={x:1,y:0};
  };
  window.onclick = () => { if(gameOver||gameWon) { init(); draw(); } };
</script>`,
    checklist: [
      { id: "check-speed", label: "Change SPEED", description: "Modify the SPEED variable", pattern: "SPEED\\s*=\\s*(?!150)\\d+", completed: false },
      { id: "check-pac", label: "Change Pac-Man color", description: "Modify PAC_COLOR", pattern: "PAC_COLOR\\s*=\\s*['\"]((?!#ffff00)[a-zA-Z#0-9]+)['\"]", completed: false },
      { id: "check-ghost", label: "Change ghost color", description: "Modify GHOST_COLOR", pattern: "GHOST_COLOR\\s*=\\s*['\"]((?!#ff0066)[a-zA-Z#0-9]+)['\"]", completed: false },
      { id: "check-power", label: "Change power ghost color", description: "Modify POWER_GHOST_COLOR", pattern: "POWER_GHOST_COLOR\\s*=\\s*['\"]((?!#00aaff)[a-zA-Z#0-9]+)['\"]", completed: false },
    ],
    category: "arcade",
  },
  {
    id: "starfield",
    name: "Starfield",
    description: "Fly through space! Move mouse to steer, warp speed on click!",
    difficulty: "beginner",
    starterCode: `<canvas id="g" width="400" height="400" style="background:#000"></canvas>
<script>
  const c = document.getElementById('g').getContext('2d');
  const stars = [];
  for(let i=0; i<200; i++) {
    stars.push({ x:(Math.random()-0.5)*800, y:(Math.random()-0.5)*800, z:Math.random()*400, pz:0 });
  }
  let speed = 5, targetSpeed = 5, mouseX = 200, mouseY = 200;
  // --- TWEAKABLE VARIABLES ---
  const BASE_SPEED = 5;       // Try 2 (slow) or 15 (fast)!
  const STAR_COLOR = '#ffffff'; // Try '#00ffff', '#ff0066', or 'gold'!
  const WARP_COLOR = '#00aaff'; // Color during warp speed!
  // ---------------------------
  function draw() {
    c.fillStyle = 'rgba(0,0,0,0.15)';
    c.fillRect(0,0,400,400);
    const warp = speed > BASE_SPEED * 2;
    const cx = 200 + (mouseX-200)*0.1;
    const cy = 200 + (mouseY-200)*0.1;
    stars.forEach(s => {
      s.pz = s.z;
      s.z -= speed;
      if(s.z <= 0) {
        s.x = (Math.random()-0.5)*800;
        s.y = (Math.random()-0.5)*800;
        s.z = 400; s.pz = 400;
      }
      const px = s.x/s.z*200+cx;
      const py = s.y/s.z*200+cy;
      const opx = s.x/s.pz*200+cx;
      const opy = s.y/s.pz*200+cy;
      const size = (1-s.z/400)*3;
      // Draw streak line for warp effect
      if(warp && s.pz > s.z) {
        c.strokeStyle = warp ? WARP_COLOR+'88' : STAR_COLOR+'44';
        c.lineWidth = size*0.5;
        c.beginPath(); c.moveTo(opx,opy); c.lineTo(px,py); c.stroke();
      }
      c.fillStyle = warp ? WARP_COLOR : STAR_COLOR;
      c.fillRect(px, py, size, size);
    });
    // HUD
    c.fillStyle='rgba(0,255,136,0.7)'; c.font='bold 12px monospace';
    c.fillText('SPEED: '+speed.toFixed(1), 10, 20);
    c.fillText('STARS: 200', 10, 36);
    speed += (targetSpeed - speed) * 0.05;
    requestAnimationFrame(draw);
  }
  draw();
  window.onmousemove = (e) => { mouseX=e.offsetX; mouseY=e.offsetY; };
  window.onclick = () => { targetSpeed = 40; setTimeout(()=>targetSpeed=BASE_SPEED, 1500); };
</script>`,
    checklist: [
      { id: "check-speed", label: "Change BASE_SPEED", description: "Modify the BASE_SPEED variable", pattern: "BASE_SPEED\\s*=\\s*(?!5)\\d+", completed: false },
      { id: "check-color", label: "Change STAR_COLOR", description: "Modify STAR_COLOR", pattern: "STAR_COLOR\\s*=\\s*['\"]((?!#ffffff)[a-zA-Z#0-9]+)['\"]", completed: false },
      { id: "check-warp", label: "Change WARP_COLOR", description: "Modify WARP_COLOR", pattern: "WARP_COLOR\\s*=\\s*['\"]((?!#00aaff)[a-zA-Z#0-9]+)['\"]", completed: false },
    ],
    category: "creative",
  },
  {
    id: "gravity-platformer",
    name: "Gravity Platformer",
    description: "Jump across platforms! Collect gems for points. Arrow keys + Space to jump.",
    difficulty: "intermediate",
    starterCode: `<canvas id="g" width="400" height="400" style="background:#111"></canvas>
<script>
  const c = document.getElementById('g').getContext('2d');
  let px=50, py=300, vx=0, vy=0, onGround=false, score=0, facing=1;
  const gems = [
    {x:180,y:255,collected:false}, {x:330,y:175,collected:false},
    {x:80,y:155,collected:false}, {x:250,y:85,collected:false}
  ];
  const platforms = [
    {x:0,y:380,w:400,h:20}, {x:120,y:300,w:80,h:10},
    {x:280,y:240,w:100,h:10}, {x:50,y:180,w:80,h:10},
    {x:200,y:120,w:100,h:10}, {x:320,y:320,w:80,h:10}
  ];
  // --- TWEAKABLE VARIABLES ---
  const GRAVITY = 0.6;           // Try 0.2 (floaty) or 1.5 (heavy)!
  const JUMP = -11;              // Try -6 (low) or -18 (high)!
  const MOVE_SPEED = 4;          // Try 2 (slow) or 8 (fast)!
  const PLAYER_COLOR = '#00ff88'; // Try '#ff0066', 'cyan', or 'gold'!
  const GEM_COLOR = '#ffff00';    // Try 'cyan', '#ff0066', or 'lime'!
  // ---------------------------
  const keys = {};
  window.onkeydown = (e) => {
    const key = e.key;
    // Prevent page scrolling
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(key)) {
      e.preventDefault();
    }
    keys[key]=true;
    if(key===' '&&onGround) vy=JUMP;
  };
  window.onkeyup = (e) => { keys[e.key]=false; };
  function draw() {
    c.fillStyle='#1a1a2e'; c.fillRect(0,0,400,400);
    // Draw platforms
    platforms.forEach(p => {
      c.fillStyle='#334';
      c.fillRect(p.x,p.y,p.w,p.h);
      c.fillStyle='#556';
      c.fillRect(p.x,p.y,p.w,3);
    });
    // Draw gems
    gems.forEach(g => {
      if(g.collected) return;
      c.fillStyle=GEM_COLOR;
      c.shadowColor=GEM_COLOR; c.shadowBlur=8;
      c.save(); c.translate(g.x+8,g.y+8);
      c.rotate(Date.now()/500);
      c.fillRect(-5,-5,10,10);
      c.restore(); c.shadowBlur=0;
    });
    // Draw player
    c.fillStyle=PLAYER_COLOR;
    c.shadowColor=PLAYER_COLOR; c.shadowBlur=6;
    c.fillRect(px,py,20,20);
    c.shadowBlur=0;
    // Eyes
    c.fillStyle='#000';
    c.fillRect(px+4+facing*6,py+6,4,4);
    c.fillRect(px+12+facing*6,py+6,4,4);
    // HUD
    c.fillStyle='#fff'; c.font='bold 14px monospace';
    c.fillText('Score: '+score, 10, 25);
    c.fillText('← → Move  |  SPACE Jump', 10, 395);
  }
  function update() {
    // Horizontal movement
    if(keys['ArrowLeft']) { vx=-MOVE_SPEED; facing=-1; }
    else if(keys['ArrowRight']) { vx=MOVE_SPEED; facing=1; }
    else vx *= 0.8;
    // Apply gravity
    vy += GRAVITY;
    px += vx; py += vy;
    // Platform collision
    onGround = false;
    platforms.forEach(p => {
      if(py+20>p.y && py+20<p.y+p.h+12 && px+20>p.x && px<p.x+p.w && vy>0) {
        py=p.y-20; vy=0; onGround=true;
      }
    });
    // Gem collection
    gems.forEach(g => {
      if(!g.collected && px+20>g.x && px<g.x+16 && py+20>g.y && py<g.y+16) {
        g.collected=true; score+=25;
      }
    });
    // Respawn if fallen
    if(py>420) { px=50; py=300; vx=0; vy=0; }
    // Wrap horizontally
    if(px<-20) px=400; if(px>400) px=-20;
    draw();
    requestAnimationFrame(update);
  }
  draw(); update();
</script>`,
    checklist: [
      { id: "check-gravity", label: "Change GRAVITY", description: "Modify the GRAVITY variable", pattern: "GRAVITY\\s*=\\s*(?!0\\.6)\\d+\\.?\\d*", completed: false },
      { id: "check-jump", label: "Change JUMP force", description: "Modify the JUMP variable", pattern: "JUMP\\s*=\\s*(?!-11)-?\\d+", completed: false },
      { id: "check-speed", label: "Change MOVE_SPEED", description: "Modify the MOVE_SPEED variable", pattern: "MOVE_SPEED\\s*=\\s*(?!4)\\d+", completed: false },
      { id: "check-color", label: "Change player color", description: "Modify PLAYER_COLOR", pattern: "PLAYER_COLOR\\s*=\\s*['\"]((?!#00ff88)[a-zA-Z#0-9]+)['\"]", completed: false },
      { id: "check-gem", label: "Change gem color", description: "Modify GEM_COLOR", pattern: "GEM_COLOR\\s*=\\s*['\"]((?!#ffff00)[a-zA-Z#0-9]+)['\"]", completed: false },
    ],
    category: "physics",
  },
];
