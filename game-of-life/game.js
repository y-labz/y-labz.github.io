
function setupWindow() {
  // Get the smaller of width or height
  let L0 = Math.min(window.innerWidth, window.innerHeight);
  let L1 = Math.max(window.innerWidth, window.innerHeight);
  L0 = L0 - 32; //body margin 8, div margin 8, border 2
  L1 = L1 - 32 - L0 - 16;
  // const container = document.getElementById("game-container");
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
}

setupWindow();

function resizeCanvas() {
  resizeGameContainer();

  const container = document.getElementById("game-container");
  const rect = container.getBoundingClientRect();

  let newWidth = Math.max(rect.width, 128);
  let newHeight = Math.max(rect.height, 128);

  const canvas = document.getElementById("game");
  canvas.width = newWidth;
  canvas.height = newHeight;

  // cols = Math.floor(newWidth / cellSize);
  // rows = Math.floor(newHeight / cellSize);

  // grid = new Array(rows);
  // for (let i = 0; i < rows; i++) {
  //   grid[i] = new Array(cols);
  // }

  // randomizeGrid();
  // drawGrid();
}

// resizeCanvas();

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 200);
});

