const { getGLContext } = require("./engine.utilities");
const gl = getGLContext();

class Attribute {
  constructor(name) {
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
}

exports.MaterialAttributes = MaterialAttributes;
