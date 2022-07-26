
class vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(v) {
        return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(n) {
        return new vec3(this.x * n, this.y * n, this.z * n);
    }
    div(n) {
        return new vec3(this.x / n, this.y / n, this.z / n);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    norm() {
        return Math.sqrt(this.dot(this));
    }
    normalized() {
        var n = this.norm();
        return new vec3(this.x / n, this.y / n, this.z / n);
    }
}

// note these matrices are all generated in column order
var mat4 = {
    translation: function(x, y, z) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ];
    },

    scaling: function(x, y, z) {
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ];
    },

    // angle should be in radians
    rotation_z: function(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    } 
};

