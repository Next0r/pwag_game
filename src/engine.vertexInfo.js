const utilities = require("./engine.utilities");
const { GameObject } = require("./engine.gameObject");
const { GLBuffer } = require("./engine.glBuffer");
const gl = utilities.getGLContext();

class VertexInfo {
  /**
   *
   * @param {GameObject} gameObject
   */
  constructor(gameObject) {
    this.gameObject = gameObject;
    this.vao = undefined;
    this.positionBuffer = undefined;
    this.normalsBuffer = undefined;
    this.mapBuffer = undefined;
    this.colorBuffer = undefined;
    this.init();
  }

  init() {
    if (!gl) {
      return;
    }
    this.vao = gl.createVertexArray();
    return this;
  }

  bind() {
    if (!gl || !this.vao) {
      return;
    }
    gl.bindVertexArray(this.vao);
    return this;
  }

  delete() {
    if (!gl || !this.vao) {
      return;
    }
    gl.deleteVertexArray(this.vao);
    return this;
  }

  initPositionBuffer() {
    if (
      !gl ||
      !this.gameObject ||
      !this.gameObject.mesh ||
      !this.gameObject.programInfo
    ) {
      return;
    }
    this.bind();
    this.positionBuffer = new GLBuffer("arrayBuffer");
    this.positionBuffer.setArray(
      new Float32Array(this.gameObject.mesh.getPositionsArray())
    );
    this.positionBuffer.setArrayInfo({
      attributeLocation: this.gameObject.programInfo.attributes.position
        .location,
      size: 3,
    });
    this.positionBuffer.enable();
    return this;
  }

  initNormalsBuffer() {
    if (
      !gl ||
      !this.gameObject ||
      !this.gameObject.mesh ||
      !this.gameObject.programInfo
    ) {
      return;
    }
    this.bind();
    this.normalsBuffer = new GLBuffer("arrayBuffer");
    this.normalsBuffer.setArray(
      new Float32Array(this.gameObject.mesh.getNormalsArray())
    );
    this.normalsBuffer.setArrayInfo({
      attributeLocation: this.gameObject.programInfo.attributes.normal.location,
      size: 3,
    });
    this.normalsBuffer.enable();
    return this;
  }

  initColorBuffer() {
    if (
      !gl ||
      !this.gameObject ||
      !this.gameObject.mesh ||
      !this.gameObject.programInfo
    ) {
      return;
    }
    this.bind();
    this.colorBuffer = new GLBuffer("arrayBuffer");
    this.colorBuffer.setArray(
      new Float32Array(this.gameObject.mesh.getColorsArray())
    );
    this.colorBuffer.setArrayInfo({
      attributeLocation: this.gameObject.programInfo.attributes.color.location,
      size: 4,
    });
    this.colorBuffer.enable();
    return this;
  }
}

exports.VertexInfo = VertexInfo;
