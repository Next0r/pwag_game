const { Vector3 } = require("./engine.math.vector3");
const { EngineToolbox } = require("./engine.toolbox");

/**
 * Represents single parameter that value can be by user to change
 * the way object is rendered on scene e.g. it's color
 */
class Uniform {
  /**
   * Creates new uniform instance
   * @param {string} name name of uniform in shader program
   * @param {number[]} value value of uniform, each value is stored in array even simple integer
   */
  constructor(name, value) {
    /**
     * Name of uniform in shader program
     * @type {string}
     */
    this.name = name;
    /**
     * Uniform location in shader program, used by WebGL2 rendering context
     * @type {WebGLUniformLocation}
     */
    this.location = undefined;
    /**
     * Value of uniform, each value is stored in array even simple integer
     * @type {number[]}
     */
    this.value = value;
  }

  /**
   * Sets location of uniform basing on it's name in shader program
   * @param {WebGLProgram} shaderProgram WebGL2 shader program (vertex and fragment shader)
   * @returns {Uniform} self reference for easier method chaining
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

/**
 * Set of uniforms that can be set by user or are set during rendering process
 * like model and view matrix
 */
class MaterialUniforms {
  /**
   * Creates new uniform container instance
   */
  constructor() {
    /**
     * Checks if uniforms were modified for this material in previous
     * rendering cycle, what allows to improve performance
     * @type {boolean}
     */
    this.modified = true;

    /**
     * Model view matrix uniform, transformation of game object and camera
     * @type {Uniform}
     */
    this.modelViewMatrix = new Uniform("u_model_view_matrix");

    /**
     * Projection matrix uniform, defines the way camera distorts rendered image to achieve perspective effect
     * @type {Uniform}
     */
    this.projectionMatrix = new Uniform("u_projection_matrix");
    /**
     * Normal matrix uniform, allows to achieve realistic shading
     * @type {Uniform}
     */
    this.normalMatrix = new Uniform("u_normal_matrix");

    /**
     * Direct light direction uniform, contains vector that should be passed from direct light component
     * @type {Uniform}
     */
    this.directLightDirection = new Uniform("u_direct_light_direction", [
      0,
      -1,
      0,
    ]);
    /**
     * Direct light color uniform, contains vector that should be passed from direct light component
     * @type {Uniform}
     */
    this.directLightColor = new Uniform("u_direct_light_color", [1, 1, 1]);
    /**
     * Direct light value uniform, contains float that should be passed from direct light component
     * @type {Uniform}
     */
    this.directLightValue = new Uniform("u_direct_light_value", [1]);

    /**
     * Ambient light color uniform, contains vector that should be passed from ambient light component
     * @type {Uniform}
     */
    this.ambientLightColor = new Uniform("u_ambient_light_color", [1, 1, 1]);
    /**
     * Ambient light value uniform, contains float that should be passed from ambient light component
     * @type {Uniform}
     */
    this.ambientLightValue = new Uniform("u_ambient_light_value", [0.1]);

    /**
     * Uniform containing number representing sampler used to map texture onto game object, avoid changing it's value
     * @type {Uniform}
     */
    this.color0Sampler = new Uniform("u_color0_sampler", [0]);
    /**
     * Uniform containing number representing sampler used to map texture onto game object, avoid changing it's value
     * @type {Uniform}
     */
    this.color1Sampler = new Uniform("u_color1_sampler", [1]);
    /**
     * Uniform containing number representing sampler used to map texture onto game object, avoid changing it's value
     * @type {Uniform}
     */
    this.normal0Sampler = new Uniform("u_normal0_sampler", [2]);

    /**
     * Uniform containing integer that allows to choose if texture should be used (0 or 1)
     * @type {Uniform}
     */
    this.useColor0 = new Uniform("u_use_color0", [1]);
    /**
     * Uniform containing integer that allows to choose if texture should be used (0 or 1)
     * @type {Uniform}
     */
    this.useColor1 = new Uniform("u_use_color1", [0]);
    /**
     * Uniform containing integer that allows to choose if texture should be used (0 or 1)
     * @type {Uniform}
     */
    this.useNormal0 = new Uniform("u_use_normal0", [0]);

    /**
     * Uniform containing integer that allows to choose if vertex color should be used (0 or 1)
     * @type {Uniform}
     */
    this.useVertexColor = new Uniform("u_use_vertex_color", [0]);

    /**
     * Uniform containing integer that allows to choose if emission should be used making object shadeless (0 or 1)
     * @type {Uniform}
     */
    this.useEmission = new Uniform("u_use_emission", [0]);

    /**
     * Uniform containing float that allows to offset texture mapped onto game object in x axis
     * @type {Uniform}
     */
    this.mapOffsetX = new Uniform("u_map_offset_x", [0]);
    /**
     * Uniform containing float that allows to offset texture mapped onto game object in y axis
     * @type {Uniform}
     */
    this.mapOffsetY = new Uniform("u_map_offset_y", [0]);

    /**
     * Uniform containing float that allows to tile texture mapped onto game object in x axis (texture will repeat)
     * @type {Uniform}
     */
    this.mapTilingX = new Uniform("u_map_tiling_x", [1]);
    /**
     * Uniform containing float that allows to tile texture mapped onto game object in y axis (texture will repeat)
     * @type {Uniform}
     */
    this.mapTilingY = new Uniform("u_map_tiling_y", [1]);
  }

  /**
   * Sets locations of uniforms for this material, this method should be called once material is created
   * @param {WebGLProgram} shaderProgram WebGL2 shader program (vertex and fragment shader)
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
    this.mapOffsetX.setLocation(shaderProgram);
    this.mapOffsetY.setLocation(shaderProgram);
    this.mapTilingX.setLocation(shaderProgram);
    this.mapTilingY.setLocation(shaderProgram);
  }
}

exports.MaterialUniforms = MaterialUniforms;
