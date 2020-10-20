const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");

class Transform {
  constructor() {
    this.matrix = new Matrix4();
    this.locationMatrix = new Matrix4();
    this.rotationMatrix = new Matrix4();
    this.scaleMatrix = new Matrix4();
  }

  /**
   * @param {Number} angle
   */
  rotateX(angle) {
    this.rotationMatrix.rotate(Vector3.right, angle);
    return this;
  }
  /**
   * @param {Number} angle
   */
  rotateY(angle) {
    this.rotationMatrix.rotate(Vector3.up, angle);
    return this;
  }
  /**
   * @param {Number} angle
   */
  rotateZ(angle) {
    this.rotationMatrix.rotate(Vector3.forward, angle);
    return this;
  }
  /**
   * @param {Vector3} translationVector
   */
  translate(translationVector) {
    this.locationMatrix.translate(translationVector);
    return this;
  }
  /**
   * @param {Vector3} scaleVector
   */
  scale(scaleVector) {
    this.scaleMatrix.scale(scaleVector);
    return this;
  }

  reset() {
    this.locationMatrix.identity();
    this.rotationMatrix.identity();
    this.scaleMatrix.identity();
    this.matrix.identity();
    return this;
  }

  applyLocation() {
    this.matrix.multiply(this.locationMatrix);
    this.locationMatrix.identity();
    return this;
  }

  applyRotation() {
    this.matrix.multiply(this.rotationMatrix);
    this.rotationMatrix.identity();
    return this;
  }

  applyScale() {
    this.matrix.multiply(this.scaleMatrix);
    this.scaleMatrix.identity();
    return this;
  }
}

exports.Transform = Transform;
