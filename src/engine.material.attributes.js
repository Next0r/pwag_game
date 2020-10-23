const { EngineToolbox } = require("./engine.toolbox");
const { Mesh } = require("./engine.utilities.mesh");
const gl = EngineToolbox.getGLContext();

class VBOContainer {
  constructor() {
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
    // this.tangent = new Attribute("a_tangent");
    // this.bitangent = new Attribute("a_bitangent");
  }

  /**
   * @param {WebGLProgram} shaderProgram
   */
  setLocations(shaderProgram) {
    this.position.setLocation(shaderProgram);
    this.normal.setLocation(shaderProgram);
    this.map.setLocation(shaderProgram);
    this.color.setLocation(shaderProgram);
    // this.tangent.setLocation(shaderProgram);
    // this.bitangent.setLocation(shaderProgram);
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
    // this.tangent.value = new Float32Array(mesh.getTangentArray());
    // this.bitangent.value = new Float32Array(mesh.getBitangentArray());
  }
}

exports.MaterialAttributes = MaterialAttributes;
