const banner = `
      ▜   ▌    
  ▌▌▄▖▐ ▀▌▛▌▀▌ 
  ▙▌  ▐▖█▌▙▌▙▖.
  ▄▌           
               
`;

//-----------------------------------------------------
function setupWindow() {
  let L0 = Math.min(window.innerWidth, window.innerHeight);
  let L1 = Math.max(window.innerWidth, window.innerHeight);
  //body margin 8, div margin 8, border-box excluded border2
  L0 = L0 - 32;
  L1 = L1 - 32 - L0 - 16;
  const container = document.createElement('div');
  container.id = "container";
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
    // logWindow.style.flex = "1 1 auto";
    wrapper.appendChild(container);
    wrapper.appendChild(logWindow);
    document.body.appendChild(wrapper);
  } else {
    // Portrait – stacked flex column set in css
    document.body.appendChild(container);
    logWindow.style.width = L0 + "px";
    logWindow.style.height = L1 + "px";
    document.body.appendChild(logWindow);
  }
  // add default blinking cursor here
  const cursor = document.createElement('div');
  cursor.id = "cursor";
  logWindow.appendChild(cursor);

  //add canvas here, max L0-border2
  const canvas = document.createElement('canvas');
  canvas.id = "game"
  // canvas.width = gameDim
  // canvas.height = gameDim
  // const ctx = canvas.getContext("2d");
  canvas.style.width = L0 - 4 + "px";
  canvas.style.height = L0 - 4 + "px";
  container.appendChild(canvas);
}

setupWindow();

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

function typeText(baseSpeed = 50, el, txt) {
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
  await typeText(80, logLine, message);

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

queueLog("testing testing here");
queueLog("another line to test");
queueLog("yet another one");

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
window.addEventListener('resize', () => location.reload());

