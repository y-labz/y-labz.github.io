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

const r0 = canL * 0.05; //initial radius
const rMax = canL / 2 - 10 - r0;
const origin = {x: canL / 2, y: canL / 2};

const nSeeds = 1000;
// const nCircle = 40;
const goldenRatio = (1 + Math.sqrt(5)) * 0.5; //1.618
const dPhiGold = 2 * Math.PI * (goldenRatio - 1);
// #d_phi = (2*np.pi) * (ratio-1) #or *ratio, no diff!!!
// #d_phi = (2*np.pi) * (np.pi-3)
// d_phi = (2*np.pi) * (np.sqrt(2)-1)
let ratio = 0.618; //0~1, UI
let dPhi = 2 * Math.PI * ratio;
let nCircle = nSeeds * dPhi / (Math.PI * 2);
// let rSeeds = 1 * rMax / nCircle;
let rSeeds = 5;

//-----------------------------------------------------
function setupWindow() {
  const container = document.createElement('div');
  container.id = "container";
  container.style.width = conL + "px";
  container.style.height = conL + "px";
  // document.body.appendChild(container);

  // add control panel window Responsive layout
  const confDiv = document.createElement('div');
  confDiv.id = "config";

  if (window.innerWidth > window.innerHeight) {
    // Landscape – side by side
    confDiv.style.height = conL + "px";
    confDiv.style.width = logL + "px";
    const wrapper = document.createElement('div');
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "row";
    // confDiv.style.flex = "1 1 auto";
    wrapper.appendChild(container);
    wrapper.appendChild(confDiv);
    document.body.appendChild(wrapper);
  } else {
    // Portrait – stacked flex column set in css
    document.body.appendChild(container);
    confDiv.style.width = conL + "px";
    confDiv.style.height = logL + "px";
    document.body.appendChild(confDiv);
  }

  //add canvas here, max L0-border2
  const canvas = document.createElement('canvas');
  canvas.id = "game";
  canvas.width = canL;
  canvas.height = canL;
  container.appendChild(canvas);

  // add banner here
  const ban = document.createElement('div');
  ban.id = "banner";
  ban.textContent = banner;
  confDiv.appendChild(ban);

  // add config UI here:
      const label = document.createElement('label');
    label.textContent = 'Ratio: ';
    label.setAttribute('for', 'ratioSlider');

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'ratioSlider';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.001';
    slider.value = ratio;

    const valueDisplay = document.createElement('span');
    valueDisplay.id = 'ratioValue';
    valueDisplay.textContent = ratio;

    confDiv.appendChild(label);
    confDiv.appendChild(slider);
    confDiv.appendChild(valueDisplay);

      // Preset values
    const presets = {
      '1/π': 1 / Math.PI,
      '1/φ': 1 / ((1 + Math.sqrt(5)) / 2),
      '1/3': 1 / 3,
      '1/2': 1 / 2,
      '1/√2': 1 / Math.sqrt(2)
    };

    // Container for buttons
    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '10px';

    Object.entries(presets).forEach(([label, value]) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        ratio = value;
        slider.value = ratio;
        valueDisplay.textContent = ratio.toFixed(4); // optional precision
        console.log(`Preset selected (${label}):`, ratio);
      });
      btnContainer.appendChild(btn);
    });

    confDiv.appendChild(btnContainer);
}

setupWindow();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ratioSlider = document.getElementById('ratioSlider');
const valueDisplay = document.getElementById('ratioValue');


//-----------------------------------------------------
// switch added in html, set default values after page load:
const slider = document.getElementById('fancySwitch');
let lineFlag = false;
slider.checked = false;
// let lineFlag = true;
// slider.checked = true;
let primeFlag = true;
let fiboFlag = true;

//-----------------------------------------------------
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const sqrtN = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= sqrtN; i += 2) {
    if (n % i === 0) return false;
  }

  return true;
}
function listPrimes(limit) {
  const result = [];
  for (let i = 0; i < limit; i++) {
    if (isPrime(i)) {
      result.push(i);
    }
  }
  return result;
}

function listFibonacci(limit) {
  const result = [1, 1];
  while (result[result.length - 1] <= limit) {
    const next = result[result.length - 1] + result[result.length - 2];
    result.push(next);
  }
  return result;
}

const primes = new Set(listPrimes(nSeeds));
const fibos = new Set(listFibonacci(nSeeds));
// const fibos = listFibonacci(nSeeds);
// console.log(fibos.length);
// console.log(fibos[fibos.length-1]);
//-----------------------------------------------------
function polar2xy(r, phi) {
  return {x: r * Math.cos(phi), y: r * Math.sin(phi)};
}

function spiralArchi(phi) {
  // const a = 1;
  // const a = Math.floor((canL*0.5-r0)/(2*Math.PI*nCircle));
  const a = rMax /(nSeeds * dPhi);
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
  for (let i = 0; i < nSeeds; i++) {
  // while (phi <= Math.PI*2*nCircle) {
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
// const dots1 = genDots(dPhi);
// const dotsGold = genDots(dPhiGold);

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

function drawDots(dots) {
  let colorInside = 'white';

  for (i = 0; i < dots.length; i++) {
    if (lineFlag && i > 0) {
      drawLine(dots[i], dots[i-1], 'grey', 1);
    }

    if (primeFlag && primes.has(i)) {
      colorInside = 'red';
    }
    else if (fiboFlag && fibos.has(i)){
      colorInside = 'blue';
    }
    else {
      colorInside = 'white';
    }


    // drawCircle2(dots[i], rSeeds, 'white', 'black', 2);
    drawCircle2(dots[i], rSeeds * (1 + 1.0*i/dots.length), colorInside, 'black', 2);
    // drawCircle2(dotsGold[i], 20 + Math.sqrt(i)*1, 'white', 'black', 2);
    // drawCircle2(dotsGold[i], 40, 'white', 'black', 5);
  }

  // dotsGold.forEach(d => {
  //   drawCircle2(d, 10, 'white', 'black', 2);
  // });
}


function draw() {
dPhi = 2 * Math.PI * ratio;
nCircle = nSeeds * dPhi / (Math.PI * 2);
  const dots1 = genDots(dPhi);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots(dots1);
  requestAnimationFrame(draw);
}
draw();

//-----------------------------------------------------

slider.addEventListener("change", function() {
  lineFlag = this.checked;
});

ratioSlider.addEventListener('input', () => {
  ratio = parseFloat(ratioSlider.value);
  valueDisplay.textContent = ratio;
  console.log('Current ratio:', ratio); // optional debug log
});
