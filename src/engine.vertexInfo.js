const utilities = require("./engine.utilities");
const { GameObject } = require("./engine.gameObject");
const { GLBuffer } = require("./engine.glBuffer");
const { Mesh } = require("./engine.utilities.mesh");
const { ProgramInfo } = require("./engine.shader.programInfo");
const gl = utilities.getGLContext();

class VertexInfo {
  /**
   * @param {Mesh} mesh
   * @param {ProgramInfo } programInfo
   */
  constructor(mesh, programInfo) {
    this.mesh = mesh;
    this.programInfo = programInfo;
    this.vao = undefined;
    this.positionBuffer = undefined;
    this.normalsBuffer = undefined;
    this.mapBuffer = undefined;
    this.colorBuffer = undefined;
    this.init();
    initPositionBuffer(this);
    initNormalsBuffer(this);
    initColorBuffer(this);
  }

  /**
   * @param {Mesh} mesh
   */
  setMesh(mesh) {
    this.mesh = mesh;
    this.positionBuffer.delete();
    this.normalsBuffer.delete();
    this.mapBuffer.delete();
    this.colorBuffer.delete();
    initPositionBuffer(this);
    initNormalsBuffer(this);
    initColorBuffer(this);
    return this;
  }

  /**
   * @param {ProgramInfo} programInfo
   */
  setProgram(programInfo) {
    this.programInfo = programInfo;
    this.positionBuffer.delete();
    this.normalsBuffer.delete();
    this.mapBuffer.delete();
    this.colorBuffer.delete();
    initPositionBuffer(this);
    initNormalsBuffer(this);
    initColorBuffer(this);
    return this;
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
}

/**
 * @param {VertexInfo} vertexInfo
 */
const initPositionBuffer = (vertexInfo) => {
  if (!gl || !vertexInfo.mesh || !vertexInfo.programInfo) {
    return;
  }
  vertexInfo.bind();
  vertexInfo.positionBuffer = new GLBuffer("arrayBuffer");
  vertexInfo.positionBuffer.setArray(
    new Float32Array(vertexInfo.mesh.getPositionsArray())
  );
  vertexInfo.positionBuffer.setArrayInfo({
    attributeLocation: vertexInfo.programInfo.attributes.position.location,
    size: 4,
  });
  vertexInfo.positionBuffer.enable();
};

/**
 * @param {VertexInfo} vertexInfo
 */
const initNormalsBuffer = (vertexInfo) => {
  if (!gl || !vertexInfo.mesh || !vertexInfo.programInfo) {
    return;
  }
  vertexInfo.bind();
  vertexInfo.normalsBuffer = new GLBuffer("arrayBuffer");
  vertexInfo.normalsBuffer.setArray(
    new Float32Array(vertexInfo.mesh.getNormalsArray())
  );
  vertexInfo.normalsBuffer.setArrayInfo({
    attributeLocation: vertexInfo.programInfo.attributes.normal.location,
    size: 4,
  });
  vertexInfo.normalsBuffer.enable();
};

/**
 * @param {VertexInfo} vertexInfo
 */
const initColorBuffer = (vertexInfo) => {
  if (!gl || !vertexInfo.mesh || !vertexInfo.programInfo) {
    return;
  }
  vertexInfo.bind();
  vertexInfo.colorBuffer = new GLBuffer("arrayBuffer");
  vertexInfo.colorBuffer.setArray(
    new Float32Array(vertexInfo.mesh.getColorsArray())
  );
  vertexInfo.colorBuffer.setArrayInfo({
    attributeLocation: vertexInfo.programInfo.attributes.color.location,
    size: 4,
  });
  vertexInfo.colorBuffer.enable();
};

exports.VertexInfo = VertexInfo;
