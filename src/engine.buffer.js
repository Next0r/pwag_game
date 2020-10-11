const utilities = require("./engine.utilities");
const gl = utilities.getGLContext();

class Buffer {
  constructor(bufferType = "arrayBuffer") {
    this.vbo = undefined;
    this.bufferType = bufferType;
    this.target = undefined;
    this.arrayInfo = {
      attributeLocation: 0,
      size: 3,
      dataType: "float",
      normalized: false,
      stride: 0,
      offset: 0,
    };

    this.init();
    this.setTarget();
  }

  setTarget(bufferType = this.bufferType) {
    if (!gl) {
      return;
    }
    switch (bufferType) {
      case "arrayBuffer":
        this.target = gl.ARRAY_BUFFER;
        break;
      case "elementArrayBuffer":
        this.target = gl.ELEMENT_ARRAY_BUFFER;
        break;
      default:
        this.target = gl.ARRAY_BUFFER;
        break;
    }
  }

  init() {
    if (!gl) {
      return;
    }
    this.vbo = gl.createBuffer();
  }

  setArray(data) {
    if (!gl || !this.target || !this.vbo) {
      return;
    }
    gl.bindBuffer(this.target, this.vbo);
    gl.bufferData(this.target, data, gl.STATIC_DRAW);
  }

  setArrayInfo({
    attributeLocation = this.arrayInfo.attributeLocation,
    size = this.arrayInfo.size,
    dataType = this.arrayInfo.dataType,
    normalized = this.arrayInfo.normalized,
    stride = this.arrayInfo.stride,
    offset = this.arrayInfo.offset,
  } = {}) {
    this.arrayInfo = {
      attributeLocation: attributeLocation,
      size: size,
      dataType: dataType,
      normalized: normalized,
      stride: stride,
      offset: offset,
    };

    if (!gl || !this.target || !this.vbo) {
      return;
    }
    gl.bindBuffer(this.target, this.vbo);

    let arrayDataType = undefined;
    switch (this.arrayInfo.dataType) {
      case "float":
        arrayDataType = gl.FLOAT;
        break;
      default:
        arrayDataType = gl.FLOAT;
        break;
    }

    gl.vertexAttribPointer(
      this.arrayInfo.attributeLocation,
      this.arrayInfo.size,
      arrayDataType,
      this.arrayInfo.normalized,
      this.arrayInfo.stride,
      this.arrayInfo.offset
    );
  }

  enable() {
    if (!gl) {
      return;
    }
    gl.enableVertexAttribArray(this.arrayInfo.attributeLocation);
  }

  disable() {
    if (!gl) {
      return;
    }
    gl.disableVertexAttribArray(this.arrayInfo.attributeLocation);
  }
}

exports.Buffer = Buffer;
