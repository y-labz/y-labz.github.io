// colorswall.com/palette/868  matrix colors palette
//
//-----------------------------------------------------
const banner = `
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░       ░▒▓██████▓▒░░▒▓███████▓▒░░▒▓████████▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░    ░▒▓██▓▒░  
 ░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓████████▓▒░▒▓███████▓▒░   ░▒▓██▓▒░    
   ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓██▓▒░      
   ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
   ░▒▓█▓▒░   ░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░ 
`;
const quote = "Young man, in mathematics you don't understand things. You just get used to them. (John von Neumann)";
const delacy = 40; //for fancy log
const minL = Math.min(window.innerWidth, window.innerHeight);
const maxL = Math.max(window.innerWidth, window.innerHeight);
//body margin 4, div margin 4, border-box excluded border 2
const conL = minL - 16; //container length
const logL = maxL - 16 - conL - 8; //log div length
const canL = conL - 4; //canvas length
const zmin = { re:-1, im:-1 };
const zmax = { re: 1, im: 1 };
const rangeRe = zmax.re - zmin.re;
const rangeIm = zmax.im - zmin.im;

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
  // add banner here
  const ban = document.createElement('div');
  ban.id = "banner";
  ban.textContent = banner;
  logWindow.appendChild(ban);
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
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

//-----------------------------------------------------
function simlog(message) {
  const logWindow = document.getElementById("log");
  const cursor = document.getElementById("cursor");
  // simply put the message above the cursor
  const logLine = document.createElement('div');
  logLine.textContent = message;
  logLine.style.whiteSpace = "pre-wrap";
  // logLine.style.whiteSpace = "nowrap";
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
  await typeText(delacy, logLine, message);

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
function toCanvas(z) {
  // canvas here is canL * canL
  // what if out of canvas window??
  return {
    x: canL * (z.re - zmin.re) / rangeRe,
    y: canL * (zmax.im - z.im) / rangeIm //flipped here!
  };
}

function toComplex(x, y) {
  return {
    re: zmin.re + rangeRe * x / canL,
    im: zmax.im - rangeIm * y / canL //flipped
  };
}

function drawCircle(z, color = "#00ff88", radius) {
  const c = toCanvas(z);
  ctx.beginPath();
  ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawCircle2(z, radius, fillColor, strokeColor, lw = 2) {
  const c = toCanvas(z);
  ctx.beginPath();
  ctx.arc(c.x, c.y, radius, 0, 2 * Math.PI);
  // Fill
  ctx.fillStyle = fillColor;
  ctx.fill();
  // Stroke (border)
  ctx.lineWidth = lw;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
}

function drawLine(z1, z2, color = "#00ff88", lw) {
  const a = toCanvas(z1);
  const b = toCanvas(z2);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

function zSquare(z) {
  return { re: z.re * z.re - z.im * z.im,
           im: 2 * z.re * z.im };
}

function zAdd(z1, z2) {
  return { re: z1.re + z2.re, im: z1.im + z2.im };
}

function generateMandelbrotDotSet(resolution, maxIter) {
  const dots = [];
  const dx = rangeRe / resolution;
  const dy = rangeIm / resolution;
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      let cx = zmin.re + i * dx;
      let cy = zmin.im + j * dy;
      let x = 0, y = 0;
      let iter = 0;
      while (x * x + y * y <= 4 && iter < maxIter) {
        const xTemp = x * x - y * y + cx;
        y = 2 * x * y + cy;
        x = xTemp;
        iter++;
      }
      if (iter === maxIter) {
        dots.push({ re: cx, im: cy });
      }
    }
  }
  return dots;
}

const mandelbrotDots = generateMandelbrotDotSet(150, 50);

function drawDots(dots, size) {
  ctx.fillStyle = "#204829";
  dots.forEach(dot => {
    const co = toCanvas(dot);
    ctx.fillRect(co.x, co.y, size, size);
  });
}

function drawAxes(color) {
  const u = { re: 0, im: zmax.im};
  const d = { re: 0, im: zmin.im};
  const l = { re: zmin.re, im: 0};
  const r = { re: zmax.re, im: 0};
  drawLine(u, d, color, 1);
  drawLine(l, r, color, 1);
}

function drawIter(z0, c, n) {
  let z = z0;
  for (let i = 0; i < n; i++) {
    const z1 = zAdd(zSquare(z), c);
    drawLine(z, z1, "#80ce87", 1);
    drawCircle(z1, "#92e5a1", 3); //z0 draw extra
    z = z1;
  }
}

function drawAnker(z0, c) {
  // drawCircle2(z0, 5, '#00ff00', '#92e5a1', 2);
  drawCircle2(z0, 5, '#020204', '#92e5a1', 2);
  // drawCircle2(c, 5, '#00ff00', '#003300', 2);
  // drawCircle2(c, 5, '#020204', '#ff6f01', 2); //orange
  drawCircle2(c, 5, '#020204', '#ef4026', 2); //tomato
}

function refreshCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots(mandelbrotDots, 2);
  drawAxes("#204829");
}

