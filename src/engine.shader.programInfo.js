const utils = require("./engine.utilities");
const gl = utils.getGLContext();

class ProgramAttribute {
  /**
   *
   * @param {ProgramInfo} programInfoHandle
   */
  constructor(programInfoHandle) {
    this.programInfoHandle = programInfoHandle;
    this.location = undefined;
  }
  setLocation(attributeName) {
    if (!gl || !this.programInfoHandle.program) {
      return;
    }
    this.location = gl.getAttribLocation(
      this.programInfoHandle.program,
      attributeName
    );
  }
}

class AttributesInfo {
  /**
   *
   * @param {ProgramInfo} programInfoHandle
   */
  constructor(programInfoHandle) {
    this.programInfoHandle = programInfoHandle;
    this.position = new ProgramAttribute(programInfoHandle);
    this.normal = new ProgramAttribute(programInfoHandle);
    this.map = new ProgramAttribute(programInfoHandle);
    this.color = new ProgramAttribute(programInfoHandle);
  }
}

class ProgramUniform {
  /**
   *
   * @param {ProgramInfo} programInfoHandle
   */
  constructor(programInfoHandle) {
    this.programInfoHandle = programInfoHandle;
    this.location = undefined;
  }

  setLocation(uniformName) {
    if (!gl || !this.programInfoHandle || !this.programInfoHandle.program) {
      return;
    }
    this.location = gl.getUniformLocation(
      this.programInfoHandle.program,
      uniformName
    );
  }
}

class UniformsInfo {
  /**
   *
   * @param {ProgramInfo} programInfoHandle
   */
  constructor(programInfoHandle) {
    this.programInfoHandle = programInfoHandle;
    this.modelViewMatrix = new ProgramUniform(programInfoHandle);
    this.projectionMatrix = new ProgramUniform(programInfoHandle);
    this.normalMatrix = new ProgramUniform(programInfoHandle);
    this.directLightDirection = new ProgramUniform(programInfoHandle);
    this.directLightColor = new ProgramUniform(programInfoHandle);
    this.directLightValue = new ProgramUniform(programInfoHandle);
    this.ambientLightColor = new ProgramUniform(programInfoHandle);
    this.ambientLightValue = new ProgramUniform(programInfoHandle);
  }
}

/**
 * Holds program locations for it's attributes and uniforms.
 * While creating object of this class ALWAYS supply proper
 * shader program or use setProgram method afterwards.
 */
class ProgramInfo {
  /**
   *
   * @param {WebGLProgram} program
   */
  constructor(program) {
    this.program = program;
    this.attributes = new AttributesInfo(this);
    this.uniforms = new UniformsInfo(this);
    initAttributesLocations(this);
    initUniformsLocations(this);
  }

  /**
   * @param {WebGLProgram} program
   */
  setProgram(program) {
    this.program = programInfo;
    initUniformsLocations(this);
    initUniformsLocations(this);
  }
}

/**
 * @param {ProgramInfo} programInfo
 */
const initAttributesLocations = (programInfo) => {
  programInfo.attributes.position.setLocation("a_position");
  programInfo.attributes.color.setLocation("a_color");
  programInfo.attributes.normal.setLocation("a_normal");
  programInfo.attributes.map.setLocation("a_map");
  return this;
};

/**
 * @param {ProgramInfo} programInfo
 */
const initUniformsLocations = (programInfo) => {
  programInfo.uniforms.modelViewMatrix.setLocation("u_model_view_matrix");
  programInfo.uniforms.projectionMatrix.setLocation("u_projection_matrix");
  programInfo.uniforms.directLightDirection.setLocation(
    "u_direct_light_direction"
  );
  programInfo.uniforms.normalMatrix.setLocation("u_normal_matrix");
  programInfo.uniforms.directLightColor.setLocation("u_direct_light_color");
  programInfo.uniforms.directLightValue.setLocation("u_direct_light_value");
  programInfo.uniforms.ambientLightColor.setLocation("u_ambient_light_color");
  programInfo.uniforms.ambientLightValue.setLocation("u_ambient_light_value");
  return this;
};

exports.ProgramInfo = ProgramInfo;
