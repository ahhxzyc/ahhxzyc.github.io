let fluid;

function setup() {
  createCanvas(N * SCALE, N * SCALE);
  frameRate(22);
  fluid = new Fluid(0.5, 0, 0.0000001);
  for (let i = 1; i < N - 1; i++) {
    for (let j = 1; j < N - 1; j++) {
      let x = i - N / 2;
      let y = j - N / 2;
      // create a rotating vector field
      let s = 0.0003;
      fluid.addVelocity(i, j, s * (-y), s * x);
    }
  }
}


function draw() {
  stroke(51);
  strokeWeight(2);

  let cx = int((0.5 * width) / SCALE);
  let cy = int((0.5 * height) / SCALE);
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      fluid.addDensity(cx + i, cy + j, random(50, 150));
    }
  }

  for (let i = 0; i < 2; i++) {
    let angle = noise(t) * TWO_PI * 2;
    let v = p5.Vector.fromAngle(angle);
    v.mult(0.2);
    t += 0.01;
    fluid.addVelocity(cx, cy, v.x, v.y);
  }

  fluid.step();
  fluid.renderD();
  fluid.renderV();

}
