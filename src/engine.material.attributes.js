const { EngineToolbox } = require("./engine.toolbox");

/**
 * Single attribute of material, attributes are
 * references to arrays defining objects on scene e.g. vertices
 */
class Attribute {
  /**
   * Creates new attribute
   * @param {string} name name of attribute
   */
  constructor(name) {
    /**
     * Name of attribute
     * @type {string}
     */
    this.name = name;
    /**
     * Value representing attribute location in shader
     * @type {number}
     */
    this.location = undefined;
  }

  /**
   * Sets location for this attribute in shader program, attribute name
   * has to be defined before this method is called
   * @param {WebGLProgram} shaderProgram WebGL2 shader program (fragment and vertex shader)
   * @returns {Attribute} self reference for easier chaining
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

/**
 * Represents attributes that should be defined
 * in vertex shader
 */
class MaterialAttributes {
  /**
   * Creates new material attributes
   */
  constructor() {
    /**
     * Name and location of array containing vertices positions
     * @type {Attribute}
     */
    this.position = new Attribute("a_position");
    /**
     * Name and location of array containing vertices normals
     * @type {Attribute}
     */
    this.normal = new Attribute("a_normal");
    /**
     * Name and location of array containing vertices UV mapping
     * @type {Attribute}
     */
    this.map = new Attribute("a_map");
    /**
     * Name and location of array containing vertices colors
     * @type {Attribute}
     */
    this.color = new Attribute("a_color");
  }

  /**
   * Sets locations of position, normal, mapping and color attribute
   * @param {WebGLProgram} shaderProgram WebGL2 shader program (fragment and vertex shader)
   */
  setLocations(shaderProgram) {
    this.position.setLocation(shaderProgram);
    this.normal.setLocation(shaderProgram);
    this.map.setLocation(shaderProgram);
    this.color.setLocation(shaderProgram);
  }
}

exports.MaterialAttributes = MaterialAttributes;
