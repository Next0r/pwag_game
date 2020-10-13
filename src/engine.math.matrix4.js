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
    this.m20 = n.m00 * m.m20 + n.m10 * m.m21 + n.m20 * m.m22 + n.m30 * m.m23;
    this.m30 = n.m00 * m.m30 + n.m10 * m.m31 + n.m20 * m.m32 + n.m30 * m.m33;

    this.m01 = n.m01 * m.m00 + n.m11 * m.m01 + n.m21 * m.m02 + n.m31 * m.m03;
    this.m11 = n.m01 * m.m10 + n.m11 * m.m11 + n.m21 * m.m12 + n.m31 * m.m13;
    this.m21 = n.m01 * m.m20 + n.m11 * m.m21 + n.m21 * m.m22 + n.m31 * m.m23;
    this.m31 = n.m01 * m.m30 + n.m11 * m.m31 + n.m21 * m.m32 + n.m31 * m.m33;

    this.m02 = n.m02 * m.m00 + n.m12 * m.m01 + n.m22 * m.m02 + n.m32 * m.m03;
    this.m12 = n.m02 * m.m10 + n.m12 * m.m11 + n.m22 * m.m12 + n.m32 * m.m13;
    this.m22 = n.m02 * m.m20 + n.m12 * m.m21 + n.m22 * m.m22 + n.m32 * m.m23;
    this.m32 = n.m02 * m.m30 + n.m12 * m.m31 + n.m22 * m.m32 + n.m32 * m.m33;

    this.m03 = n.m03 * m.m00 + n.m13 * m.m01 + n.m23 * m.m02 + n.m33 * m.m03;
    this.m13 = n.m03 * m.m10 + n.m13 * m.m11 + n.m23 * m.m12 + n.m33 * m.m13;
    this.m23 = n.m03 * m.m20 + n.m13 * m.m21 + n.m23 * m.m22 + n.m33 * m.m23;
    this.m33 = n.m03 * m.m30 + n.m13 * m.m31 + n.m23 * m.m32 + n.m33 * m.m33;
    return this;
  }

  rotate(axis = new Vector3(1, 0, 0), angle = 0) {
    const u = axis.normalize();

    const x = u.x;
    const y = u.y;
    const z = u.z;

    const r = (angle * Math.PI) / 180;
    const s = Math.sin(r);
    const c = Math.cos(r);
    const t = 1 - c;

    // 1st row
    const r00 = t * x * x + c;
    const r10 = t * x * y - s * z;
    const r20 = t * x * z + s * y;
    // 2nd row
    const r01 = t * x * y + s * z;
    const r11 = t * y * y + c;
    const r21 = t * y * z - s * x;
    // 3rd row
    const r02 = t * x * z - s * y;
    const r12 = t * y * z + s * x;
    const r22 = t * z * z + c;

    const o00 = this.m00 * r00 + this.m10 * r01 + this.m20 * r02;
    const o10 = this.m00 * r10 + this.m10 * r11 + this.m20 * r12;
    const o20 = this.m00 * r20 + this.m10 * r21 + this.m20 * r22;

    const o01 = this.m01 * r00 + this.m11 * r01 + this.m21 * r02;
    const o11 = this.m01 * r10 + this.m11 * r11 + this.m21 * r12;
    const o21 = this.m01 * r20 + this.m11 * r21 + this.m21 * r22;

    const o02 = this.m02 * r00 + this.m12 * r01 + this.m22 * r02;
    const o12 = this.m02 * r10 + this.m12 * r11 + this.m22 * r12;
    const o22 = this.m02 * r20 + this.m12 * r21 + this.m22 * r22;

    this.m00 = o00;
    this.m01 = o01;
    this.m02 = o02;

    this.m10 = o10;
    this.m11 = o11;
    this.m12 = o12;

    this.m20 = o20;
    this.m21 = o21;
    this.m22 = o22;

    return this;
  }

  scale(scaleVector = new Vector3()) {
    const n = new Matrix4();
    n.m00 *= scaleVector.x;
    n.m11 *= scaleVector.y;
    n.m22 *= scaleVector.z;

    const sx = scaleVector.x;
    const sy = scaleVector.y;
    const sz = scaleVector.z;

    const o00 = this.m00 * sx;
    const o10 = this.m10 * sy;
    const o20 = this.m20 * sz;

    const o01 = this.m01 * sx;
    const o11 = this.m11 * sy;
    const o21 = this.m21 * sz;

    const o02 = this.m02 * sx;
    const o12 = this.m12 * sy;
    const o22 = this.m22 * sz;

    this.m00 = o00;
    this.m10 = o10;
    this.m20 = o20;

    this.m01 = o01;
    this.m11 = o11;
    this.m21 = o21;

    this.m02 = o02;
    this.m12 = o12;
    this.m22 = o22;
    return this;
  }

  rotateEuler(rotation = new Vector3()) {
    const t = Math.PI / 180;
    const x = rotation.x * t;
    const y = rotation.y * t;
    const z = rotation.z * t;

    const cosX = Math.cos(x);
    const cosY = Math.cos(y);
    const cosZ = Math.cos(z);
    const sinX = Math.sin(x);
    const sinY = Math.sin(y);
    const sinZ = Math.sin(z);

    const r00 = cosZ * cosY;
    const r10 = cosZ * sinY * sinX - sinZ * cosX;
    const r20 = cosZ * sinY * cosX + sinZ * sinX;
    const r01 = sinZ * cosY;
    const r11 = sinZ * sinY * sinX + cosZ * cosX;
    const r21 = sinZ * sinY * cosX - cosZ * sinX;
    const r02 = -sinY;
    const r12 = cosY * sinX;
    const r22 = cosY * cosX;

    const o00 = this.m00 * r00 + this.m10 * r01 + this.m20 * r02;
    const o10 = this.m00 * r10 + this.m10 * r11 + this.m20 * r12;
    const o20 = this.m00 * r20 + this.m10 * r21 + this.m20 * r22;

    const o01 = this.m01 * r00 + this.m11 * r01 + this.m21 * r02;
    const o11 = this.m01 * r10 + this.m11 * r11 + this.m21 * r12;
    const o21 = this.m01 * r20 + this.m11 * r21 + this.m21 * r22;

    const o02 = this.m02 * r00 + this.m12 * r01 + this.m22 * r02;
    const o12 = this.m02 * r10 + this.m12 * r11 + this.m22 * r12;
    const o22 = this.m02 * r20 + this.m12 * r21 + this.m22 * r22;

    this.m00 = o00;
    this.m01 = o01;
    this.m02 = o02;

    this.m10 = o10;
    this.m11 = o11;
    this.m12 = o12;

    this.m20 = o20;
    this.m21 = o21;
    this.m22 = o22;
    return this;
  }

  translate(translationVector = new Vector3()) {
    this.m30 += translationVector.x;
    this.m31 += translationVector.y;
    this.m32 += translationVector.z;
    return this;
  }

  determinant() {
    return (
      this.m00 *
        mat3Det(
          this.m11,
          this.m21,
          this.m31,
          this.m12,
          this.m22,
          this.m32,
          this.m13,
          this.m23,
          this.m33
        ) -
      this.m01 *
        mat3Det(
          this.m10,
          this.m20,
          this.m30,
          this.m12,
          this.m22,
          this.m32,
          this.m13,
          this.m23,
          this.m33
        ) +
      this.m02 *
        mat3Det(
          this.m10,
          this.m20,
          this.m30,
          this.m11,
          this.m21,
          this.m31,
          this.m13,
          this.m23,
          this.m33
        ) -
      this.m03 *
        mat3Det(
          this.m10,
          this.m20,
          this.m30,
          this.m11,
          this.m21,
          this.m31,
          this.m12,
          this.m22,
          this.m32
        )
    );
  }

  adjoint() {
    const m = new Matrix4();
    m.m00 = mat3Det(
      this.m11,
      this.m21,
      this.m31,
      this.m12,
      this.m22,
      this.m32,
      this.m13,
      this.m23,
      this.m33
    );
    m.m01 = -mat3Det(
      this.m10,
      this.m20,
      this.m30,
      this.m12,
      this.m22,
      this.m32,
      this.m13,
      this.m23,
      this.m33
    );
    m.m02 = mat3Det(
      this.m10,
      this.m20,
      this.m30,
      this.m11,
      this.m21,
      this.m31,
      this.m13,
      this.m23,
      this.m33
    );
    m.m03 = -mat3Det(
      this.m10,
      this.m20,
      this.m30,
      this.m11,
      this.m21,
      this.m31,
      this.m12,
      this.m22,
      this.m32
    );

    m.m10 = -mat3Det(
      this.m01,
      this.m21,
      this.m31,
      this.m02,
      this.m22,
      this.m32,
      this.m03,
      this.m23,
      this.m33
    );
    m.m11 = mat3Det(
      this.m00,
      this.m20,
      this.m30,
      this.m02,
      this.m22,
      this.m32,
      this.m03,
      this.m23,
      this.m33
    );
    m.m12 = -mat3Det(
      this.m00,
      this.m20,
      this.m30,
      this.m01,
      this.m21,
      this.m31,
      this.m03,
      this.m23,
      this.m33
    );
    m.m13 = mat3Det(
      this.m00,
      this.m20,
      this.m30,
      this.m01,
      this.m21,
      this.m31,
      this.m02,
      this.m22,
      this.m32
    );

    m.m20 = mat3Det(
      this.m01,
      this.m11,
      this.m31,
      this.m02,
      this.m12,
      this.m32,
      this.m03,
      this.m13,
      this.m33
    );
    m.m21 = -mat3Det(
      this.m00,
      this.m10,
      this.m30,
      this.m02,
      this.m12,
      this.m32,
      this.m03,
      this.m13,
      this.m33
    );
    m.m22 = mat3Det(
      this.m00,
      this.m10,
      this.m30,
      this.m01,
      this.m11,
      this.m31,
      this.m03,
      this.m13,
      this.m33
    );
    m.m23 = -mat3Det(
      this.m00,
      this.m10,
      this.m30,
      this.m01,
      this.m11,
      this.m31,
      this.m02,
      this.m12,
      this.m32
    );

    m.m30 = -mat3Det(
      this.m01,
      this.m11,
      this.m21,
      this.m02,
      this.m12,
      this.m22,
      this.m03,
      this.m13,
      this.m23
    );
    m.m31 = mat3Det(
      this.m00,
      this.m10,
      this.m20,
      this.m02,
      this.m12,
      this.m22,
      this.m03,
      this.m13,
      this.m23
    );
    m.m32 = -mat3Det(
      this.m00,
      this.m10,
      this.m20,
      this.m01,
      this.m11,
      this.m21,
      this.m03,
      this.m13,
      this.m23
    );
    m.m33 = mat3Det(
      this.m00,
      this.m10,
      this.m20,
      this.m01,
      this.m11,
      this.m21,
      this.m02,
      this.m12,
      this.m22
    );

    return m.transpose();
  }

  transpose() {
    const m = this.clone();
    this.m10 = m.m01;
    this.m20 = m.m02;
    this.m30 = m.m03;
    this.m01 = m.m10;
    this.m21 = m.m12;
    this.m31 = m.m13;
    this.m02 = m.m20;
    this.m12 = m.m21;
    this.m32 = m.m23;
    this.m03 = m.m30;
    this.m13 = m.m31;
    this.m23 = m.m32;
    return this;
  }

  inverse() {
    const invDet = 1 / this.determinant();
    const adjArray = this.adjoint().toArray();
    for (let i = 0; i < adjArray.length; i++) {
      adjArray[i] = adjArray[i] * invDet;
    }
    this.fromArray(adjArray);
    return this;
  }
}

const mat3Det = (m00, m10, m20, m01, m11, m21, m02, m12, m22) => {
  return (
    m00 * m11 * m22 +
    m10 * m21 * m02 +
    m20 * m01 * m12 -
    m20 * m11 * m02 -
    m10 * m01 * m22 -
    m00 * m21 * m12
  );
};

exports.Matrix4 = Matrix4;
