const {
  MaterialAttributes,
  Attribute,
} = require("./engine.material.attributes");
const { MaterialUniforms, Uniform } = require("./engine.material.uniforms");
const { getGLContext } = require("./engine.utilities");
const gl = getGLContext();

class Material {
  /**
   * @param {WebGLProgram} shaderProgram
   */
  constructor(shaderProgram) {
    this.shaderProgram = shaderProgram;
    this.attributes = new MaterialAttributes();
    this.uniforms = new MaterialUniforms();
    this.vertexArrayObject = undefined;
  }

  createVertexArray() {
    if (!gl || !this.shaderProgram) {
      return;
    }
    this.vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArrayObject);
    const positionBuffer = gl.createBuffer();
    const normalsBuffer = gl.createBuffer();
    const mapBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    this.attributes.setLocations(this.shaderProgram);

    bufferData(positionBuffer, this.attributes.position);
    bufferData(normalsBuffer, this.attributes.normal);
    // bufferData(mapBuffer, this.attributes.map);
    bufferData(colorBuffer, this.attributes.color);
  }

  uploadUniforms() {
    if (!gl || !this.shaderProgram) {
      return;
    }

    this.uniforms.setLocations(this.shaderProgram);

    gl.useProgram(this.shaderProgram);
    uniformMatrix4fv(this.uniforms.modelViewMatrix);
    uniformMatrix4fv(this.uniforms.projectionMatrix);
    uniformMatrix4fv(this.uniforms.normalMatrix);
    uniform3fv(this.uniforms.directLightDirection);
    uniform3fv(this.uniforms.directLightColor);
    uniform1fv(this.uniforms.directLightValue);
    uniform3fv(this.uniforms.ambientLightColor);
    uniform1fv(this.uniforms.ambientLightValue);
  }

  bindVertexArray() {
    if (!gl || !this.vertexArrayObject) {
      return;
    }
    gl.bindVertexArray(this.vertexArrayObject);
  }
}

/**
 * @param {Uniform} uniform
 */
const uniformMatrix4fv = (uniform) => {
  gl.uniformMatrix4fv(uniform.location, false, uniform.value);
};

/**
 * @param {Uniform} uniform
 */
const uniform3fv = (uniform) => {
  gl.uniform3fv(uniform.location, uniform.value);
};

/**
 * @param {Uniform} uniform
 */
const uniform1fv = (uniform) => {
  gl.uniform1fv(uniform.location, uniform.value);
};

/**
 * @param {WebGLBuffer} buffer
 * @param {Attribute} attribute
 */
const bufferData = (buffer, attribute) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, attribute.value, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribute.location, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribute.location);
};

exports.Material = Material;
