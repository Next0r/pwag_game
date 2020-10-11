const { create } = require("domain");
const { getGLContext } = require("./engine.utilities");
const gl = getGLContext();

const createShader = (type, source) => {
  if (!gl) {
    return;
  }

  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}.`
    );
    gl.deleteShader(shader);
    return;
  }

  return shader;
};

const createShaderProgram = (vsSource, fsSource) => {
  if (!gl) {
    return;
  }

  const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(
      `An error occurred linkin shader program: ${gl.getProgramInfoLog(
        program
      )}.`
    );
    gl.deleteProgram();
    return;
  }

  return program;
};

exports.createShaderProgram = createShaderProgram;
