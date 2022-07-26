class Constraint {
    constructor() {
        // empty
    }
    project(p) {
        // empty
    }
    udpate(interactions) {
        // empty
    }
}

class DistanceConstraint extends Constraint {
    // distance constraint between two particles
    // i, j:    index of the particle
    // d :      desired distance
    constructor(i, j, d) {
        super();
        this.i = i;
        this.j = j;
        this.d = d;
    }
    project(data) {
        var i = this.i;
        var j = this.j;
        var p = data.p;
        var invm = data.invm;
        var v = p[i].sub(p[j]);
        var vn = v.norm();
        var d1 = v.normalized().mul(-invm[i] / (invm[i] + invm[j]) * (vn - this.d));
        var d2 = v.normalized().mul(invm[j] / (invm[i] + invm[j]) * (vn - this.d));
        p[i] = p[i].add(d1);
        p[j] = p[j].add(d2);
    }
    update(interactions) {
        // empty
    }
}

class PointConstraint extends Constraint {
    // constrain a point to a certain position
    // i: index of the point
    // v: position
    constructor(i, v) {
        super();
        this.i = i;
        this.v = v;
    }
    project(data) {
        var i = this.i;
        var v = this.v;
        var p = data.p;
        var invm = data.invm;
        var dp = v.sub(p[i]).div(invm[i]);
        p[i] = p[i].add(dp);
    }
    update(interactions) {
        this.v = new vec3(interactions.mousex, interactions.mousey, 0);
    }
}