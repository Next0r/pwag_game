const { EngineToolbox } = require("./engine.toolbox");

/**
 * Creates and compiles new WebGL2 shader that can be then used to create
 * shader program, this is helper function used by shader program creator
 * @param {number} type WebGL2 type of shader e.g. gl.VERTEX
 * @param {string} source shaders source code
 * @returns {WebGLShader} WebGL2 shader object
 */
const _createShader = (type, source) => {
  const gl = EngineToolbox.getGLContext();

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

/**
 * Creates new WebGL2 shader program, that contains vertex and fragment shader defined in
 * sources given
 * @param {string} vsSource source code of vertex shader
 * @param {string} fsSource source code of fragment shader
 * @returns {WebGLProgram} WebGL2 shader program object
 */
const createShaderProgram = (vsSource, fsSource) => {
  const gl = EngineToolbox.getGLContext();

  const vertexShader = _createShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = _createShader(gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(
      `An error occurred linking shader program: ${gl.getProgramInfoLog(
        program
      )}.`
    );
    gl.deleteProgram();
    return;
  }

  return program;
};

exports.createShaderProgram = createShaderProgram;