async function demo1(z0, trail) {
  // const z0 = { re: 0, im: 0 };
  const origin = { re: -0.2, im: 0};
  const r = 0.5;
  const n = 300;
  const df = (Math.PI * 2) / n;
  let f = Math.PI * 0.75;
  let end = n * 2;
  if (trail) end = n;

  for (i = 0; i <= end; i++) {
    if (!trail) refreshCanvas();
    const c = { re: origin.re + r * Math.cos(f),
                im: origin.im + r * Math.sin(f) }
    drawIter(z0, c, 30);
    drawAnker(z0, c);
    f -= df;
    await sleep(10);
  }
}

async function demo2(c, trail) {
  const origin = { re: 0, im: 0};
  const r = 0.5;
  const n = 300;
  const df = (Math.PI * 2) / n;
  let f = Math.PI * 0.75;
  let end = n * 2;
  if (trail) end = n;

  for (i = 0; i <= end; i++) {
    if (!trail) refreshCanvas();
    const z = { re: origin.re + r * Math.cos(f),
                im: origin.im + r * Math.sin(f) }
    drawIter(z, c, 30);
    drawAnker(z, c);
    f -= df;
    await sleep(10);
  }
}

drawDots(mandelbrotDots, 2);
drawAxes("#204829");
const z0 = { re:0, im:0 };
// const c = {re:-0.6, im:0.3};
const c = {re:0.3, im:0.3};
// drawIter(z0, c, 20);
// drawAnker(z0, c);
demo1(z0, true);
// demo1(z0, false);
// demo2(c, true);
// demo2(c, false);

async function init() {
  // await sleep(2000);  //miliseconds
  const now = new Date().toLocaleString();
  await queueLog("\n[ " + now + " ]");
  await queueLog(quote);
  // await queueLog("A TRON-style maze animation using DFS.");
  // await queueLog("Implemented by y-labz, 2025-06 🚀");
  // await queueLog("Initializing GRID...");
  // await initDrawGrid();
  // await sleep(1000);  //miliseconds
  // await queueLog("Initialization done.");
  // await queueLog("Grid size: " + rows + " x " + cols);
  // await queueLog("Init cell x = " + current.x + " y = " + current.y);
}

async function main() {
  await init();
  // await queueLog("Start maze carving...");
  // loop();
}

function loop() {

  // requestAnimationFrame(loop);
  // setTimeout(loop, 60);
  setTimeout(loop, 100);
}

main();

// Optional: reload on resize (to rebuild layout)
// window.addEventListener('resize', () => location.reload());

// function drawDots(ctx, dots, width, height) {
//   ctx.fillStyle = "#204829"; // Matrix green
//   dots.forEach(dot => {
//     const x = width * (dot.re + 1) / 2.;  // map [-2.5,1] to [0,width]
//     const y = height * (1 - dot.im) / 2.; // map [-1.5,1.5] to [0,height]
//     ctx.fillRect(x, y, 1.5, 1.5);
//   });
// }
