"use strict";

var gl;
var program;
var vertexBuffer;
var positionAttribId;
var expr = "Math.sin(10.0*x*x)";

function main() {
    var c = document.getElementById("canvas");
    var canvasWidth = 800;
    var canvasHeight = 600;
    c.width = canvasWidth;
    c.height = canvasHeight;
    gl = c.getContext("webgl");
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    var vertexSource =
        "attribute vec2 position;" +
        "void main() {\n" +
        "    gl_Position = vec4(position, 0.0, 1.0);\n" +
        "}";
    var fragmentSource =
        "void main() {\n" +
        "    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n" +
        "}";

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexSource);
    gl.shaderSource(fragmentShader, fragmentSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        window.alert("Program failed to link:" + gl.getProgramInfoLog(program));
    }
    
    vertexBuffer = gl.createBuffer();
    positionAttribId = gl.getAttribLocation(program, "position");
    draw_plot();
}

function draw_plot() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    var vertices = [];
    var x;
    expr = document.getElementById("expr").value;
    var f = function(x) { return eval(expr); };
    var step = 0.01;
    for (x = -1.0; x < 1.0; x += step) {
        var xPrev = x - step;
        var yPrev = f(xPrev);

        var y = f(x);
        vertices.push(xPrev, yPrev);
        vertices.push(x, y);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionAttribId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribId);
    gl.lineWidth(50.0);
    gl.drawArrays(gl.LINES, 0, vertices.length/2);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

window.onload = main;
