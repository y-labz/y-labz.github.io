// 2025.06, y-labz
//-----------------------------------------------------
const banner = `
░█░░█░░░░█░░█▀▀▄░█▀▀▄░▀▀█
░█▄▄█░▀▀░█░░█▄▄█░█▀▀▄░▄▀▒
░▄▄▄▀░░░░▀▀░▀░░▀░▀▀▀▀░▀▀▀
`;
const minL = Math.min(window.innerWidth, window.innerHeight);
const maxL = Math.max(window.innerWidth, window.innerHeight);
//body margin 4, div margin 4, border-box excluded border 2
const conL = minL - 16; //container length
const logL = maxL - 16 - conL - 8; //log div length
const canL = conL - 4; //canvas length

const nSeeds = 600;
// const nCircle = 40;
const goldenRatio = (1 + Math.sqrt(5)) * 0.5; //1.618
// #d_phi = (2*np.pi) * (ratio-1) #or *ratio, no diff!!!
// #d_phi = (2*np.pi) * (np.pi-3)
// d_phi = (2*np.pi) * (np.sqrt(2)-1)
const dPhi = 2 * Math.PI / 100;
const dPhiGold = 2 * Math.PI * (goldenRatio - 1);
const nCircle = nSeeds * dPhiGold / (Math.PI * 2);
const radius0 = 5 * canL*0.5 / nCircle;
const origin = {x: canL / 2, y: canL / 2};

//-----------------------------------------------------
function setupWindow() {
  const container = document.createElement('div');
  container.id = "container";
  container.style.width = conL + "px";
  container.style.height = conL + "px";
  // document.body.appendChild(container);

  // add control panel window Responsive layout
  const logWindow = document.createElement('div');
  logWindow.id = "config";

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
// switch added in html, set default values after page load:
const slider = document.getElementById('fancySwitch');
let lineFlag = false;
slider.checked = false;
// let lineFlag = true;
// slider.checked = true;

//-----------------------------------------------------
function polar2xy(r, phi) {
  return {x: r * Math.cos(phi), y: r * Math.sin(phi)};
}

function spiralArchi(phi) {
  // const a = 1;
  const r0 = 10;
  // const a = Math.floor((canL*0.5-r0)/(2*Math.PI*nCircle));
  const a = (canL*0.5 - 2*r0)/(2*Math.PI*nCircle);
  return a * phi + r0;
}

function spiralFerma(phi) {
  // const a = 1;
  const r0 = 10;
  // const a = Math.floor((canL*0.5-r0)/(2*Math.PI*nCircle));
  const a = (canL*0.5 - 2*r0) / Math.sqrt(2*Math.PI * nCircle);
  return a * Math.sqrt(phi) + r0;
}

function genDots(dphi) {
  const dots = [];
  let phi = 0;
  // for (let i = 0; i < nSeeds; i++) {
  while (phi <= Math.PI*2*nCircle) {
    // const f = dphi * i;
    const r = spiralArchi(phi);
    // const r = spiralFerma(phi);
    const d = polar2xy(r, phi);
    // dots.push({x: d.x+origin.x, y: d.y+origin.y});
    dots.push({x: d.x+origin.x, y: -d.y+origin.y});
    phi += dphi;
  }
  return dots;
}
const dots1 = genDots(dPhi);
const dotsGold = genDots(dPhiGold);

function drawCircle(c, color = "#00ff88", radius) {
  // const c = toCanvas(z);
  ctx.beginPath();
  ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawCircle2(c, radius, fillColor, strokeColor, lw = 2) {
  // const c = toCanvas(z);
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

function drawLine(a, b, color = "#00ff88", lw) {
  // const a = toCanvas(z1);
  // const b = toCanvas(z2);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

function distance(z1, z2) {
  return Math.hypot(z1.re - z2.re, z1.im - z2.im);
}

function drawDotsOld(dots, size) {
  // ctx.fillStyle = "#204829";
  dots.forEach(co => {
    ctx.fillRect(co.x, co.y, size, size);
  });
}

function drawDots() {


  // for (i = 0; i < dots1.length - 1; i++) {
  //   drawLine(dots1[i], dots1[i+1], 'grey', 1);
  // }

  for (i = 0; i < dotsGold.length; i++) {
    if (lineFlag && i > 0) {
      drawLine(dotsGold[i], dotsGold[i-1], 'grey', 1);
    }
    // drawCircle2(dotsGold[i], radius0, 'white', 'black', 2);
    drawCircle2(dotsGold[i], radius0 * (1 + 2*i/dotsGold.length), 'white', 'black', 2);
    // drawCircle2(dotsGold[i], 20 + Math.sqrt(i)*1, 'white', 'black', 2);
    // drawCircle2(dotsGold[i], 40, 'white', 'black', 5);
  }

  // dotsGold.forEach(d => {
  //   drawCircle2(d, 10, 'white', 'black', 2);
  // });
}
drawDots();

function refreshCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots(mandelbrotDots, 2);
}

function draw() {
  refreshCanvas();
  drawIter(zDrag, cDrag, 50);
  requestAnimationFrame(draw);
}

//-----------------------------------------------------

slider.addEventListener("change", function() {
  lineFlag = this.checked;
});

