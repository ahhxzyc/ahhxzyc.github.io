
function main() {
    // init webgl
    var canvas = document.getElementById('canvas'),
        gl = canvas.getContext('webgl'),
        w = canvas.width,
        h = canvas.height;

    // adaptive width and height
    function reset_canvas_size() {
        var sz = Math.min(window.innerHeight, window.innerWidth);
        w = canvas.width = sz;
        h = canvas.height = sz;
        gl.viewport(0, 0, sz, sz);
    }
    reset_canvas_size();
    window.addEventListener('resize', reset_canvas_size);

    // create program
    var program = webglUtils.createProgramFromScripts(
        gl, ['vs-source', 'fs-source']);
        
    createCube();
    function createCube() {
        // // vertex positions
        // var positions = [];
        // for (let z = -1; z <= 1; z += 2) {
        //     positions = positions.concat([-1, -1, z]);
        //     positions = positions.concat([1, -1, z]);
        //     positions = positions.concat([1, 1, z]);
        //     positions = positions.concat([-1, 1, z]);
        // }
        // positions = new Float32Array(positions);
        // console.log(positions);
        // // vertex normals
        // var normals = [];
        // for (x of positions) {
        //     normals.push(x);
        // }
        // normals = new Float32Array(normals);
        // console.log(normals);
        // // index buffer
        // var indices = [
        //     3, 2, 1,    3, 1, 0,    6, 1, 2,    6, 5, 1,
        //     6, 2, 3,    7, 6, 3,    7, 3, 6,    7, 6, 4,
        //     0, 1, 5,    0, 5, 4,    7, 5, 6,    7, 4, 5,
        // ];
        // indices = new Uint16Array(indices);
        // console.log(indices);

        var positions = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0,
            -0.5, 0.5, 0,
        ];
        var normals = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0,
            -0.5, 0.5, 0,
        ];
        var indices = [
            0, 1, 3,    1, 2, 3,
        ];

        // create position, normal and index buffer
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        // bind pos buffer to VAO
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var posloc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posloc);
        gl.vertexAttribPointer(posloc, 3, gl.FLOAT, false, 0, 0);
        // bind pos buffer to VAO
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        var normloc = gl.getAttribLocation(program, 'a_normal');
        gl.enableVertexAttribArray(normloc);
        gl.vertexAttribPointer(normloc, 3, gl.FLOAT, false, 0, 0);
        // bind index buffer to VAO
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    }
    
    requestAnimationFrame(loop);

    function loop() {
        // apply program
        gl.useProgram(program);
        // draw
        gl.clearColor(0.6, 0.7, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        // schedule another call of the method
        requestAnimationFrame(loop);
    }
}


main();
