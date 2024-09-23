const canvas = document.getElementById('glCanvas');
let gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

// Set the initial background color to pitch black
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    void main(void) {
        gl_Position = aVertexPosition;
    }
`;

const fragmentShaderSource = `
    void main(void) {
        gl_FragColor = vec4(0.475, 0.808, 0.878, 1.0); // #79CEE0 color
    }
`;

const fragmentShaderSourceGreen = `
    void main(void) {
        gl_FragColor = vec4(0.475, 0.808, 0.878, 1.0); // #79CEE0 color
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const fragmentShaderGreen = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceGreen);

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

const shaderProgram = createProgram(gl, vertexShader, fragmentShader);
const shaderProgramGreen = createProgram(gl, vertexShader, fragmentShaderGreen);

const verticesLines = new Float32Array([
    // M
    -0.8,  0.5,  -0.8, -0.5,
    -0.8,  0.5,  -0.7,  0.0,
    -0.7,  0.0,  -0.6,  0.5,
    -0.6,  0.5,  -0.6, -0.5,
    // I
    -0.4,  0.5,  -0.4, -0.5,
    // R
    -0.2,  0.5,  -0.2, -0.5,
    -0.2,  0.5,   0.0,  0.5,
     0.0,  0.5,   0.0,  0.0,
     0.0,  0.0,  -0.2,  0.0,
     0.0,  0.0,   0.1, -0.5,
]);

const verticesTriangles = new Float32Array([
    // M
    -0.8,  0.5,  -0.8, -0.5,  -0.7,  0.0,
    -0.7,  0.0,  -0.6,  0.5,  -0.6, -0.5,
    // I
    -0.4,  0.5,  -0.4, -0.5,  -0.4,  0.5,
    // R
    -0.2,  0.5,  -0.2, -0.5,   0.0,  0.5,
     0.0,  0.5,   0.0,  0.0,  -0.2,  0.0,
     0.0,  0.0,   0.1, -0.5,  -0.2, -0.5,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

const position = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(position);

let useLines = true;

function draw() {
    if (useLines) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shaderProgram);
        gl.bufferData(gl.ARRAY_BUFFER, verticesLines, gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, verticesLines.length / 2);
    } else {
        gl.clearColor(1.0, 0.0, 1.0, 1.0); // Fuchsia background
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shaderProgramGreen);
        gl.bufferData(gl.ARRAY_BUFFER, verticesTriangles, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, verticesTriangles.length / 2);
    }
    useLines = !useLines;
}

setInterval(draw, 3000);
