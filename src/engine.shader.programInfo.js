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
    if (!gl || !this.programInfoHandle.program) {
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
    this.directLightDirection = new ProgramUniform(programInfoHandle);
    this.directLightColor = new ProgramUniform(programInfoHandle);
    this.directLightValue = new ProgramUniform(programInfoHandle);
    this.ambientLightColor = new ProgramUniform(programInfoHandle);
    this.ambientLightValue = new ProgramUniform(programInfoHandle);
  }
}

class ProgramInfo {
  /**
   *
   * @param {WebGLProgram} program
   */
  constructor(program) {
    this.program = program;
    this.attributes = new AttributesInfo(this);
    this.uniforms = new UniformsInfo(this);
  }

  /**
   *
   * @param {WebGLProgram} program
   */
  setProgram(program) {
    this.program = program;
    this.attributes = new AttributesInfo(this);
    this.uniforms = new UniformsInfo(this);
  }
}

exports.ProgramInfo = ProgramInfo;
