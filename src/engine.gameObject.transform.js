const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");

class Transform {
  constructor() {
    this.location = new Vector3(0, 0, 0);
    this.rotation = new Vector3(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
    this.matrix = new Matrix4();
  }

  rebuildMatrix() {
    this.matrix.identity();
    this.matrix.translate(this.location);
    this.matrix.rotate(Vector3.right, this.rotation.x);
    this.matrix.rotate(Vector3.up, this.rotation.y);
    this.matrix.rotate(Vector3.forward, this.rotation.z);
    // this.matrix.rotate(this.rotation);
    this.matrix.scale(this.scale);
  }
}

exports.Transform = Transform;
