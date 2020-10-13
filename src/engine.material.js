const {
  MaterialAttributes,
  Attribute,
} = require("./engine.material.attributes");
const { MaterialTextures } = require("./engine.material.textures");
const { MaterialUniforms, Uniform } = require("./engine.material.uniforms");
const { getGLContext } = require("./engine.utilities");
const { Mesh } = require("./engine.utilities.mesh");

const gl = getGLContext();

class Material {
  /**
   * @param {WebGLProgram} shaderProgram
   * @param {Mesh} mesh
   */
  constructor(shaderProgram, mesh) {
    this.mesh = mesh;
    this.shaderProgram = shaderProgram;
    this.attributes = new MaterialAttributes();
    this.uniforms = new MaterialUniforms();
    this.textures = new MaterialTextures();
    this.vertexArrayObject = undefined;
  }

  uploadTextures() {
    if (!gl) {
      return;
    }
    if (this.textures.color0.textureObject) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.color0.textureObject);
    }
    if (this.textures.color1.textureObject) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.color1.textureObject);
    }
  }

  createVertexArray() {
    if (!gl || !this.shaderProgram || !this.mesh) {
      return;
    }
    this.vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArrayObject);
    const positionBuffer = gl.createBuffer();
    const normalsBuffer = gl.createBuffer();
    const mapBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    this.attributes.position.vbo = positionBuffer;
    this.attributes.normal.vbo = positionBuffer;
    this.attributes.map.vbo = mapBuffer;
    this.attributes.color.vbo = colorBuffer;

    this.attributes.setLocations(this.shaderProgram);
    this.attributes.setValues(this.mesh);

    bufferData(positionBuffer, this.attributes.position);
    bufferData(normalsBuffer, this.attributes.normal);
    bufferData(mapBuffer, this.attributes.map, 3);
    bufferData(colorBuffer, this.attributes.color);
  }

  /**
   * Call this method if material should be used
   * for this draw call and none of material uniforms has
   * changed.
   */
  useProgram() {
    if (!gl || !this.shaderProgram) {
      return;
    }
    gl.useProgram(this.shaderProgram);
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
    uniform1iv(this.uniforms.color0Sampler);
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
 * @param {Uniform} uniform
 */
const uniform1iv = (uniform) => {
  gl.uniform1iv(uniform.location, uniform.value);
};

/**
 * @param {WebGLBuffer} buffer
 * @param {Attribute} attribute
 */
const bufferData = (buffer, attribute, size = 4) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, attribute.value, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribute.location, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribute.location);
};

exports.Material = Material;
