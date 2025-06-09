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
const wallGlow = 10;
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
// more declarations for the maze
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = [];
const stack = [];
const path = [];

let current;
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
    ctx.shadowBlur = wallGlow;
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
  for (let i = 0; i < solutionIndex; i++) {
    solvedPath[i].highlight(ctx, "#00ffcc33"); // soft trail
  }

  if (solutionIndex < solvedPath.length) {
    // Highlight the current position with stronger glow
    solvedPath[solutionIndex].highlight(ctx, "#00ffff"); 
    solutionIndex += 1;
  }
}

//-----------------------------------------------------
function simlog(message) {
  const logWindow = document.getElementById("log");
  const cursor = document.getElementById("cursor");
  // simply put the message above the cursor
  const logLine = document.createElement('div');
  logLine.textContent = message;
  logLine.style.whiteSpace = "pre-wrap";
  logWindow.insertBefore(logLine, cursor);
  logWindow.scrollTop = logWindow.scrollHeight;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(baseSpeed, el, txt) {
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
async function mylog(message) {
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

  logWindow.scrollTop = logWindow.scrollHeight;
};

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

async function queueLog(message) {
  logQueue.push(message);
  await processLogQueue();
}

//-----------------------------------------------------
async function initDrawGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push(new Cell(x, y));
    }
  }
  current = grid[Math.floor(Math.random() * grid.length)];
  // draw the grid walls with init cell
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show(ctx);
    await sleep(30);  //miliseconds
  }
  current.highlight(ctx);
}

async function init() {
  await sleep(2000);  //miliseconds
  const now = new Date().toLocaleString();
  await queueLog("[ " + now + " ]");
  await queueLog(banner);
  await queueLog("A TRON-style maze animation using DFS.");
  await queueLog("Implemented by y-labz, 2025-06 🚀");
  await queueLog("Initializing GRID...");
  await initDrawGrid();
  await sleep(1000);  //miliseconds
  await queueLog("Initialization done.");
  await queueLog("Grid size: " + rows + " x " + cols);
  await queueLog("Init cell x = " + current.x + " y = " + current.y);
}

async function main() {
  await init();
  await queueLog("Start maze carving...");
  loop();
}

function loop() {
  // clean up first...
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < grid.length; i++) { grid[i].show(ctx); }

  if (!solving) {
    current.visited = true;
    current.highlight(ctx);

    const next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      const m0 =  "|".repeat(stack.length);
      const m1 = " (" + current.x + "," + current.y + ") ";
      const m2 = "=> (" + next.x + "," + next.y + ")";
      simlog(m0 + m1 + m2);
      current = next;
    }
    else if (stack.length > 0) {
      current = stack.pop();
      const msg = "|".repeat(stack.length) + " [DEAD END]";
      simlog(msg);
    }
    else {
      simlog("\n--------------------------------------------")
      simlog("--------- Maze Generation Finished ---------")
      simlog("--------------------------------------------")
      solving = true;
      solvedPath = [...solveMaze(grid[0], grid[grid.length - 1])];
      simlog("\nSolved path length: " + solvedPath.length + " ...");
      const pathString = solvedPath
        .map(cell => `(${cell.x},${cell.y})`)
        .join(" => ");
      simlog(pathString);
    }
  }
  else {
    // solvedPath finished above, here endless loop
    animateLightcycle();
  }

  // requestAnimationFrame(loop);
  // setTimeout(loop, 60);
  setTimeout(loop, 100);
}

main();

// Optional: reload on resize (to rebuild layout)
// window.addEventListener('resize', () => location.reload());

