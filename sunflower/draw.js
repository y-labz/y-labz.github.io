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
const origin = {x: canL / 2, y: canL / 2};
const goldenRatio = (1 + Math.sqrt(5)) * 0.5; //1.618
const nSeeds = 1000;

let confL = logL * 0.9; //config panel length

let r0factor = 0.02;
let r0 = canL * r0factor; //initial radius
let rMax = canL / 2 - 20 - r0;

let ratio = goldenRatio - 1;
let dPhi = 2 * Math.PI * ratio;
// let nCircle = nSeeds * dPhi / (Math.PI * 2);
// let rSeeds = 1 * rMax / nCircle;
let rSeeds = 2;
let rSeedsFactor = 1; //0~2? UI
let hue = 210;

let lineFlag = false;
let primeFlag = false;
let fiboFlag = false;
let fermaFlag = false;

//-----------------------------------------------------
function setupWindow() {
  const container = document.createElement('div');
  container.id = "container";
  container.style.width = conL + "px";
  container.style.height = conL + "px";

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
    confL = conL * 0.9; //config panel length
  }

  //add canvas here, max L0-border2
  const canvas = document.createElement('canvas');
  canvas.id = "game";
  canvas.width = canL;
  canvas.height = canL;
  container.appendChild(canvas);

  // add config UI here:
  const label0 = document.createElement('label');
  // label0.style.display = "block";
  // label0.style.paddingTop = "20px";
  label0.textContent = `Ratio: ${ratio.toFixed(4)}`;
  label0.setAttribute('for', 'ratioSlider');

  const slider0 = document.createElement('input');
  slider0.type = 'range';
  slider0.id = 'ratioSlider';
  slider0.min = '0';
  slider0.max = '1';
  slider0.step = '0.0001';
  slider0.value = ratio;
  slider0.style.width = confL + "px";

  slider0.addEventListener('input', () => {
    ratio = parseFloat(slider0.value);
    label0.textContent = `Ratio: ${ratio.toFixed(4)}`;
    dPhi = 2 * Math.PI * ratio;
  });

  confDiv.appendChild(label0);
  confDiv.appendChild(slider0);

  const label1 = document.createElement('label');
  label1.textContent = `Seed size: ${rSeeds.toFixed(1)}`;
  label1.setAttribute('for', 'rSeedSlider');

  const slider1 = document.createElement('input');
  slider1.type = 'range';
  slider1.id = 'rSeedSlider';
  slider1.min = '1';
  slider1.max = '20';
  slider1.step = '0.1';
  slider1.value = rSeeds;
  slider1.style.width = confL + "px";

  slider1.addEventListener('input', () => {
    rSeeds = parseFloat(slider1.value);
    label1.textContent = `Seed size: ${rSeeds.toFixed(1)}`;
  });

  confDiv.appendChild(label1);
  confDiv.appendChild(slider1);

  const label2 = document.createElement('label');
  label2.textContent = `Seed size scale: ${rSeedsFactor.toFixed(2)}`;
  label2.setAttribute('for', 'rSeedFactSlider');

  const slider2 = document.createElement('input');
  slider2.type = 'range';
  slider2.id = 'rSeedFactSlider';
  slider2.min = '0';
  slider2.max = '3';
  slider2.step = '0.01';
  slider2.value = rSeedsFactor;
  slider2.style.width = confL + "px";

  slider2.addEventListener('input', () => {
    rSeedsFactor = parseFloat(slider2.value);
    label2.textContent = `Seed size scale: ${rSeedsFactor.toFixed(2)}`;
  });

  confDiv.appendChild(label2);
  confDiv.appendChild(slider2);

  const label3 = document.createElement('label');
  label3.textContent = `Radius offset: ${r0factor.toFixed(2)}`;
  label3.setAttribute('for', 'r0FactSlider');

  const slider3 = document.createElement('input');
  slider3.type = 'range';
  slider3.id = 'r0FactSlider';
  slider3.min = '0';
  slider3.max = '0.15';
  slider3.step = '0.01';
  slider3.value = r0factor;
  slider3.style.width = confL + "px";

  slider3.addEventListener('input', () => {
    r0factor = parseFloat(slider3.value);
    label3.textContent = `Radius offset: ${r0factor.toFixed(2)}`;
    r0 = canL * r0factor; //initial radius
    rMax = canL / 2 - 20 - r0;
  });

  confDiv.appendChild(label3);
  confDiv.appendChild(slider3);

  const label4 = document.createElement('label');
  label4.textContent = `Color hue: ${hue.toFixed(1)}`;
  label4.setAttribute('for', 'hueSlider');

  const slider4 = document.createElement('input');
  slider4.type = 'range';
  slider4.id = 'hueSlider';
  slider4.min = '0';
  slider4.max = '360';
  slider4.step = '1';
  slider4.value = hue;
  slider4.style.width = confL + "px";

  slider4.addEventListener('input', () => {
    hue = parseFloat(slider4.value);
    label4.textContent = `Color hue: ${hue.toFixed(1)}`;
  });

  confDiv.appendChild(label4);
  confDiv.appendChild(slider4);
  //-----------------------------------------------------
  // Preset values
  const label5 = document.createElement('label');
  label5.textContent = "Some preset ratios:";

  const presets = {
    '0.33': 0.33,
    '0.333': 0.333,
    '0.66': 0.66,
    '0.666': 0.666,
    '0.88': 0.88,
    '0.888': 0.888,
    '1/π': 1 / Math.PI,
    '1/φ': 1 / ((1 + Math.sqrt(5)) / 2),
    '1/3': 1 / 3,
    '1/e': 1 / Math.E,
    '1/√2': 1 / Math.sqrt(2)
  };
  const btnContainer = document.createElement('div');
  btnContainer.style.marginTop = '10px';

  Object.entries(presets).forEach(([label, value]) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      ratio = value;
      slider0.value = ratio;
      label0.textContent = `Ratio: ${ratio.toFixed(4)}`;
      console.log(`Preset selected (${label}):`, ratio);
      dPhi = 2 * Math.PI * ratio;
    });
    btnContainer.appendChild(btn);
  });

  confDiv.appendChild(label5);
  confDiv.appendChild(btnContainer);

  //-----------------------------------------------------
  // add toggle switch Ferma Spiral...
  const swDiv3 = document.createElement('div');
  swDiv3.className = 'fancy-switch-container';

  const sw3 = document.createElement('input');
  sw3.type = 'checkbox';
  sw3.id = 'fancySwitch3';
  sw3.className = 'fancy-switch';
  sw3.checked = false;

  const swlabel3 = document.createElement('label');
  swlabel3.setAttribute('for', 'fancySwitch3');
  swlabel3.className = 'fancy-slider';

  const comment3 = document.createElement('span');
  comment3.textContent = ' // Toggle Fermat spiral';
  const wrapper3 = document.createElement('div');
  wrapper3.style.display = 'flex';
  wrapper3.style.alignItems = 'end';
  wrapper3.style.gap = '10px';

  swDiv3.appendChild(sw3);
  swDiv3.appendChild(swlabel3);
  wrapper3.appendChild(swDiv3);
  wrapper3.appendChild(comment3);
  confDiv.appendChild(wrapper3);

  sw3.addEventListener("change", function() {
    fermaFlag = this.checked;
  });

  // add toggle switch primes...
  const swDiv1 = document.createElement('div');
  swDiv1.className = 'fancy-switch-container';

  const sw1 = document.createElement('input');
  sw1.type = 'checkbox';
  sw1.id = 'fancySwitch1';
  sw1.className = 'fancy-switch';
  sw1.checked = false;

  const swlabel1 = document.createElement('label');
  swlabel1.setAttribute('for', 'fancySwitch1');
  swlabel1.className = 'fancy-slider';

  const comment1 = document.createElement('span');
  comment1.textContent = ' // Toggle Prime highlighting';
  // Create wrapper div for switch and text
  const wrapper1 = document.createElement('div');
  wrapper1.style.display = 'flex';
  wrapper1.style.alignItems = 'end';
  wrapper1.style.gap = '10px';

  swDiv1.appendChild(sw1);
  swDiv1.appendChild(swlabel1);
  wrapper1.appendChild(swDiv1);
  wrapper1.appendChild(comment1);
  confDiv.appendChild(wrapper1);

  sw1.addEventListener("change", function() {
    primeFlag = this.checked;
  });

  // add toggle switch fibonacci...
  const swDiv2 = document.createElement('div');
  swDiv2.className = 'fancy-switch-container';

  const sw2 = document.createElement('input');
  sw2.type = 'checkbox';
  sw2.id = 'fancySwitch2';
  sw2.className = 'fancy-switch';
  sw2.checked = false;

  const swlabel2 = document.createElement('label');
  swlabel2.setAttribute('for', 'fancySwitch2');
  swlabel2.className = 'fancy-slider';

  const comment2 = document.createElement('span');
  comment2.textContent = ' // Toggle Fibonacci highlighting';
  // Create wrapper div for switch and text
  const wrapper2 = document.createElement('div');
  wrapper2.style.display = 'flex';
  wrapper2.style.alignItems = 'end';
  wrapper2.style.gap = '10px';

  swDiv2.appendChild(sw2);
  swDiv2.appendChild(swlabel2);
  wrapper2.appendChild(swDiv2);
  wrapper2.appendChild(comment2);
  confDiv.appendChild(wrapper2);

  sw2.addEventListener("change", function() {
    fiboFlag = this.checked;
  });

  // add toggle switch lines...
  const swDiv0 = document.createElement('div');
  swDiv0.className = 'fancy-switch-container';

  const sw0 = document.createElement('input');
  sw0.type = 'checkbox';
  sw0.id = 'fancySwitch0';
  sw0.className = 'fancy-switch';
  sw0.checked = false;

  const swlabel0 = document.createElement('label');
  swlabel0.setAttribute('for', 'fancySwitch0');
  swlabel0.className = 'fancy-slider';

  const comment0 = document.createElement('span');
  comment0.textContent = ' // Toggle line drawing';
  // Create wrapper div for switch and text
  const wrapper0 = document.createElement('div');
  wrapper0.style.display = 'flex';
  wrapper0.style.alignItems = 'end';
  wrapper0.style.gap = '10px'; // space between switch and text

  swDiv0.appendChild(sw0);
  swDiv0.appendChild(swlabel0);
  wrapper0.appendChild(swDiv0);
  wrapper0.appendChild(comment0);
  confDiv.appendChild(wrapper0);

  sw0.addEventListener("change", function() {
    lineFlag = this.checked;
  });


  // add banner in the end
  const ban = document.createElement('div');
  ban.id = "banner";
  ban.textContent = banner;
  confDiv.appendChild(ban);

}

