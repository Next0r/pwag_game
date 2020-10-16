const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");
const { Vector4 } = require("./engine.math.vector4");

class Transform {
  constructor() {
    this.location = new Vector3();
    this.rotation = new Vector3();
    this.scale = new Vector3(1, 1, 1);

    this.matrix = new Matrix4();
  }

  rebuildMatrix() {
    const locationMatrix = new Matrix4();
    locationMatrix.translate(this.location);
    const rotationMatrix = new Matrix4();
    rotationMatrix.rotate(Vector3.forward, this.rotation.z);
    rotationMatrix.rotate(Vector3.up, this.rotation.y);
    rotationMatrix.rotate(Vector3.right, this.rotation.x);
    const scaleMatrix = new Matrix4();
    scaleMatrix.scale(this.scale);
    this.matrix.fromMatrix4(locationMatrix.multiply(rotationMatrix.multiply(scaleMatrix)));
    return this;
  }

  forward() {
    return new Vector3(-this.matrix.m20, -this.matrix.m21, -this.matrix.m22);
  }

  right() {
    return new Vector3(this.matrix.m00, this.matrix.m01, this.matrix.m02);
  }

  /**
   * @param {Vector3} axis
   * @param {Float} angle
   */
  rotate(axis, angle) {
    this.rotationMatrix.rotate(axis, angle);
  }

  /**
   * @param {Vector3} translationVector
   */
  translate(translationVector) {
    this.locationMatrix.translate(translationVector);
  }
}

exports.Transform = Transform;
