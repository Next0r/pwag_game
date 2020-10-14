const { Mesh } = require("./engine.utilities.mesh");
const { getGLContext } = require("./engine.utilities");
const gl = getGLContext();

class VBOContainer {
  constructor(){
    this.vbo = undefined;
    this.value = new Uint32Array();
  }
}

exports.VBOContainer = VBOContainer;

class Attribute extends VBOContainer {
  constructor(name) {
    super();
    this.name = name;
    this.location = undefined;
    this.value = new Float32Array();
  }

  /**
   * @param {WebGLProgram} shaderProgram
   */
  setLocation(shaderProgram) {
    if (!gl || !shaderProgram) {
      return;
    }
    this.location = gl.getAttribLocation(shaderProgram, this.name);
    return this;
  }
}

exports.Attribute = Attribute;

class MaterialAttributes {
  constructor() {
    this.position = new Attribute("a_position");
    this.normal = new Attribute("a_normal");
    this.map = new Attribute("a_map");
    this.color = new Attribute("a_color");
  }

  /**
   * @param {WebGLProgram} shaderProgram
   */
  setLocations(shaderProgram) {
    this.position.setLocation(shaderProgram);
    this.normal.setLocation(shaderProgram);
    this.map.setLocation(shaderProgram);
    this.color.setLocation(shaderProgram);
  }

  /**
   * @param {Mesh} mesh
   */
  setValues(mesh) {
    if (!mesh) {
      return;
    }
    this.position.value = new Float32Array(mesh.getPositionsArray());
    this.normal.value = new Float32Array(mesh.getNormalsArray());
    this.map.value = new Float32Array(mesh.getMapArray());
    this.color.value = new Float32Array(mesh.getColorsArray());
  }
}

exports.MaterialAttributes = MaterialAttributes;
