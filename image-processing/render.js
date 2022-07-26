
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

    var positions = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ];
    var texcoords = [
        0, 1,
        1, 1,
        1, 0,
        0, 0
    ];
    var indices = [
        0, 1, 3,    1, 2, 3,
    ];

    // create program
    var program = webglUtils.createProgramFromScripts(
        gl, ['vs-source', 'fs-source']);

    
    
    // create position, texcoords, and index buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var texcoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    // bind pos buffer to VAO
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var posloc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posloc);
    gl.vertexAttribPointer(posloc, 2, gl.FLOAT, false, 0, 0);
    // bind tex buffer to VAO
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordsBuffer);    
    var texloc = gl.getAttribLocation(program, 'a_texcoords');
    gl.enableVertexAttribArray(texloc);
    gl.vertexAttribPointer(texloc, 2, gl.FLOAT, false, 0, 0);
    // bind index buffer to VAO
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    
    // create texture
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // load image, and provide it to texture
    var image = new Image();
    var imgw = 0, imgh = 0;
    image.onload = function() {
        imgw = image.width;
        imgh = image.height;
        // convolution kernel
        var edge_detect_kernel = [
            -1, -1, -1,
            -1, 8, -1,
            -1, -1, -1,
        ];
        gl.useProgram(program);
        gl.uniform1fv(gl.getUniformLocation(program, 'u_kernel'), new Float32Array(edge_detect_kernel));
        // image size
        gl.uniform2f(gl.getUniformLocation(program, 'u_imagesize'), imgw, imgh);
        console.log('setting u_imagesize to (' + imgw + ',' + imgh + ')');
        // fill texture buffer
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.useProgram(program);
        gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);
        // start the loop
        requestAnimationFrame(loop);
    };
    image.src = 'leaf.PNG';


    

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
