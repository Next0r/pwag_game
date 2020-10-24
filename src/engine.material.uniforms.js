const { Vector3 } = require("./engine.math.vector3");
const { EngineToolbox } = require("./engine.toolbox");

class Uniform {
  constructor(name, value) {
    this.name = name;
    this.location = undefined;
    this.value = value;
  }

  /**
   * @param {WebGLProgram} shaderProgram
   */
  setLocation(shaderProgram) {
    const gl = EngineToolbox.getGLContext();
    if (!shaderProgram) {
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

    this.directLightDirection = new Uniform("u_direct_light_direction", [0, -1, 0]);
    this.directLightColor = new Uniform("u_direct_light_color", [1, 1, 1]);
    this.directLightValue = new Uniform("u_direct_light_value", [1]);

    this.ambientLightColor = new Uniform("u_ambient_light_color", [1, 1, 1]);
    this.ambientLightValue = new Uniform("u_ambient_light_value", [0.1]);

    this.color0Sampler = new Uniform("u_color0_sampler", [0]);
    this.color1Sampler = new Uniform("u_color1_sampler", [1]);
    this.normal0Sampler = new Uniform("u_normal0_sampler", [2]);

    this.useColor0 = new Uniform("u_use_color0", [1]);
    this.useColor1 = new Uniform("u_use_color1", [0]);
    this.useNormal0 = new Uniform("u_use_normal0", [0]);

    this.useVertexColor = new Uniform("u_use_vertex_color", [0]);

    this.useEmission = new Uniform("u_use_emission", [0]);
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
    this.color0Sampler.setLocation(shaderProgram);
    this.color1Sampler.setLocation(shaderProgram);
    this.normal0Sampler.setLocation(shaderProgram);
    this.useColor0.setLocation(shaderProgram);
    this.useColor1.setLocation(shaderProgram);
    this.useNormal0.setLocation(shaderProgram);
    this.useVertexColor.setLocation(shaderProgram);
    this.useEmission.setLocation(shaderProgram);
  }
}

exports.MaterialUniforms = MaterialUniforms;
