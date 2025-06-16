const story = `Once upon a time, I enjoyed Brilliant’s daily challenges — crisp little puzzles that tickled my neurons and made morning coffee taste smarter. Then they axed that feature and slapped on a new logo that looked like it lost a fight with Clipart. Naturally, I rage-quit my subscription. Aesthetic crimes have consequences.

Left wandering the digital wilderness, I stumbled upon Project Euler and a few other mathy wonderlands where I could still get my daily dose of mental gymnastics — the kind that don’t require a PhD, a time machine, or selling my soul to understand. Just me, some clean code, and a few elegant problems that flirt with logic and dance with numbers.

This page? It’s a growing collection of selected warm-up sessions. Tiny projects. Quick dives. Beautiful brain candy that lives at the intersection of math and code — not too heavy, not too long, just enough to keep the gears turning and the circuits humming.

If you're the kind of person who reads README files or cares about licenses, you’ll find them here:
`;

const lic = "https://github.com/y-labz/y-labz.github.io?tab=License-1-ov-file";

//-----------------------------------------------------
const banner = `
░█░░█░░░░█░░█▀▀▄░█▀▀▄░▀▀█
░█▄▄█░▀▀░█░░█▄▄█░█▀▀▄░▄▀▒
░▄▄▄▀░░░░▀▀░▀░░▀░▀▀▀▀░▀▀▀
`;

const quote = getQuote();
const logWindow = document.getElementById("log");

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

function spin() {
  const bar = document.getElementById('statusbar');
  const spinner = ['|', '/', '-', '\\'];
  let index = 0;

  spinInterval = setInterval(() => {
    const spinChar = spinner[index % spinner.length];
    bar.textContent = `[ 2visitor@y-labz:~ hi ... ${spinChar} ]`;
    index++;
  }, 150);
}

//-----------------------------------------------------
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

  await simlog(quote);
  await simlog("\n");

  // add status bar and spinner
  const bar = document.createElement('span');
  bar.id = "statusbar";
  const barWrap = document.createElement('div');
  barWrap.appendChild(bar);

  if (cursor && logWindow.contains(cursor)) {
    logWindow.insertBefore(barWrap, cursor);
  } else {
    logWindow.appendChild(barWrap);
  }

  refreshCursor();
  spin();

  await simlog("\n");
  await simlog("💭 " + story);
  await simloga("... license ...", lic);

}

main();

