//-----------------------------------------------------
// setup canvas:
const minL = Math.min(window.innerWidth, window.innerHeight);
const canvas = document.createElement('canvas');
canvas.width = minL;
canvas.height = minL;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

//-----------------------------------------------------
// color theme:
const bgColor = "rgba(10, 10, 30, 0.5)"; // deep navy blue fade
const armColor = "#FFA500"; // orange
const bob1Color = "#FFD700"; // gold
const bob2Color = "#FF4500"; // fire red-orange
const trailBase = [255, 105, 0]; // hot orange

//-----------------------------------------------------
// Pendulum parameters
const m1 = 10, m2 = 10;
const l1 = 0.9 * minL / 4; //config
const l2 = l1;
const g = 10;
const dt = 1 / 6;

let state = [
  Math.PI * 2 * Math.random(), // random theta1 between 0 and 2π
  Math.PI * 2 * Math.random(), // random theta2 between 0 and 2π
  0,                           // initial omega1 = 0
  0                            // initial omega2 = 0
];

const origin = { x: minL / 2, y: minL / 3 };
const trail = [];
const maxTrailLength = 300; //config

function derivatives([a1, a2, a1_v, a2_v]) {
  const delta = a1 - a2;
  const den1 = (2 * m1 + m2 - m2 * Math.cos(2 * delta));
  const den2 = den1;

  const a1_a = (
    -g * (2 * m1 + m2) * Math.sin(a1)
      - m2 * g * Math.sin(a1 - 2 * a2)
      - 2 * Math.sin(delta) * m2 *
        (a2_v * a2_v * l2 + a1_v * a1_v * l1 * Math.cos(delta))
  ) / (l1 * den1);

  const a2_a = (
    2 * Math.sin(delta) *
      (a1_v * a1_v * l1 * (m1 + m2)
        + g * (m1 + m2) * Math.cos(a1)
        + a2_v * a2_v * l2 * m2 * Math.cos(delta))
  ) / (l2 * den2);

  return [a1_v, a2_v, a1_a, a2_a];
}

function rk4Step(state) {
  const k1 = derivatives(state);
  const k2 = derivatives(state.map((s, i) => s + 0.5 * dt * k1[i]));
  const k3 = derivatives(state.map((s, i) => s + 0.5 * dt * k2[i]));
  const k4 = derivatives(state.map((s, i) => s + dt * k3[i]));

  return state.map((s, i) =>
    s + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
  );
}

function update() {
  state = rk4Step(state);
  //state[2] *= 0.9995; // Damping
  //state[3] *= 0.9995;
}

function draw() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const [a1, a2] = state;

  const x1 = origin.x + l1 * Math.sin(a1);
  const y1 = origin.y + l1 * Math.cos(a1);

  const x2 = x1 + l2 * Math.sin(a2);
  const y2 = y1 + l2 * Math.cos(a2);

  trail.push({ x: x2, y: y2 });
  if (trail.length > maxTrailLength) trail.shift();

  // Draw the trail first
  for (let i = 1; i < trail.length; i++) {
    const p1 = trail[i - 1];
    const p2 = trail[i];

    const alpha = i / trail.length; // from 0 to 1
    ctx.strokeStyle = `rgba(${trailBase[0]}, ${trailBase[1]}, ${trailBase[2]}, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  ctx.strokeStyle = armColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.fillStyle = bob1Color;
  ctx.beginPath();
  ctx.arc(x1, y1, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = bob2Color;
  ctx.beginPath();
  ctx.arc(x2, y2, 8, 0, Math.PI * 2);
  ctx.fill();
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}

animate();
