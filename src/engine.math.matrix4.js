const { Vector3 } = require("./engine.math.vector3");
const { Vector4 } = require("./engine.math.vector4");

/**
 * m<column><row>
 */
class Matrix4 {
  constructor() {
    this.m00 = 1;
    this.m01 = 0;
    this.m02 = 0;
    this.m03 = 0;
    this.m10 = 0;
    this.m11 = 1;
    this.m12 = 0;
    this.m13 = 0;
    this.m20 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.m23 = 0;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
  }

  /**
   *
   * @param {Matrix4} matrix
   */
  fromMatrix4(matrix) {
    const m = this;
    const n = matrix;
    m.m00 = n.m00;
    m.m01 = n.m01;
    m.m02 = n.m02;
    m.m03 = n.m03;

    m.m10 = n.m10;
    m.m11 = n.m11;
    m.m12 = n.m12;
    m.m13 = n.m13;

    m.m20 = n.m20;
    m.m21 = n.m21;
    m.m22 = n.m22;
    m.m23 = n.m23;

    m.m30 = n.m30;
    m.m31 = n.m31;
    m.m32 = n.m32;
    m.m33 = n.m33;
    return this;
  }

  clone() {
    const m = new Matrix4();
    const n = this;
    m.m00 = n.m00;
    m.m01 = n.m01;
    m.m02 = n.m02;
    m.m03 = n.m03;

    m.m10 = n.m10;
    m.m11 = n.m11;
    m.m12 = n.m12;
    m.m13 = n.m13;

    m.m20 = n.m20;
    m.m21 = n.m21;
    m.m22 = n.m22;
    m.m23 = n.m23;

    m.m30 = n.m30;
    m.m31 = n.m31;
    m.m32 = n.m32;
    m.m33 = n.m33;

    return m;
  }

  /**
   * [...column0, ...column1, ...]
   */
  fromArray(array = []) {
    const a = array;
    const m = this;
    m.m00 = a[0];
    m.m01 = a[1];
    m.m02 = a[2];
    m.m03 = a[3];
    m.m10 = a[4];
    m.m11 = a[5];
    m.m12 = a[6];
    m.m13 = a[7];
    m.m20 = a[8];
    m.m21 = a[9];
    m.m22 = a[10];
    m.m23 = a[11];
    m.m30 = a[12];
    m.m31 = a[13];
    m.m32 = a[14];
    m.m33 = a[15];
    return this;
  }

  /**
   * [...column0, ...column1, ...]
   */
  toArray() {
    return [
      this.m00,
      this.m01,
      this.m02,
      this.m03,
      this.m10,
      this.m11,
      this.m12,
      this.m13,
      this.m20,
      this.m21,
      this.m22,
      this.m23,
      this.m30,
      this.m31,
      this.m32,
      this.m33,
    ];
  }

  identity() {
    this.m00 = 1;
    this.m01 = 0;
    this.m02 = 0;
    this.m03 = 0;
    this.m10 = 0;
    this.m11 = 1;
    this.m12 = 0;
    this.m13 = 0;
    this.m20 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.m23 = 0;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
    return this;
  }

  projection({ fov = 45, aspect = 1.333, near = 0.1, far = 100 } = {}) {
    const tan = Math.tan(fov / 2);
    this.identity();
    this.m00 = 1 / (aspect * tan);
    this.m11 = 1 / tan;
    this.m22 = -(far + near) / (far - near);
    this.m32 = -(2 * far * near) / (far - near);
    this.m23 = -1;
    this.m33 = 0;
    return this;
  }

