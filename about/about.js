const story = "Well, it is getting late today - I might write something more later... For license and readme see here:";

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
  await simloga("...readme...", lic);

}

main();

