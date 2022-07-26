
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

    // register mouse pos
    onmousemove = function(event) {
        var rect = canvas.getBoundingClientRect();
        phys.mousex = (event.clientX - rect.left) / w * 2 - 1;
        phys.mousey = 1 - (event.clientY - rect.top) / h * 2;
    };

    // data in cpu
    phys.createData();
    phys.createConstraints();
    // buffer on gpu
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('failed to create buffer');
    }

    // create program
    var program = webglUtils.createProgramFromScripts(
        gl, ['vs-source', 'fs-source']);

    loop();

    function loop() {
        // update point position
        phys.update();

        // apply program
        gl.useProgram(program);

        // provide MVP matrix
        var t = Date.now() / 1000;
        var trans = mat4.rotation_z(0);
        var transloc = gl.getUniformLocation(program, "m_trans");
        gl.uniformMatrix4fv(transloc, false, trans);
        
        // update gl buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, phys.getData(), gl.STATIC_DRAW);
        var aPosition = gl.getAttribLocation(program, 'a_Position');
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        // tell gl to get the attribute from buffer
        gl.enableVertexAttribArray(aPosition);
        // draw
        gl.clearColor(0.6, 0.7, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, phys.datasize);
        // schedule another call of the method
        requestAnimationFrame(loop);
    }
}


main();
