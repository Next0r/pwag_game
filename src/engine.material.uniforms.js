const { getGLContext } = require("./engine.utilities");
const gl = getGLContext();

class Uniform {
  constructor(name) {
    this.name = name;
    this.location = undefined;
    this.value = undefined;
  }

  /**
   * @param {WebGLProgram} shaderProgram
   */
  setLocation(shaderProgram) {
    if (!gl || !shaderProgram) {
      return;
    }
    this.location = gl.getUniformLocation(shaderProgram, this.name);
    return this;
  }

  setValue(array = []) {
    this.value = array;
  }
}

exports.Uniform = Uniform;

class MaterialUniforms {
  constructor() {
    this.modelViewMatrix = new Uniform("u_model_view_matrix");
    this.projectionMatrix = new Uniform("u_projection_matrix");
    this.normalMatrix = new Uniform("u_normal_matrix");

    this.directLightDirection = new Uniform("u_direct_light_direction");
    this.directLightColor = new Uniform("u_direct_light_color");
    this.directLightValue = new Uniform("u_direct_light_value");

    this.ambientLightColor = new Uniform("u_ambient_light_color");
    this.ambientLightValue = new Uniform("u_ambient_light_value");
  }

  /**
   * @param {WebGLProgram} shaderProgram
   */
  setLocations(shaderProgram) {
    this.modelViewMatrix.setLocation(shaderProgram);
    this.projectionMatrix.setLocation(shaderProgram);
    this.normalMatrix.setLocation(shaderProgram);
    this.directLightDirection.setLocation(shaderProgram);
    this.directLightColor.setLocation(shaderProgram);
    this.directLightValue.setLocation(shaderProgram);
    this.ambientLightColor.setLocation(shaderProgram);
    this.ambientLightValue.setLocation(shaderProgram);
  }
}

exports.MaterialUniforms = MaterialUniforms;