  /**
   *
   * @param {Matrix4} matrix
   */
  multiply(matrix) {
    const n = this.clone();
    const m = matrix;
    this.m00 = n.m00 * m.m00 + n.m10 * m.m01 + n.m20 * m.m02 + n.m30 * m.m03;
    this.m10 = n.m00 * m.m10 + n.m10 * m.m11 + n.m20 * m.m12 + n.m30 * m.m13;
    this.m20 = n.m00 * m.m20 + n.m20 * m.m21 + n.m20 * m.m22 + n.m30 * m.m23;
    this.m30 = n.m00 * m.m30 + n.m30 * m.m31 + n.m20 * m.m32 + n.m30 * m.m33;

    this.m01 = n.m01 * m.m00 + n.m11 * m.m01 + n.m21 * m.m02 + n.m31 * m.m03;
    this.m11 = n.m01 * m.m10 + n.m11 * m.m11 + n.m21 * m.m12 + n.m31 * m.m13;
    this.m21 = n.m01 * m.m20 + n.m21 * m.m21 + n.m21 * m.m22 + n.m31 * m.m23;
    this.m31 = n.m01 * m.m30 + n.m31 * m.m31 + n.m21 * m.m32 + n.m31 * m.m33;

    this.m02 = n.m02 * m.m00 + n.m12 * m.m01 + n.m22 * m.m02 + n.m32 * m.m03;
    this.m12 = n.m02 * m.m10 + n.m12 * m.m11 + n.m22 * m.m12 + n.m32 * m.m13;
    this.m22 = n.m02 * m.m20 + n.m22 * m.m21 + n.m22 * m.m22 + n.m32 * m.m23;
    this.m32 = n.m02 * m.m30 + n.m32 * m.m31 + n.m22 * m.m32 + n.m32 * m.m33;

    this.m03 = n.m03 * m.m00 + n.m13 * m.m01 + n.m23 * m.m02 + n.m33 * m.m03;
    this.m13 = n.m03 * m.m10 + n.m13 * m.m11 + n.m23 * m.m12 + n.m33 * m.m13;
    this.m23 = n.m03 * m.m20 + n.m23 * m.m21 + n.m23 * m.m22 + n.m33 * m.m23;
    this.m33 = n.m03 * m.m30 + n.m33 * m.m31 + n.m23 * m.m32 + n.m33 * m.m33;

    // this.m00 = n.m00 * m.m00 + n.m01 * m.m10 + n.m02 * m.m20 + n.m03 * m.m30;
    // this.m01 = n.m00 * m.m01 + n.m01 * m.m11 + n.m02 * m.m21 + n.m03 * m.m31;
    // this.m02 = n.m00 * m.m02 + n.m01 * m.m12 + n.m02 * m.m22 + n.m03 * m.m32;
    // this.m03 = n.m00 * m.m03 + n.m01 * m.m13 + n.m02 * m.m23 + n.m03 * m.m33;

    // this.m10 = n.m10 * m.m00 + n.m11 * m.m10 + n.m12 * m.m20 + n.m13 * m.m30;
    // this.m11 = n.m10 * m.m01 + n.m11 * m.m11 + n.m12 * m.m21 + n.m13 * m.m31;
    // this.m12 = n.m10 * m.m02 + n.m11 * m.m12 + n.m12 * m.m22 + n.m13 * m.m32;
    // this.m13 = n.m10 * m.m03 + n.m11 * m.m13 + n.m12 * m.m23 + n.m13 * m.m33;

    // this.m20 = n.m20 * m.m00 + n.m21 * m.m10 + n.m22 * m.m20 + n.m23 * m.m30;
    // this.m21 = n.m20 * m.m01 + n.m21 * m.m11 + n.m22 * m.m21 + n.m23 * m.m31;
    // this.m22 = n.m20 * m.m02 + n.m21 * m.m12 + n.m22 * m.m22 + n.m23 * m.m32;
    // this.m23 = n.m20 * m.m03 + n.m21 * m.m13 + n.m22 * m.m23 + n.m23 * m.m33;

    // this.m30 = n.m30 * m.m00 + n.m31 * m.m10 + n.m32 * m.m20 + n.m33 * m.m30;
    // this.m31 = n.m30 * m.m01 + n.m31 * m.m11 + n.m32 * m.m21 + n.m33 * m.m31;
    // this.m32 = n.m30 * m.m02 + n.m31 * m.m12 + n.m32 * m.m22 + n.m33 * m.m32;
    // this.m33 = n.m30 * m.m03 + n.m31 * m.m13 + n.m32 * m.m23 + n.m33 * m.m33;
    return this;
  }

  rotateAxisAngle(axis = new Vector3(1, 0, 0), angle = 0) {
    const u = axis.normalize();
    const r = (angle * Math.PI) / 180;
    const sinR = Math.sin(r);
    const cosR = Math.cos(r);
    this.m00 = cosR + u.x * u.x * (1 - cosR);
    this.m10 = u.x * u.y * (1 - cosR) - u.z * sinR;
    this.m20 = u.x * u.z * (1 - cosR) + u.y * sinR;
    this.m01 = u.y * u.z * (1 - cosR) + u.z * sinR;
    this.m11 = cosR + u.y * u.y * (1 - cosR);
    this.m21 = u.y * u.z * (1 - cosR) - u.x * sinR;
    this.m02 = u.z * u.x * (1 - cosR) - u.y * sinR;
    this.m12 = u.z * u.y * (1 - cosR) + u.x * sinR;
    this.m22 = cosR + u.z * u.z * (1 - cosR);
    return this;
  }

  rotate(rotationVector = new Vector3()) {
    const x = (rotationVector.x * Math.PI) / 180;
    const y = (rotationVector.y * Math.PI) / 180;
    const z = (rotationVector.z * Math.PI) / 180;
    const cosX = Math.cos(x);
    const cosY = Math.cos(y);
    const cosZ = Math.cos(z);
    const sinX = Math.sin(x);
    const sinY = Math.sin(y);
    const sinZ = Math.sin(z);
    this.m00 = cosZ * cosY;
    this.m10 = cosZ * sinY * sinX - sinZ * cosX;
    this.m20 = cosZ * sinY * cosX + sinZ * sinX;
    this.m01 = sinZ * cosY;
    this.m11 = sinZ * sinY * sinX + cosZ * cosX;
    this.m21 = sinZ * sinY * cosX - cosZ * sinX;
    this.m02 = -sinY;
    this.m12 = cosY * sinX;
    this.m22 = cosY * cosX;
    return this;
  }

  scale(scaleVector = new Vector3()) {
    this.m00 *= scaleVector.x;
    this.m11 *= scaleVector.y;
    this.m22 *= scaleVector.z;
  }

  translate(translationVector = new Vector3()) {
    this.m30 += translationVector.x;
    this.m31 += translationVector.y;
    this.m32 += translationVector.z;
  }
}

exports.Matrix4 = Matrix4;
