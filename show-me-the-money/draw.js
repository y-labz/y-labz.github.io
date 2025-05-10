let canvas;
let time = 0;
let path = [];
let epicycles = [];

function setup() {
  let winW = Math.min(windowWidth, windowHeight);
  let canW = Math.round(winW * 0.9);
  canvas = createCanvas(canW, canW);
  canvas.style('border', '2px solid grey');
  //canvas.position((windowWidth - width) / 2, 0)
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2)
  background(36, 40, 59); //rgb(36, 40, 59)

  // Take the first 30 and shuffle them
  //epicycles = shuffle(pfft.slice(0, 30));
  epicycles = shuffle(pfft);
}

function draw() {
  //noLoop(); // only draw once
  background(36, 40, 59);

  translate(width / 2, height / 2 - 20); //move origin
  scale(1, -1); //y goes up
  scale(width / 1000, height / 1000);

  // background shape
  //noStroke();
  //fill(255,255,255,80); //rgb(192, 202, 245)
  //fill(100);
  //stroke(86, 110, 166);
  stroke(255,255,255,80);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let pt of points) {
    //ellipse(pt.x, pt.y, 10, 10); // small dot
    vertex(pt.x, pt.y);
  }
  endShape();

  let x = 0;
  let y = 0;

  for (let term of epicycles) {
    let prevX = x;
    let prevY = y;

    let freq = term.f;
    let radius = term.A;
    let phase = term.p;

    let angle = TWO_PI * freq * time + phase;

    x += radius * cos(angle);
    y += radius * sin(angle);

    // circles
    stroke(100);
    strokeWeight(2) //1 is default
    noFill();
    ellipse(prevX, prevY, radius * 2);

    // arrow lines, white
    stroke(255);
    strokeWeight(2) //1 is default
    //noFill();
    line(prevX, prevY, x, y);
  }

  path.unshift(createVector(x, y));
  if (path.length > 600) path.pop();

  // draw path shape
  //stroke(255, 0, 0); //red
  stroke(255, 158, 100); //orange
  //noFill();
  strokeWeight(4)
  beginShape();
  for (let v of path) {
    vertex(v.x, v.y);
  }
  endShape();

  time += 1 / 500;
}

