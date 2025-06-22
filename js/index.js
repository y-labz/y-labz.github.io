const folders = [
  "about",
  "numbers",
  "sunflower",
  "show-me-the-money",
  "maze",
  "game-of-life",
  "pendulum",
  "reader-demo",
];

const banner = `
░█░░█░░░░█░░█▀▀▄░█▀▀▄░▀▀█
░█▄▄█░▀▀░█░░█▄▄█░█▀▀▄░▄▀▒
░▄▄▄▀░░░░▀▀░▀░░▀░▀▀▀▀░▀▀▀
`;

const quote = getQuote();
const logWindow = document.getElementById("log");
let delacy = 40; //for fancy log

//-----------------------------------------------------
async function simlog(message) {
  const cursor = document.getElementById("cursor");
  // simply put the message above the cursor
  const logLine = document.createElement('div');
  logLine.textContent = message;
  logLine.style.whiteSpace = "pre-wrap";
  // logLine.style.whiteSpace = "nowrap";
  if (cursor && logWindow.contains(cursor)) {
    logWindow.insertBefore(logLine, cursor);
  } else {
    logWindow.appendChild(logLine);
  }
  logWindow.scrollTop = logWindow.scrollHeight;
};

async function simloga(message, url) {
  const cursor = document.getElementById("cursor");
  // simply put the message above the cursor
  const logLine = document.createElement('a');
  const wrap = document.createElement('div');
  logLine.href = url;
  logLine.textContent = message;
  logLine.style.whiteSpace = "pre-wrap";
  // logLine.style.whiteSpace = "nowrap";
  logLine.target = '_blank'; // New tab
  wrap.appendChild(logLine);

  if (cursor && logWindow.contains(cursor)) {
    logWindow.insertBefore(wrap, cursor);
  } else {
    logWindow.appendChild(wrap);
  }
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
async function fancylog(message) {
  //remove old blinking cursor
  const cursorOld = document.getElementById("cursor");
  if (cursorOld) cursorOld.remove();

  //add empty logline and non blinking cursor leader
  const logLine = document.createElement('div');
  const logLead = document.createElement('div');
  logLead.id = "cursor1";
  logLead.textContent = "█";
  logLead.style.display = "inline";
  logWindow.append(logLine, logLead);

  //now loop over the message and feed that logline
  logLine.style.whiteSpace = "pre-wrap";
  logLine.style.display = "inline";
  await typeText(delacy, logLine, message);

  //WAIT util whole line done, remove cursor tail
  logLead.remove();
  logLine.style.removeProperty("display");
  //put new blinking cursor in the new line
  const cursorNew = document.createElement('div');
  cursorNew.id = "cursor";
  cursorNew.textContent = "█";
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
    await fancylog(msg); // waits for full animation before next one
  }
  isLogging = false;
}

async function queueLog(message) {
  logQueue.push(message);
  await processLogQueue();
}

//-----------------------------------------------------
const OWNER = 'y-labz';
const REPO = 'y-labz.github.io';
const RAW = 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/main/';

async function parseHtmlText(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const title = doc.querySelector('title')?.textContent || 'Untitled';
  const desc = doc.querySelector('meta[name="description"]')?.content || '...';
  return { title, desc };
}

async function buildList() {
  const list = [];
  for (const f of folders) {
    const res = await fetch(RAW + f + '/index.html');
    const html = await res.text();
    const link = 'https://' + REPO + '/' + f;
    const { title, desc } = await parseHtmlText(html);
    list.push({ title, desc, url: `${link}` });
  }
  return list;
}

//-----------------------------------------------------
let spinInterval;

function spin() {
  const bar = document.getElementById('statusbar');
  const spinner = ['|', '/', '-', '\\'];
  let index = 0;
  bar.style.color = '#FF9E64';
  bar.style.backgroundColor = '#373640';
  // bar.style.color = 'rgba(255, 158, 100, 1)';
  // bar.style.backgroundColor = 'rgba(255, 158, 100, 0.5)';

  spinInterval = setInterval(() => {
    const spinChar = spinner[index % spinner.length];
    bar.textContent = `[ fetching contents ${spinChar} ]`;
    index++;
  }, 150); // 150ms = nice smooth spin
}
// Later, to stop spinning:
// clearInterval(spinInterval);

function refreshCursor() {
  const cursorOld = document.getElementById("cursor");
  if (cursorOld) cursorOld.remove();
  const cursorNew = document.createElement('div');
  cursorNew.id = "cursor";
  cursorNew.textContent = "█";
  logWindow.appendChild(cursorNew);
}

async function main() {
  // add banner here
  const ban = document.createElement('div');
  ban.id = "banner";
  ban.textContent = banner;
  logWindow.appendChild(ban);

  // add default blinking cursor here
  const cursor = document.createElement('div');
  cursor.id = "cursor";
  cursor.textContent = "█";
  logWindow.appendChild(cursor);

  // put time under banner
  const now = new Date().toLocaleString();
  simlog("\n[ " + now + " ]");

  await sleep(1000);
  await queueLog(quote);
  await simlog("\n");

  // add status bar and spinner
  // await sleep(1000);
  const bar = document.createElement('span');
  bar.id = "statusbar";
  const barWrap = document.createElement('div');
  barWrap.appendChild(bar);

  if (cursor && logWindow.contains(cursor)) {
    logWindow.insertBefore(barWrap, cursor);
  } else {
    logWindow.appendChild(barWrap); // fallback!
  }

  refreshCursor();
  spin();

  const pageList = await buildList().catch(err => { simlog(err); });
  await sleep(1500);

  if (pageList && pageList.length > 1) {
    clearInterval(spinInterval);
    bar.textContent = `[ fetching contents done: ${pageList.length} pages listed. ]`;
    // bar.style.color = 'rgba(13, 185, 215, 1)';
    // bar.style.backgroundColor = 'rgba(13, 185, 215, 0.5)';
    bar.style.color = '#0DB9D7';
    bar.style.backgroundColor = '#22374B';

    for (const page of pageList) {
      await simlog("\n");
      // await simloga("TITLE: " + page.title, page.url);
      await simloga("🚀 " + page.title, page.url);
      // await simlog( "DESCR: " + page.desc);
      await simlog( "💭 " + page.desc);
      await sleep(200);
    };
  }

}

main();

