const banner = `
      ▜   ▌    
  ▌▌▄▖▐ ▀▌▛▌▀▌ 
  ▙▌  ▐▖█▌▙▌▙▖.
  ▄▌           
               
`;

const gameDim = 128 //config

let grid = new Array(gameDim);
let grid2 = new Array(gameDim); //next iteration grid
for (let i = 0; i < gameDim; i++) {
  grid[i] = new Array(gameDim);
  grid2[i] = new Array(gameDim);
}

let initPop = 0;
// Randomize initial grid state: 0 = dead, 1 = alive
function randomizeGrid() {
  for (let y = 0; y < gameDim; y++) { //y is row id
    for (let x = 0; x < gameDim; x++) { //x is col id
      grid[y][x] = Math.random() < 0.1 ? 1 : 0; // chance alive
      // initPop += grid[y][x];
    }
  }
}
randomizeGrid();

function countPop(grid) {
  let res = 0;
  for (let y = 0; y < gameDim; y++) { //y is row id
    for (let x = 0; x < gameDim; x++) { //x is col id
      res += grid[y][x];
    }
  }
  return res;
}
// Count live neighbors around (x,y)
function countNeighbors(x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      let nx = x + dx;
      let ny = y + dy;
      if (nx >= 0 && nx < gameDim && ny >= 0 && ny < gameDim) {
        count += grid[ny][nx];
      }
    }
  }
  return count;
}

// Compute next grid state by applying Game of Life rules
function updateGrid() {
  for (let y = 0; y < gameDim; y++) {
    for (let x = 0; x < gameDim; x++) {
      const alive = grid[y][x];
      const neighbors = countNeighbors(x, y);
      //here is the game:
      if (alive) {
        grid2[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
      } else {
        grid2[y][x] = (neighbors === 3) ? 1 : 0;
      }
    }
  }
  // Swap grids, update grid
  [grid, grid2] = [grid2, grid];
}

updateGrid(); //50 to 60 % init pop die after 1 iteration, alone
initPop = countPop(grid);

//-----------------------------------------------------
// Backup the original log function, just in case
const originalConsoleLog = console.log;
// Override console.log
console.log = function (...args) {
  originalConsoleLog.apply(console, args); // still logs in browser console

  const message = args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');

  const logLine = document.createElement('div');
  logLine.textContent = message;
  logLine.style.whiteSpace = "pre-wrap";

  const logWindow = document.getElementById("log");
  if (logWindow) {
    logWindow.appendChild(logLine);

    // 💅 Trim to last 100 logs
    const maxLogs = 100;
    while (logWindow.children.length > maxLogs) {
      logWindow.removeChild(logWindow.firstChild); // remove oldest
    }

    logWindow.scrollTop = logWindow.scrollHeight;
  }
};

//-----------------------------------------------------
function setupWindow() {
  // Get the smaller of width or height
  let L0 = Math.min(window.innerWidth, window.innerHeight);
  let L1 = Math.max(window.innerWidth, window.innerHeight);
  L0 = L0 - 32; //body margin 8, div margin 8, border 2
  L1 = L1 - 32 - L0 - 16;
  const container = document.createElement('div');
  container.id = "game-container";
  container.style.width = L0 + "px";
  container.style.height = L0 + "px";
  // document.body.appendChild(container);

  // add log window Responsive layout
  const logWindow = document.createElement('div');
  logWindow.id = "log";
  if (window.innerWidth > window.innerHeight) {
    // Landscape – side by side
    logWindow.style.height = L0 + "px";
    logWindow.style.width = L1 + "px";
    const wrapper = document.createElement('div');
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "row";
    logWindow.style.flex = "1 1 auto";
    wrapper.appendChild(container);
    wrapper.appendChild(logWindow);
    document.body.appendChild(wrapper);
  } else {
    // Portrait – stacked
    document.body.appendChild(container);
    logWindow.style.width = L0 + "px";
    logWindow.style.height = L1 + "px";
    document.body.appendChild(logWindow);
  }

  console.log(banner);
  console.log("Conway's Game of Life");
  console.log("... implemented by y-labz, 2025-06 🚀");
  console.log("... game dimension: " + gameDim + "x" + gameDim);
  console.log("... setup container and log ... done");

  //add canvas here, max L0-border2
  const canvas = document.createElement('canvas');
  canvas.id = "game"
  canvas.width = gameDim
  canvas.height = gameDim
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gameDim; y++) {
    for (let x = 0; x < gameDim; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = "#0f0"; // Neon green, baby
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  console.log("... setup canvas and draw initial grid ... done");
  console.log("... randomized grid with 10% chance alive");
  console.log("... after one iteration:");
  console.log("... initPop = " + initPop);
  canvas.style.width = L0 - 4 + "px";
  canvas.style.height = L0 - 4 + "px";
  canvas.style.imageRendering = "pixelated";
  container.appendChild(canvas);

  console.log("... setupWindow() ... done");
}

function padNumber(num, width) {
  return num.toString().padStart(width, '0');
}

function drawGrid() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext("2d");
  let pop = 0;
  // always clear first!
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gameDim; y++) {
    for (let x = 0; x < gameDim; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = "#0f0"; // Neon green, baby
        ctx.fillRect(x, y, 1, 1);
        pop = pop + 1;
      }
    }
  }

  // add my fancy progress bar
  const formPop = padNumber(pop, 4);
  const logWindow = document.getElementById("log");
  const logWidth = logWindow.getBoundingClientRect().width;
  // For font-size: 16px, Courier New chars are usually ~9px wide.
  const charWidth = 9;
  const percent = (pop / (gameDim * gameDim)) * 100;
  const maxPercent = 7; //zoom in a bit
  const barLength = Math.floor(0.9 * (logWidth-36-charWidth*18)/charWidth);
  // const filled = Math.round((percent / 100) * barLength);
  const filled = Math.round(barLength * Math.min(percent, maxPercent) / maxPercent);
  const filledBar = "█".repeat(filled);
  const emptyBar = "░".repeat(barLength - filled);
  const progressBar = `${filledBar}${emptyBar}`;

  const logMessage = `population: ${formPop}  ${progressBar}`;
  console.log(logMessage);
}

//-----------------------------------------------------
function loop() {
  updateGrid();
  drawGrid();
  // requestAnimationFrame(loop);
  setTimeout(loop, 100); // 100 ms pause = 10 frames per second
}

setupWindow();
console.log("... game starting now ...");
console.log("... ...");
// for (let i = 0; i < 10; i++) { loop(); }
loop();

