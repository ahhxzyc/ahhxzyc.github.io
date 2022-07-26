


var phys = {
    update() {
        var pos = this.data.pos;
        var p = this.data.p;
        var vel = this.data.vel;
        // gravity
        var g = new vec3(0, -9.8, 0);
        // proposed velocity and position
        var dt = 1 / 60;    // 60 frames per second
        for (i in p) {
            vel[i] = vel[i].add(g.mul(dt));
            p[i] = p[i].add(vel[i].mul(dt));
        }
        // update constraint
        for (i in this.constraints) {
            console.log(this.constraints[i]);
            this.constraints[i].update({
                mousex: this.mousex,
                mousey: this.mousey,
            });
        }
        // constraint projection
        for (let k = 0; k < 20; k ++ ) {
            for (c of this.constraints) {
                c.project(this.data);
            }
        }
        for (i in p) {
            vel[i] = p[i].sub(pos[i]).div(dt);
            pos[i] = p[i];
        }
    },

    createData: function() {
        var base = new vec3(0,0,0);
        var len = 0.5;
        var num = 50;   // num of segments
        if (num < 1) {
            console.log('failed to generate rope points: num = 0');
            return;
        }
        var step = new vec3(len / num, 0, 0);
        var arr = [base];
        for (i = 0; i < num; i ++ ) {
            base = base.add(step);
            arr = arr.concat(base);
        }
        var arrcopy = [];
        for (v of arr) {
            arrcopy.push(v);
        }
        var vel = new Array(num + 1);
        for (i = 0; i < vel.length; i ++ ) {
            vel[i] = new vec3(0,0,0);
        }
        var invm = new Array(num + 1);
        for (i = 0; i < invm.length; i ++ ){
            invm[i] = 1;
        }
        this.data = {
            pos:    arr,
            p:      arrcopy, // expected positions
            vel:    vel,
            invm:   invm
        };
        this.datasize = num + 1;
    },

    createConstraints: function () {
        this.constraints = [];
        for (i = 1; i < this.datasize; i ++ ) {
            this.constraints.push(new DistanceConstraint(i - 1, i, this.data.pos[i].sub(this.data.pos[i - 1]).norm()));
        }
        this.constraints.push(new PointConstraint(0, new vec3(0,0,0)));
    },


    getData: function() {
        var gldata = [];
        for (v of this.data.pos) {
            gldata.push(v.x);
            gldata.push(v.y);
            gldata.push(v.z);
        }
        return new Float32Array(gldata);
    },

    data: null,
    datasize: null,
    constraints: null,

    mousex: 0,
    mousey: 0,
}