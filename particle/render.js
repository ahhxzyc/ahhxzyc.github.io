var canvas = document.getElementById('canvas'),
    gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl"),
    w = canvas.width,
    h = canvas.height,
    num = 1;
initWebGL();
//自适应宽高
window.addEventListener('resize', function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});
function initWebGL() {
    var vs_source = `
    attribute vec4 a_Position;
        void main(){
            gl_Position = a_Position;
            gl_PointSize = 3.0;
        }
    `,
        //绘制圆
        fs_source = `
    #ifdef GL_ES
    precision mediump float;
    #endif 
    uniform vec4 color;
    void main(){
        float d = distance(gl_PointCoord,vec2(0.5,0.5));
        if(d<0.5){
            gl_FragColor = vec4(0.2,0.3,0.5,1.0);
        }else{
            discard;
        }
    }
    `,
        sShader = gl.createShader(gl.VERTEX_SHADER),
        fShader = gl.createShader(gl.FRAGMENT_SHADER),
        glprogram = gl.createProgram();
    gl.shaderSource(sShader, vs_source);
    gl.shaderSource(fShader, fs_source);
    gl.compileShader(sShader);
    gl.compileShader(fShader);
    gl.attachShader(glprogram, sShader);
    gl.attachShader(glprogram, fShader);
    gl.linkProgram(glprogram);
    gl.useProgram(glprogram);
    gl.program = glprogram;
    render();
}
function render() {
    //requestAnimationFrame為16.7s重新刷新畫布内容
    requestAnimationFrame(render);
    num = num - 1;//+1為反轉，-1為正轉
    var pointdata = creatPointData(num);
    setPointType(pointdata.data, pointdata.nums);
}
function creatPointData(nums) {
    var max = 10,
        number = 100,
        tier = 10,
        arr = [],
        degs = function (deg) {
            return Math.PI * deg / 180;
        };
    for (var i = 0; i < number; i++) {
        for (var j = 0; j < tier; j++) {
            var gap = (i * 7 - j * 20 + nums),
                x = webX(-(w / 2) - 280 + i * ((w + 300) / number) + j * 20),
                y = webY(-(h / 2) + Math.sin(degs(gap)) * (max + j * 10) + j * 20),
                z = -1,
                arrtwo = [x, y, z];
            arr = arr.concat(arrtwo);
        }
    }
    return {
        data: new Float32Array(arr),
        nums: number * tier
    }
}
function setPointType(data, num) {
    //1.创建缓冲区对象
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('緩衝區創建失敗');
        return -1;
    }
    // 2.绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 3.向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // 4.获取存储位置变量
    var aPosition = gl.getAttribLocation(gl.program, 'a_Position');
    // 5.把缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    // 连接缓冲区对象和a_Position 变量
    gl.enableVertexAttribArray(aPosition);
    //用設置的顔色清空畫布
    gl.clearColor(0.6, 0.7, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //繪製畫布内容
    gl.drawArrays(gl.POINTS, 0, num);
}
//X軸
function webX(n) {
    return n / (w / 2)
}
//Y軸
function webY(n) {
    return n / (h / 2)
}