const { Matrix4 } = require("./engine.math.matrix4");

class Projection {
  constructor() {
    this.fov = 45;
    this.aspect = 4 / 3;
    this.near = 0.1;
    this.far = 100;
    this.matrix = new Matrix4();
  }

  rebuildMatrixPerspective() {
    this.matrix.identity();
    this.matrix.projection({
      fov: this.fov,
      aspect: this.aspect,
      near: this.near,
      far: this.far,
    });
    return this;
  }

  rebuildMatrixOrtho() {
    this.matrix.identity();
    this.matrix.ortho({ aspect: this.aspect, near: this.near, far: this.far });
    return this;
  }
}

exports.Projection = Projection;