setupWindow();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

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

//-----------------------------------------------------
function polar2xy(r, phi) {
  return {x: r * Math.cos(phi), y: r * Math.sin(phi)};
}

function spiralArchi(phi) {
  const a = rMax /(nSeeds * dPhi);
  return a * phi + r0;
}

function spiralFerma(phi) {
  const a = rMax / Math.sqrt(nSeeds * dPhi);
  return a * Math.sqrt(phi) + r0;
}

function genDots(dphi) {
  if (dphi === 0) return [];
  const dots = [];
  let phi = 0;
  let r = 0;
  for (let i = 0; i < nSeeds; i++) {
    if (fermaFlag) {
      r = spiralFerma(phi);
    } else {
      r = spiralArchi(phi);
    }
    const d = polar2xy(r, phi);
    dots.push({x: d.x+origin.x, y: -d.y+origin.y});
    phi += dphi;
  }
  return dots;
}

function drawCircle(c, radius, color = "#00ff88") {
  ctx.beginPath();
  ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawCircle2(c, radius, fillColor, strokeColor, lw = 2) {
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
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

function drawDots(dots) {
  let colorInside;
  const colorBorder = `hsl(${hue}, 100%, 50%)`;

  for (i = 0; i < dots.length; i++) {

    if (lineFlag && i > 0) {
      drawLine(dots[i], dots[i-1], 'grey', 1);
    }

    if (primeFlag && primes.has(i)) {
      colorInside = 'lime';
    }
    else if (fiboFlag && fibos.has(i)){
      colorInside = 'tomato';
    }
    else {
      // colorInside = `hsl(${hue}, 100%, 50%)`;
      // colorInside = `hsl(${hue}, 100%, ${90 - 40*i/nSeeds}%)`;
      colorInside = `hsla(${hue}, 90%, 50%, ${0.2+0.8*i/nSeeds})`;
    }

    // drawCircle(dots[i], rSeeds * (1 + rSeedsFactor*i/dots.length), colorInside);

    // drawCircle2(dots[i], rSeeds, 'white', 'black', 2);
    // drawCircle2(dots[i], rSeeds * (1 + rSeedsFactor*i/dots.length), colorInside, 'black', 1);
    drawCircle2(dots[i], rSeeds * (1 + rSeedsFactor*i/nSeeds), colorInside, colorBorder, 2);
    // drawCircle2(dotsGold[i], 20 + Math.sqrt(i)*1, 'white', 'black', 2);
    // drawCircle2(dotsGold[i], 40, 'white', 'black', 5);
  }
}

function draw() {
  const dots1 = genDots(dPhi);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots(dots1);
  requestAnimationFrame(draw);
}

draw();
