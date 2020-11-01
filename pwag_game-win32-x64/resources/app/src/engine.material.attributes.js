const { EngineToolbox } = require("./engine.toolbox");
const { Mesh } = require("./engine.utilities.mesh");
// const gl = EngineToolbox.getGLContext();

class Attribute {
  constructor(name) {
    this.name = name;
    this.location = undefined;
  }

  /**
   * @param {WebGLProgram} shaderProgram
   */
  setLocation(shaderProgram) {
    const gl = EngineToolbox.getGLContext();
    if (!shaderProgram) {
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
}

exports.MaterialAttributes = MaterialAttributes;
