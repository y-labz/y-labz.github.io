const banner = `
      ▜   ▌    
  ▌▌▄▖▐ ▀▌▛▌▀▌ 
  ▙▌  ▐▖█▌▙▌▙▖.
  ▄▌           
               
`;
const minL = Math.min(window.innerWidth, window.innerHeight);
const maxL = Math.max(window.innerWidth, window.innerHeight);
//body margin 8, div margin 8, border-box excluded border2
const conL = minL - 32; //container length
const logL = maxL - 32 - conL - 16; //log div length
const delay0 = 50; //for fancy log
// config maze
const rows = 10;
const cols = 10;
const wallThick = 4;
const cellSize = Math.floor(conL / rows);
const canL = cellSize * rows; //canvas length

//-----------------------------------------------------
function setupWindow() {
  const container = document.createElement('div');
  container.id = "container";
  container.style.width = conL + "px";
  container.style.height = conL + "px";
  // document.body.appendChild(container);

  // add log window Responsive layout
  const logWindow = document.createElement('div');
  logWindow.id = "log";

  if (window.innerWidth > window.innerHeight) {
    // Landscape – side by side
    logWindow.style.height = conL + "px";
    logWindow.style.width = logL + "px";
    const wrapper = document.createElement('div');
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "row";
    // logWindow.style.flex = "1 1 auto";
    wrapper.appendChild(container);
    wrapper.appendChild(logWindow);
    document.body.appendChild(wrapper);
  } else {
    // Portrait – stacked flex column set in css
    document.body.appendChild(container);
    logWindow.style.width = conL + "px";
    logWindow.style.height = logL + "px";
    document.body.appendChild(logWindow);
  }
  // add default blinking cursor here
  const cursor = document.createElement('div');
  cursor.id = "cursor";
  logWindow.appendChild(cursor);

  //add canvas here, max L0-border2
  const canvas = document.createElement('canvas');
  canvas.id = "game";
  canvas.width = canL;
  canvas.height = canL;
  container.appendChild(canvas);
}

setupWindow();

//-----------------------------------------------------
// more declare for the maze
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = [];
const stack = [];
const path = [];

let solving = false;
let solvedPath = [];
let solutionIndex = 0;

function index(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return -1;
  return x + y * cols;
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = [true, true, true, true];
    // top, right, bottom, left
    this.visited = false;
  }

  show(ctx) {
    const x = this.x * cellSize;
    const y = this.y * cellSize;

    ctx.strokeStyle = "#00faff";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.lineWidth = wallThick;

    if (this.walls[0]) drawLine(x, y, x+cellSize, y);
    if (this.walls[1]) drawLine(x+cellSize, y, x+cellSize, y+cellSize);
    if (this.walls[2]) drawLine(x+cellSize, y+cellSize, x, y+cellSize);
    if (this.walls[3]) drawLine(x, y+cellSize, x, y);

    // ctx.shadowBlur = 0; //reset for everything after
  }

  highlight(ctx, color = "#00ffcc33") {
    const x = this.x * cellSize;
    const y = this.y * cellSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellSize, cellSize);
  }

  checkNeighbors() {
    const neighbors = [];
    const top = grid[index(this.x, this.y - 1)];
    const right = grid[index(this.x + 1, this.y)];
    const bottom = grid[index(this.x, this.y + 1)];
    const left = grid[index(this.x - 1, this.y)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    } else {
      return undefined;
    }
  }
}

function removeWalls(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  if (dx === 1) { a.walls[3] = false; b.walls[1] = false; }
  if (dx === -1) { a.walls[1] = false; b.walls[3] = false; }
  if (dy === 1) { a.walls[0] = false; b.walls[2] = false; }
  if (dy === -1) { a.walls[2] = false; b.walls[0] = false; }
}

function solveMaze(start, end) {
  const visited = new Set();
  const cameFrom = new Map();
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === end) break;
    visited.add(current);

    const neighbors = getOpenNeighbors(current);
    for (let n of neighbors) {
      if (!visited.has(n)) {
        cameFrom.set(n, current);
        queue.push(n);
      }
    }
  }

  const path = [];
  let currentNode = end;
  while (currentNode !== start) {
    path.push(currentNode);
    currentNode = cameFrom.get(currentNode);
  }
  path.push(start);
  return path.reverse();
}

function getOpenNeighbors(cell) {
  const result = [];
  const x = cell.x;
  const y = cell.y;

  if (!cell.walls[0]) result.push(grid[index(x, y - 1)]); // top
  if (!cell.walls[1]) result.push(grid[index(x + 1, y)]); // right
  if (!cell.walls[2]) result.push(grid[index(x, y + 1)]); // bottom
  if (!cell.walls[3]) result.push(grid[index(x - 1, y)]); // left

  return result;
}

function animateLightcycle() {
  for (let i = 0; i < solvedPath.length; i++) {
    if (i < solutionIndex) {
      solvedPath[i].highlight(ctx, "#00ffcc33");
    }
  }

  if (solutionIndex < solvedPath.length) {
    // const cell = solvedPath[solutionIndex];
    // const x = cell.x * cellSize + cellSize / 2;
    // const y = cell.y * cellSize + cellSize / 2;
    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    // ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    solutionIndex += 1;
  }
}

