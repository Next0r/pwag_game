const {
  MaterialAttributes,
  Attribute,
} = require("./engine.material.attributes");
const { MaterialTextures } = require("./engine.material.textures");
const { MaterialUniforms, Uniform } = require("./engine.material.uniforms");
const { EngineToolbox } = require("./engine.toolbox");
const { Mesh } = require("./engine.utilities.mesh");

class Material {
  /**
   * @param {WebGLProgram} shaderProgram
   * @param {Mesh} mesh
   */
  constructor(shaderProgram) {
    this.shaderProgram = shaderProgram;
    this.attributes = new MaterialAttributes();
    this.uniforms = new MaterialUniforms();
    this.textures = new MaterialTextures();
  }

  /**
   * Activates texture units and binds textures to them. Call this method
   * after changing material textures to apply any changes.
   */
  uploadTextures() {
    const gl = EngineToolbox.getGLContext();
    if (this.textures.color0.textureObject) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.color0.textureObject);
    }
    if (this.textures.color1.textureObject) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.color1.textureObject);
    }
    if (this.textures.normal0.textureObject) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.normal0.textureObject);
    }
  }

  /**
   * Creates element array buffer, vertex array object and related
   * shader program attribute buffers. Data for all buffers is
   * acquired directly from corresponding mesh field.
   * @param {Mesh} mesh
   */
  linkVertexArrays(mesh) {
    const gl = EngineToolbox.getGLContext();
    if (!this.shaderProgram || !mesh) {
      return;
    }

    if (!mesh.vertexArrayObject) {
      mesh.createBuffers();
    }
    gl.bindVertexArray(mesh.vertexArrayObject);
    this.attributes.setLocations(this.shaderProgram);

    let loc = this.attributes.position.location;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionsVBO);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(loc);

    loc = this.attributes.normal.location;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalsVBO);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(loc);

    loc = this.attributes.map.location;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.mapVBO);
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(loc);

    loc = this.attributes.color.location;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorVBO);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(loc);

    const e = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint32Array(mesh.elementArray),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.elementArrayVBO);
  }

  /**
   * Call this method if material should be used
   * for this draw call and none of material uniforms has
   * changed.
   */
  useProgram() {
    const gl = EngineToolbox.getGLContext();
    if (!this.shaderProgram) {
      return;
    }
    gl.useProgram(this.shaderProgram);
  }

  /**
   * Passes all uniform values to shader program.
   */
  uploadUniforms() {
    const gl = EngineToolbox.getGLContext();
    if (!this.shaderProgram) {
      return;
    }

    this.uniforms.setLocations(this.shaderProgram);

    // pass uniforms to shader only if defined
    gl.useProgram(this.shaderProgram);
    this.uniforms.modelViewMatrix.value &&
      uniformMatrix4fv(this.uniforms.modelViewMatrix);
    this.uniforms.projectionMatrix.value &&
      uniformMatrix4fv(this.uniforms.projectionMatrix);
    this.uniforms.normalMatrix.value &&
      uniformMatrix4fv(this.uniforms.normalMatrix);
    this.uniforms.directLightDirection.value &&
      uniform3fv(this.uniforms.directLightDirection);
    this.uniforms.directLightColor.value &&
      uniform3fv(this.uniforms.directLightColor);
    this.uniforms.directLightValue.value &&
      uniform1fv(this.uniforms.directLightValue);
    this.uniforms.ambientLightColor.value &&
      uniform3fv(this.uniforms.ambientLightColor);
    this.uniforms.ambientLightValue.value &&
      uniform1fv(this.uniforms.ambientLightValue);
    this.uniforms.useVertexColor.value &&
      uniform1iv(this.uniforms.useVertexColor);
    this.uniforms.color0Sampler.value &&
      uniform1iv(this.uniforms.color0Sampler);
    this.uniforms.color1Sampler.value &&
      uniform1iv(this.uniforms.color1Sampler);
    this.uniforms.normal0Sampler.value &&
      uniform1iv(this.uniforms.normal0Sampler);
    this.uniforms.useColor0.value && uniform1iv(this.uniforms.useColor0);
    this.uniforms.useColor1.value && uniform1iv(this.uniforms.useColor1);
    this.uniforms.useNormal0.value && uniform1iv(this.uniforms.useNormal0);
    this.uniforms.useEmission.value && uniform1iv(this.uniforms.useEmission);
    this.uniforms.mapOffsetX.value && uniform1fv(this.uniforms.mapOffsetX);
    this.uniforms.mapOffsetY.value && uniform1fv(this.uniforms.mapOffsetY);
  }

  /**
   * Binds element array buffer and vertex array object that contains
   * shader program attribute buffers.
   */
  bindVertexArray() {
    const gl = EngineToolbox.getGLContext();
    if (!this.vertexArrayObject) {
      return;
    }
    gl.bindVertexArray(this.vertexArrayObject);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementArray.vbo);
  }
}

exports.Material = Material;

/**
 * @param {Uniform} uniform
 */
const uniformMatrix4fv = (uniform) => {
  const gl = EngineToolbox.getGLContext();
  gl.uniformMatrix4fv(uniform.location, false, uniform.value);
};

/**
 * @param {Uniform} uniform
 */
const uniform3fv = (uniform) => {
  const gl = EngineToolbox.getGLContext();
  gl.uniform3fv(uniform.location, uniform.value);
};

/**
 * @param {Uniform} uniform
 */
const uniform1fv = (uniform) => {
  const gl = EngineToolbox.getGLContext();
  gl.uniform1fv(uniform.location, uniform.value);
};

/**
 * @param {Uniform} uniform
 */
const uniform1iv = (uniform) => {
  const gl = EngineToolbox.getGLContext();
  gl.uniform1iv(uniform.location, uniform.value);
};