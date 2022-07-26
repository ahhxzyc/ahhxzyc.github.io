
let N = 128;    // number of grid cells in one dimension
let SCALE = 5;  // length of a grid cell in pixels
let DT = 0.5;   // time step
let ITER = 16;   // number of Gauss-Seidel iterations

// 2D to 1D mapping
function ID(x, y) {
    return x + N * y;
}

class Fluid {
    constructor(diffusion, viscosity) {
        // basic characteristics of the fluid
        this.dif = diffusion;   // diffusion coefficient of density
        this.vis = viscosity;   // diffusion coefficient of velocity
        // velocity buffers and backup buffers
        this.vx = new Array(N * N).fill(0);
        this.vy = new Array(N * N).fill(0);
        this.vxb = new Array(N * N).fill(0);
        this.vyb = new Array(N * N).fill(0);
        // density buffers
        this.d = new Array(N * N).fill(0);
        this.db = new Array(N * N).fill(0);
    }

    // Add certain amount of dye to a position 
    // x, y - position
    // amount - amount of density
    addDensity(x, y, amount) {
        this.d[ID(x, y)] += amount;
    }

    // Add certain amount of velocity to a position 
    // x, y - position
    // ax,ay - amount of velocity
    addVelocity(x, y, ax, ay) {
        this.vx[ID(x, y)] += ax;
        this.vy[ID(x, y)] += ay;
    }

    // Gauss-Seidel solving diffusion part of the PDE
    // x - some array
    // xb - some backup array
    // dif - diffusion coefficient
    diffuse(x, xb, dif) {
        let a = DT * dif * N * N;
        for (let it = 0; it < ITER; it++) {
            for (let i = 1; i < N - 1; i++) {
                for (let j = 1; j < N - 1; j++) {
                    x[ID(i, j)] = (xb[ID(i, j)] + a * (x[ID(i - 1, j)] + xb[ID(i + 1, j)] + xb[ID(i, j - 1)] + xb[ID(i, j + 1)])) / (1 + 4 * a);
                }
            }
        }
    }

    // Move density along velocity field
    // a - the vector field of concern
    // ab - backup buffer of a
    // vx, vy - velocity field for advection
    advect(a, ab, vx, vy) {
        for (let i = 1; i < N - 1; i++) {
            for (let j = 1; j < N - 1; j++) {
                // velocity times N because we are interpolating with spacing 1 instead of 1/N
                let x = i - DT * N * vx[ID(i, j)];
                let y = j - DT * N * vy[ID(i, j)];
                // boundary check
                x = Math.max(x, 0.5);
                x = Math.min(x, N - 1.5);
                y = Math.max(y, 0.5);
                y = Math.min(y, N - 1.5);
                // interpolation
                let i0 = Math.floor(x), i1 = i0 + 1;
                let j0 = Math.floor(y), j1 = j0 + 1;
                let s0 = i1 - x, s1 = x - i0;
                let t0 = j1 - y, t1 = y - j0;
                a[ID(i, j)] =
                    s0 * (t0 * ab[ID(i0, j0)] + t1 * ab[ID(i0, j1)]) +
                    s1 * (t0 * ab[ID(i1, j0)] + t1 * ab[ID(i1, j1)]);
            }
        }
    }

    // Applying continuity equation, making velocity field a solenoidal vector field.
    // This is done by removing the irrotational part from the field.
    // vx,vy - velocity field
    // f - height field of the irrotational field, that is, v_irr=grad(f).
    // div - divergence of velocity
    project(vx, vy, f, div) {
        // grid spacing
        let d = 1 / N;
        // find divergence
        for (let i = 1; i < N - 1; i++) {
            for (let j = 1; j < N - 1; j++) {
                div[ID(i, j)] = (vx[ID(i + 1, j)] - vx[ID(i - 1, j)] + vy[ID(i, j + 1)] - vy[ID(i, j - 1)]) / (2 * d);
                f[ID(i, j)] = 0;
            }
        }
        // solve Poisson's equation for f
        for (let k = 0; k < ITER; k++) {
            for (let i = 1; i < N - 1; i++) {
                for (let j = 1; j < N - 1; j++) {
                    f[ID(i, j)] = (f[ID(i - 1, j)] + f[ID(i + 1, j)] + f[ID(i, j - 1)] + f[ID(i, j + 1)] - div[ID(i, j)] * d * d) / 4;
                }
            }
        }
        // remove irrotational part from velocity field
        for (let i = 1; i < N - 1; i++) {
            for (let j = 1; j < N - 1; j++) {
                vx[ID(i, j)] -= (f[ID(i + 1, j)] - f[ID(i - 1, j)]) / (2 * d);
                vy[ID(i, j)] -= (f[ID(i, j + 1)] - f[ID(i, j - 1)]) / (2 * d);
            }
        }
    }

    // Update velocity and density
    update() {
        let d = this.d;
        let db = this.db;
        let vx = this.vx;
        let vy = this.vy;
        let vxb = this.vxb;
        let vyb = this.vyb;
        let dif = this.dif;
        let vis = this.vis;
        // update velocity
        this.diffuse(vxb, vx, vis);
        this.diffuse(vyb, vy, vis);
        this.project(vxb, vyb, vx, vy);
        this.advect(vx, vxb, vxb, vyb);
        this.advect(vy, vyb, vxb, vyb);
        this.project(vx, vy, vxb, vyb);
        // update density
        this.diffuse(db, d, dif);
        this.advect(d, db, vx, vy);
    }

    // Display density
    render() {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                let x = i * SCALE;
                let y = j * SCALE;
                let d = this.d[ID(i, j)];
                noStroke();
                fill(d);
                rect(x, y, SCALE, SCALE);
            }
        }
    }

    // Display velocity field
    renderV() {
        strokeWeight(1);
        stroke(255, 0, 0);
        for (let i = 0; i < N; i += 2) {
            for (let j = 0; j < N; j += 2) {
                let x = i * SCALE;
                let y = j * SCALE;
                let vx = this.vx[ID(i, j)];
                let vy = this.vy[ID(i, j)];
                // log scale
                let m = Math.sqrt(vx*vx + vy*vy);
                let s = 500;
                if (m > 1) {
                    s *= Math.log10(m) / m;
                }
                line(x, y, x + vx * s, y + vy * s);
            }
        }
    }
}
