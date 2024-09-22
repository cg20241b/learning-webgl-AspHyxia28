const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

// Set the background color to pitch black
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
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Fuchsia color
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
gl.useProgram(shaderProgram);

const vertices = new Float32Array([
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

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const position = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(position);

gl.drawArrays(gl.LINES, 0, vertices.length / 2);

setTimeout(() => {
    gl.clearColor(1.0, 0.0, 1.0, 1.0); // Fuchsia background
    gl.clear(gl.COLOR_BUFFER_BIT);

    const triangleVertices = new Float32Array([
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

    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

    const fragmentShaderSourceGreen = `
        void main(void) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green color
        }
    `;
    const fragmentShaderGreen = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceGreen);
    const shaderProgramGreen = createProgram(gl, vertexShader, fragmentShaderGreen);
    gl.useProgram(shaderProgramGreen);

    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length / 2);
}, 3000);
