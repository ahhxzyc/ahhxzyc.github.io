let fluid;
let pressed = false;
let t = 0;
let canvas;

function setup() {
    canvas = createCanvas(N * SCALE, N * SCALE);
    canvas.parent("the_div");
    frameRate(22);
    fluid = new Fluid(0.001, 0);
}

function mousePressed() {
    pressed = true;
}
function mouseReleased() {
    pressed = false;
}


function draw() {
    // release dye from mouse
    if (pressed) {
        let x = Math.floor(mouseX / SCALE);
        let y = Math.floor(mouseY / SCALE);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                fluid.addDensity(x, y, 75);
            }
        }
        fluid.addVelocity(x, y, 0, -0.2);
    }

    fluid.update();
    fluid.render();

    let box = document.getElementById('checkbox_vdisp');
    if (box.checked) {
        fluid.renderV();
    }
}