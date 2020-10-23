const { MaterialAttributes, Attribute, VBOContainer } = require("./engine.material.attributes");
const { MaterialTextures } = require("./engine.material.textures");
const { MaterialUniforms, Uniform } = require("./engine.material.uniforms");
const { EngineToolbox } = require("./engine.toolbox");
const { Mesh } = require("./engine.utilities.mesh");

const gl = EngineToolbox.getGLContext();

class Material {
  /**
   * @param {WebGLProgram} shaderProgram
   * @param {Mesh} mesh
   */
  constructor(shaderProgram) {
    this.shaderProgram = shaderProgram;
    this.attributes = new MaterialAttributes();
    this.uniforms = new MaterialUniforms();
    this.elementArray = new VBOContainer();
    this.textures = new MaterialTextures();
    this.vertexArrayObject = undefined;
  }

  /**
   * Activates texture units and binds textures to them. Call this method
   * after changing material textures to apply any changes.
   */
  uploadTextures() {
    if (!gl) {
      return;
    }
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
  createVertexArray(mesh) {
    if (!gl || !this.shaderProgram || !mesh) {
      return;
    }

    deleteVertexArray(this.vertexArrayObject);
    deleteBuffer(this.attributes.position.vbo);
    deleteBuffer(this.attributes.normal.vbo);
    deleteBuffer(this.attributes.map.vbo);
    deleteBuffer(this.attributes.color.vbo);
    // deleteBuffer(this.attributes.tangent.vbo);
    // deleteBuffer(this.attributes.bitangent.vbo);

    this.vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArrayObject);
    const positionBuffer = gl.createBuffer();
    const normalsBuffer = gl.createBuffer();
    const mapBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const elementArrayBuffer = gl.createBuffer();
    // const tangentBuffer = gl.createBuffer();
    // const bitangentBuffer = gl.createBuffer();

    this.attributes.position.vbo = positionBuffer;
    this.attributes.normal.vbo = positionBuffer;
    this.attributes.map.vbo = mapBuffer;
    this.attributes.color.vbo = colorBuffer;
    // this.attributes.tangent.vbo = tangentBuffer;
    // this.attributes.bitangent.vbo = bitangentBuffer;
    this.elementArray.vbo = elementArrayBuffer;

    this.attributes.setLocations(this.shaderProgram);
    this.attributes.setValues(mesh);
    this.elementArray.value = new Uint32Array(mesh.elementArray);

    bufferData(positionBuffer, this.attributes.position);
    bufferData(normalsBuffer, this.attributes.normal);
    bufferData(mapBuffer, this.attributes.map, 3);
    bufferData(colorBuffer, this.attributes.color);
    // bufferData(tangentBuffer, this.attributes.tangent);
    // bufferData(bitangentBuffer, this.attributes.bitangent);
    bufferElementArray(elementArrayBuffer, this.elementArray);
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

  /**
   * Passes all uniform values to shader program.
   */
  uploadUniforms() {
    if (!gl || !this.shaderProgram) {
      return;
    }

    this.uniforms.setLocations(this.shaderProgram);

    // pass uniforms to shader only if defined
    gl.useProgram(this.shaderProgram);
    this.uniforms.modelViewMatrix.value && uniformMatrix4fv(this.uniforms.modelViewMatrix);
    this.uniforms.projectionMatrix.value && uniformMatrix4fv(this.uniforms.projectionMatrix);
    this.uniforms.normalMatrix.value && uniformMatrix4fv(this.uniforms.normalMatrix);
    this.uniforms.directLightDirection.value && uniform3fv(this.uniforms.directLightDirection);
    this.uniforms.directLightColor.value && uniform3fv(this.uniforms.directLightColor);
    this.uniforms.directLightValue.value && uniform1fv(this.uniforms.directLightValue);
    this.uniforms.ambientLightColor.value && uniform3fv(this.uniforms.ambientLightColor);
    this.uniforms.ambientLightValue.value && uniform1fv(this.uniforms.ambientLightValue);
    this.uniforms.useVertexColor.value && uniform1iv(this.uniforms.useVertexColor);
    this.uniforms.color0Sampler.value && uniform1iv(this.uniforms.color0Sampler);
    this.uniforms.color1Sampler.value && uniform1iv(this.uniforms.color1Sampler);
    this.uniforms.normal0Sampler.value && uniform1iv(this.uniforms.normal0Sampler);
    this.uniforms.useColor0.value && uniform1iv(this.uniforms.useColor0);
    this.uniforms.useColor1.value && uniform1iv(this.uniforms.useColor1);
    this.uniforms.useNormal0.value && uniform1iv(this.uniforms.useNormal0);
    this.uniforms.useEmission.value && uniform1iv(this.uniforms.useEmission);
  }

  /**
   * Binds element array buffer and vertex array object that contains
   * shader program attribute buffers.
   */
  bindVertexArray() {
    if (!gl || !this.vertexArrayObject) {
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

/**
 * @param {WebGLBuffer} buffer
 * @param {VBOContainer} elementArray
 */
const bufferElementArray = (buffer, elementArray) => {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementArray.value, gl.STATIC_DRAW);
};

/**
 * @param {WebGLBuffer} buffer
 */
const deleteBuffer = (buffer) => {
  if (buffer) {
    gl.deleteBuffer(buffer);
  }
};

/**
 * @param {WebGLVertexArrayObject} vertexArrayObject
 */
const deleteVertexArray = (vertexArrayObject) => {
  if (vertexArrayObject) {
    gl.deleteVertexArray(vertexArrayObject);
  }
};