//-----------------------------------------------------
// Backup the original log function
const originalConsoleLog = console.log;
// Override console.log
console.log = function (...args) {
  // still logs in browser console
  // originalConsoleLog.apply(console, args);
  // const now = new Date().toLocaleTimeString();
  const message = args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');

  const logLine = document.createElement('div');
  logLine.textContent = message;
  // logLine.textContent = `[${now}] ${message}`;
  logLine.style.whiteSpace = "pre-wrap";

  const logWindow = document.getElementById("log");
  if (logWindow) {
    logWindow.appendChild(logLine);
    // Trim to last 100 logs
    const maxLogs = 100;
    while (logWindow.children.length > maxLogs) {
      logWindow.removeChild(logWindow.firstChild); // remove oldest
    }
    logWindow.scrollTop = logWindow.scrollHeight;
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Example usage
async function tronRide() {
  console.log("💥 Zooming in...");
  await sleep(1000);  // Pauses for 1 second
  console.log("🌀 Whoosh... Entering the grid");
}

function typeText0(speed = 50, el, txt) {
  if (txt.length > 0) {
    el.textContent += txt[0];
    setTimeout(() => typeText0(speed, el, txt.slice(1)), speed);
  };
}

function typeText1(speed = 80, el, txt) {
  return new Promise(resolve => {
    function typeChar(i) {
      if (i < txt.length) {
        el.textContent += txt[i];
        setTimeout(() => typeChar(i + 1), speed);
      } else {
        resolve(); // Done typing
      }
    }
    typeChar(0);
  });
}

function typeText(baseSpeed, el, txt) {
  return new Promise(resolve => {
    const speedCycle = [1, 0.5, 1.5, 2, 0.1, 3]; //config
    let cycleIndex = 0;
    let delay = baseSpeed;
    function typeChar(i) {
      if (i < txt.length) {
        el.textContent += txt[i];
        if (txt[i] === " ") {
          delay = 10;
        } else {
          delay = baseSpeed * speedCycle[cycleIndex];
        };
        cycleIndex = (cycleIndex + 1) % speedCycle.length;
        setTimeout(() => typeChar(i + 1), delay);
      } else {
        resolve(); // Done typing
      }
    }
    typeChar(0);
  });
}

// a fancy animated log function
// function mylog(message)
async function mylog(message)
{
  const logWindow = document.getElementById("log");
  //remove old blinking cursor
  const cursorOld = document.getElementById("cursor");
  if (cursorOld) cursorOld.remove();

  //add empty logline and non blinking cursor leader
  const logLine = document.createElement('div');
  const logLead = document.createElement('div');
  logLead.id = "cursor1";
  logWindow.append(logLine, logLead);

  //now loop over the message and feed that logline
  logLine.style.whiteSpace = "pre-wrap";
  logLine.style.display = "inline";
  await typeText(delay0, logLine, message);

  //WAIT util whole line done, remove cursor tail
  logLead.remove();
  logLine.style.removeProperty("display");
  //put new blinking cursor in the new line
  cursorNew = document.createElement('div');
  cursorNew.id = "cursor";
  logWindow.appendChild(cursorNew);

  // Trim to last 100 logs
  const maxLogs = 100;
  while (logWindow.children.length > maxLogs) {
    logWindow.removeChild(logWindow.firstChild); // remove oldest
  }
  logWindow.scrollTop = logWindow.scrollHeight;
};

// they will appear at the same time...
// mylog("testing testing here");
// mylog("another line to test");

// solution:
let logQueue = [];
let isLogging = false;

async function processLogQueue() {
  if (isLogging) return;
  isLogging = true;
  while (logQueue.length > 0) {
    const msg = logQueue.shift();
    await mylog(msg); // waits for full animation before next one
  }
  isLogging = false;
}

function queueLog(message) {
  logQueue.push(message);
  processLogQueue();
}

// queueLog("testing testing here");
// queueLog("another line to test");
// queueLog("yet another one");

//-----------------------------------------------------
// Grid init
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    grid.push(new Cell(x, y));
  }
}

let current = grid[0];

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < grid.length; i++) {
    grid[i].show(ctx);
  }

  if (!solving) {
    current.visited = true;
    current.highlight(ctx);

    const next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      solving = true;
      solvedPath = [...solveMaze(grid[0], grid[grid.length - 1])];
    }
  } else {
    animateLightcycle();
  }

  requestAnimationFrame(draw);
}

draw();










//-----------------------------------------------------
function loop() {
  // requestAnimationFrame(loop);
  // setTimeout(loop, 100); // 100 ms pause = 10 frames per second
}

const now = new Date().toLocaleTimeString();
queueLog(banner);
queueLog("... implemented by y-labz, 2025-06 🚀");
queueLog("... game starting now ...");
queueLog("... ...");
// for (let i = 0; i < 20; i++) { loop(); }
// loop();





// Optional: reload on resize (to rebuild layout)
// window.addEventListener('resize', () => location.reload());

