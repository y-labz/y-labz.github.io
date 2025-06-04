const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Canvas size in pixels
const width = 600;
const height = 400;
canvas.width = width;
canvas.height = height;

// Grid setup
const cellSize = 10; // each cell is 10x10 pixels
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

// Create the grid array
let grid = new Array(rows);

for (let i = 0; i < rows; i++) {
  grid[i] = new Array(cols);
}

// Randomize initial grid state: 0 = dead, 1 = alive
function randomizeGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = Math.random() < 0.3 ? 1 : 0; // 30% chance alive
    }
  }
}

randomizeGrid();


function resizeGameContainer() {
  const container = document.getElementById("game-container");

  // Get the smaller of width or height
  const size = Math.min(window.innerWidth, window.innerHeight);

  // Apply it to container
  container.style.width = size + "px";
  container.style.height = size + "px";
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        ctx.fillStyle = "#0f0"; // Neon green, baby
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

function resizeCanvas() {
  resizeGameContainer();

  const container = document.getElementById("game-container");
  const rect = container.getBoundingClientRect();

  let newWidth = Math.max(rect.width, 128);
  let newHeight = Math.max(rect.height, 128);

  canvas.width = newWidth;
  canvas.height = newHeight;

  cols = Math.floor(newWidth / cellSize);
  rows = Math.floor(newHeight / cellSize);

  grid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
  }

  randomizeGrid();
  drawGrid();
}

resizeCanvas();

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 100);
});

