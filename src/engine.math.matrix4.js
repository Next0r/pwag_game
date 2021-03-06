const { Vector3 } = require("./engine.math.vector3");
const { Vector4 } = require("./engine.math.vector4");

/**
 * Matrix containing four rows and four columns, fields of matrix are named in
 * m<row><column> fashion
 */
class Matrix4 {
  /**
   * Creates new 4 by 4 matrix
   */
  constructor() {
    /**
     * First row first column value
     * @type {number}
     */
    this.m00 = 1;
    /**
     * Second row first column value
     * @type {number}
     */
    this.m10 = 0;
    /**
     * Third row first column value
     * @type {number}
     */
    this.m20 = 0;
    /**
     * Fourth row first column value
     * @type {number}
     */
    this.m30 = 0;
    /**
     * First row second column value
     * @type {number}
     */
    this.m01 = 0;
    /**
     * Second row second column value
     * @type {number}
     */
    this.m11 = 1;
    /**
     * Third row second column value
     * @type {number}
     */
    this.m21 = 0;
    /**
     * Fourth row second column value
     * @type {number}
     */
    this.m31 = 0;
    /**
     * First row third column value
     * @type {number}
     */
    this.m02 = 0;
    /**
     * Second row third column value
     * @type {number}
     */
    this.m12 = 0;
    /**
     * Third row third column value
     * @type {number}
     */
    this.m22 = 1;
    /**
     * Fourth row third column value
     * @type {number}
     */
    this.m32 = 0;
    /**
     * First row fourth column value
     * @type {number}
     */
    this.m03 = 0;
    /**
     * Second row fourth column value
     * @type {number}
     */
    this.m13 = 0;
    /**
     * Third row fourth column value
     * @type {number}
     */
    this.m23 = 0;
    /**
     * Fourth row fourth column value
     * @type {number}
     */
    this.m33 = 1;
  }

  /**
   * Allows to acquire vector that represents matrix rotation as roll, yaw and pitch in degrees
   * @returns {Vector3}
   */
  getRotation() {
    const f = 180 / Math.PI;
    const yaw = Math.atan2(-this.m20, this.m00);
    const pitch = Math.asin(this.m10);
    const roll = Math.atan2(-this.m12, this.m11);
    return new Vector3(roll * f, yaw * f, pitch * f);
  }

  /**
   * Allows to acquire vector that represents matrix scaling in x, y and z axes
   * @returns {Vector3}
   */
  getScale() {
    const sx = Math.sqrt(
      this.m00 * this.m00 + this.m01 * this.m01 + this.m02 * this.m02
    );
    const sy = Math.sqrt(
      this.m10 * this.m10 + this.m11 * this.m11 + this.m12 * this.m12
    );
    const sz = Math.sqrt(
      this.m20 * this.m20 + this.m21 * this.m21 + this.m22 * this.m22
    );
    return new Vector3(sx, sy, sz);
  }

  /**
   * Multiplies matrix by scalar value (each cell * scalar)
   * @param {number} scalar
   * @returns {Matrix4} self reference for easier method chaining
   */
  scalarMultiply(scalar) {
    this.m00 *= scalar;
    this.m01 *= scalar;
    this.m02 *= scalar;
    this.m03 *= scalar;
    this.m10 *= scalar;
    this.m11 *= scalar;
    this.m12 *= scalar;
    this.m13 *= scalar;
    this.m20 *= scalar;
    this.m21 *= scalar;
    this.m22 *= scalar;
    this.m23 *= scalar;
    this.m30 *= scalar;
    this.m31 *= scalar;
    this.m32 *= scalar;
    this.m33 *= scalar;
    return this;
  }

  /**
   * Allows to acquire three values from top of last column as position vector
   * @returns {Vector3}
   */
  getPosition() {
    return new Vector3(this.m03, this.m13, this.m23);
  }

  /**
   * Allows to acquire three values from top of third column as forward vector
   * @returns {Vector3}
   */
  forward() {
    return new Vector3(-this.m02, -this.m12, -this.m22);
  }

  /**
   * Allows to acquire three values from top of second column as up vector
   * @returns {Vector3}
   */
  up() {
    return new Vector3(this.m01, this.m11, this.m21);
  }

  /**
   * Allows to acquire three values from top of first column as right vector
   * @returns {Vector3}
   */
  right() {
    return new Vector3(this.m00, this.m10, this.m20);
  }

  /**
   * Copies values from matrix given into this matrix
   * @param {Matrix4} matrix
   * @returns {Matrix4} self reference for easier method chaining
   */
  fromMatrix4(matrix) {
    const m = this;
    const n = matrix;
    m.m00 = n.m00;
    m.m10 = n.m10;
    m.m20 = n.m20;
    m.m30 = n.m30;

    m.m01 = n.m01;
    m.m11 = n.m11;
    m.m21 = n.m21;
    m.m31 = n.m31;

    m.m02 = n.m02;
    m.m12 = n.m12;
    m.m22 = n.m22;
    m.m32 = n.m32;

    m.m03 = n.m03;
    m.m13 = n.m13;
    m.m23 = n.m23;
    m.m33 = n.m33;
    return this;
  }

  /**
   * Creates and returns new matrix that is clone of this matrix
   *  @returns {Matrix4}
   */
  clone() {
    const m = new Matrix4();
    const n = this;
    m.m00 = n.m00;
    m.m10 = n.m10;
    m.m20 = n.m20;
    m.m30 = n.m30;

    m.m01 = n.m01;
    m.m11 = n.m11;
    m.m21 = n.m21;
    m.m31 = n.m31;

    m.m02 = n.m02;
    m.m12 = n.m12;
    m.m22 = n.m22;
    m.m32 = n.m32;

    m.m03 = n.m03;
    m.m13 = n.m13;
    m.m23 = n.m23;
    m.m33 = n.m33;

    return m;
  }

  /**
   * Puts array values into this matrix, array should be organized in
   * [col0, col1, col2, col3] fashion
   * @returns {Matrix4} self reference for easier method chaining
   */
  fromArray(array = []) {
    const a = array;
    const m = this;
    m.m00 = a[0];
    m.m10 = a[1];
    m.m20 = a[2];
    m.m30 = a[3];
    m.m01 = a[4];
    m.m11 = a[5];
    m.m21 = a[6];
    m.m31 = a[7];
    m.m02 = a[8];
    m.m12 = a[9];
    m.m22 = a[10];
    m.m32 = a[11];
    m.m03 = a[12];
    m.m13 = a[13];
    m.m23 = a[14];
    m.m33 = a[15];
    return this;
  }

  /**
   * Creates array from this matrix, this array organized in
   * [col0, col1, col2, col3] fashion
   * @returns {number[]}
   */
  toArray() {
    return [
      this.m00,
      this.m10,
      this.m20,
      this.m30,
      this.m01,
      this.m11,
      this.m21,
      this.m31,
      this.m02,
      this.m12,
      this.m22,
      this.m32,
      this.m03,
      this.m13,
      this.m23,
      this.m33,
    ];
  }

  /**
   * Turns this matrix into identity matrix (ones on matrix diagonal)
   * @returns {Matrix4} self reference for easier method chaining
   */
  identity() {
    this.m00 = 1;
    this.m10 = 0;
    this.m20 = 0;
    this.m30 = 0;
    this.m01 = 0;
    this.m11 = 1;
    this.m21 = 0;
    this.m31 = 0;
    this.m02 = 0;
    this.m12 = 0;
    this.m22 = 1;
    this.m32 = 0;
    this.m03 = 0;
    this.m13 = 0;
    this.m23 = 0;
    this.m33 = 1;
    return this;
  }

  /**
   * @typedef {Object} ProjectionOptions
   * @property {number} fov filed of view in degrees
   * @property {number} aspect screen aspect e.g. 16/9
   * @property {number} near near clipping plane value, objects closer than this value will not be projected
   * @property {number} far far clipping plane value, objects farther than this value will not be projected
   */

  /**
   * Turns this matrix into projection matrix
   * @param {ProjectionOptions} param0 object containing fov, aspect, far and near clipping plane values
   * @returns {Matrix4} self reference for easier method chaining
   */
  projection({ fov = 45, aspect = 1.333, near = 0.1, far = 100 } = {}) {
    const tan = Math.tan((fov * Math.PI) / 360);
    this.identity();
    this.m00 = 1 / (aspect * tan);
    this.m11 = 1 / tan;
    this.m22 = -(far + near) / (far - near);
    this.m23 = -(2 * far * near) / (far - near);
    this.m32 = -1;
    this.m33 = 0;
    return this;
  }

  /**
   * @typedef {Object} OrthoOptions
   * @property {number} fov filed of view in degrees
   * @property {number} near near clipping plane value, objects closer than this value will not be projected
   * @property {number} far far clipping plane value, objects farther than this value will not be projected
   */

  /**
   * Turns this matrix into ortho projection matrix (without perspective)
   * @param {OrthoOptions} param0 object containing aspect, near and far clipping plane values
   * @returns {Matrix4} self reference for easier method chaining
   */
  ortho({ aspect = 1.333, near = 0.1, far = 100 }) {
    this.m00 = 1 / aspect;
    this.m11 = 1;
    this.m22 = -2 / (far - near);
    this.m03 = 0;
    this.m13 = 0;
    this.m23 = -(near + far) / (far - near);
    return this;
  }

  /**
   * Multiplies this matrix by matrix given, current values will be lost, consider cloning this matrix first
   * @param {Matrix4} matrix 4 by 4 matrix that should be on right side of multiplication (not affected)
   * @returns {Matrix4} self reference for easier method chaining
   */
  multiply(matrix) {
    const n = this.clone();
    const m = matrix;

    this.m00 = n.m00 * m.m00 + n.m01 * m.m10 + n.m02 * m.m20 + n.m03 * m.m30;
    this.m01 = n.m00 * m.m01 + n.m01 * m.m11 + n.m02 * m.m21 + n.m03 * m.m31;
    this.m02 = n.m00 * m.m02 + n.m01 * m.m12 + n.m02 * m.m22 + n.m03 * m.m32;
    this.m03 = n.m00 * m.m03 + n.m01 * m.m13 + n.m02 * m.m23 + n.m03 * m.m33;

    this.m10 = n.m10 * m.m00 + n.m11 * m.m10 + n.m12 * m.m20 + n.m13 * m.m30;
    this.m11 = n.m10 * m.m01 + n.m11 * m.m11 + n.m12 * m.m21 + n.m13 * m.m31;
    this.m12 = n.m10 * m.m02 + n.m11 * m.m12 + n.m12 * m.m22 + n.m13 * m.m32;
    this.m13 = n.m10 * m.m03 + n.m11 * m.m13 + n.m12 * m.m23 + n.m13 * m.m33;

    this.m20 = n.m20 * m.m00 + n.m21 * m.m10 + n.m22 * m.m20 + n.m23 * m.m30;
    this.m21 = n.m20 * m.m01 + n.m21 * m.m11 + n.m22 * m.m21 + n.m23 * m.m31;
    this.m22 = n.m20 * m.m02 + n.m21 * m.m12 + n.m22 * m.m22 + n.m23 * m.m32;
    this.m23 = n.m20 * m.m03 + n.m21 * m.m13 + n.m22 * m.m23 + n.m23 * m.m33;

    this.m30 = n.m30 * m.m00 + n.m31 * m.m10 + n.m32 * m.m20 + n.m33 * m.m30;
    this.m31 = n.m30 * m.m01 + n.m31 * m.m11 + n.m32 * m.m21 + n.m33 * m.m31;
    this.m32 = n.m30 * m.m02 + n.m31 * m.m12 + n.m32 * m.m22 + n.m33 * m.m32;
    this.m33 = n.m30 * m.m03 + n.m31 * m.m13 + n.m32 * m.m23 + n.m33 * m.m33;
    return this;
  }

  /**
   * Multiplies this matrix by given vector
   * @param {Vector4} vector vector on the right side of multiplication (not affected during multiplication)
   * @returns {Vector4} result of multiplication
   */
  vectorMultiply(vector) {
    const x =
      this.m00 * vector.x +
      this.m01 * vector.y +
      this.m02 * vector.z +
      this.m03 * vector.w;
    const y =
      this.m10 * vector.x +
      this.m11 * vector.y +
      this.m12 * vector.z +
      this.m13 * vector.w;
    const z =
      this.m20 * vector.x +
      this.m21 * vector.y +
      this.m22 * vector.z +
      this.m23 * vector.w;
    const w =
      this.m30 * vector.x +
      this.m31 * vector.y +
      this.m32 * vector.z +
      this.m33 * vector.w;
    return new Vector4(x, y, z, w);
  }

  /**
   * Rotates this matrix around give axis and with given angle in degrees
   * @param {Vector3} axis axis vector e.g. [1, 0, 0]
   * @param {number} angle angle in degrees
   * @returns {Matrix4} self reference for easier method chaining
   */
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

    const o00 = this.m00 * r00 + this.m01 * r01 + this.m02 * r02;
    const o10 = this.m00 * r10 + this.m01 * r11 + this.m02 * r12;
    const o20 = this.m00 * r20 + this.m01 * r21 + this.m02 * r22;

    const o01 = this.m10 * r00 + this.m11 * r01 + this.m12 * r02;
    const o11 = this.m10 * r10 + this.m11 * r11 + this.m12 * r12;
    const o21 = this.m10 * r20 + this.m11 * r21 + this.m12 * r22;

    const o02 = this.m20 * r00 + this.m21 * r01 + this.m22 * r02;
    const o12 = this.m20 * r10 + this.m21 * r11 + this.m22 * r12;
    const o22 = this.m20 * r20 + this.m21 * r21 + this.m22 * r22;

    this.m00 = o00;
    this.m10 = o01;
    this.m20 = o02;

    this.m01 = o10;
    this.m11 = o11;
    this.m21 = o12;

    this.m02 = o20;
    this.m12 = o21;
    this.m22 = o22;

    return this;
  }

  /**
   * Scales this matrix by given vector
   * @param {Vector3} scaleVector vector that represents target matrix scale
   * @returns {Matrix4} self reference for easier method chaining
   */
  scale(scaleVector = new Vector3()) {
    const n = new Matrix4();
    n.m00 *= scaleVector.x;
    n.m11 *= scaleVector.y;
    n.m22 *= scaleVector.z;

    const sx = scaleVector.x;
    const sy = scaleVector.y;
    const sz = scaleVector.z;

    const o00 = this.m00 * sx;
    const o10 = this.m01 * sy;
    const o20 = this.m02 * sz;

    const o01 = this.m10 * sx;
    const o11 = this.m11 * sy;
    const o21 = this.m12 * sz;

    const o02 = this.m20 * sx;
    const o12 = this.m21 * sy;
    const o22 = this.m22 * sz;

    this.m00 = o00;
    this.m01 = o10;
    this.m02 = o20;

    this.m10 = o01;
    this.m11 = o11;
    this.m12 = o21;

    this.m20 = o02;
    this.m21 = o12;
    this.m22 = o22;
    return this;
  }

  /**
   * Rotates this matrix by given x, y and z rotations in degrees stored in vector, this
   * function has predefined rotation order and is less flexible than combining multiple rotations
   * @param {Vector3} rotation rotation vector e.g. [45, 30, 0]
   * @returns {Matrix4} self reference for easier method chaining
   */
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

    const o00 = this.m00 * r00 + this.m01 * r01 + this.m02 * r02;
    const o10 = this.m00 * r10 + this.m01 * r11 + this.m02 * r12;
    const o20 = this.m00 * r20 + this.m01 * r21 + this.m02 * r22;

    const o01 = this.m10 * r00 + this.m11 * r01 + this.m12 * r02;
    const o11 = this.m10 * r10 + this.m11 * r11 + this.m12 * r12;
    const o21 = this.m10 * r20 + this.m11 * r21 + this.m12 * r22;

    const o02 = this.m20 * r00 + this.m21 * r01 + this.m22 * r02;
    const o12 = this.m20 * r10 + this.m21 * r11 + this.m22 * r12;
    const o22 = this.m20 * r20 + this.m21 * r21 + this.m22 * r22;

    this.m00 = o00;
    this.m10 = o01;
    this.m20 = o02;

    this.m01 = o10;
    this.m11 = o11;
    this.m21 = o12;

    this.m02 = o20;
    this.m12 = o21;
    this.m22 = o22;
    return this;
  }

  /**
   * Translates this matrix by given vector (changes matrix position)
   * @param {Vector3} translationVector translation vector e.g. [10, 0, 0]
   * @returns {Matrix4} self reference for easier method chaining
   */
  translate(translationVector = new Vector3()) {
    this.m03 += translationVector.x;
    this.m13 += translationVector.y;
    this.m23 += translationVector.z;
    return this;
  }

  /**
   * Calculates determinant of this matrix
   * @returns {number}
   */
  determinant() {
    return (
      this.m00 *
        _mat3Det(
          this.m11,
          this.m12,
          this.m13,
          this.m21,
          this.m22,
          this.m23,
          this.m31,
          this.m32,
          this.m33
        ) -
      this.m10 *
        _mat3Det(
          this.m01,
          this.m02,
          this.m03,
          this.m21,
          this.m22,
          this.m23,
          this.m31,
          this.m32,
          this.m33
        ) +
      this.m20 *
        _mat3Det(
          this.m01,
          this.m02,
          this.m03,
          this.m11,
          this.m12,
          this.m13,
          this.m31,
          this.m32,
          this.m33
        ) -
      this.m30 *
        _mat3Det(
          this.m01,
          this.m02,
          this.m03,
          this.m11,
          this.m12,
          this.m13,
          this.m21,
          this.m22,
          this.m23
        )
    );
  }

  /**
   * Creates adjoint matrix from this matrix (this matrix remains unaffected)
   * @returns {Matrix4} adjoint matrix
   */
  adjoint() {
    const m = new Matrix4();
    m.m00 = _mat3Det(
      this.m11,
      this.m12,
      this.m13,
      this.m21,
      this.m22,
      this.m23,
      this.m31,
      this.m32,
      this.m33
    );
    m.m10 = -_mat3Det(
      this.m01,
      this.m02,
      this.m03,
      this.m21,
      this.m22,
      this.m23,
      this.m31,
      this.m32,
      this.m33
    );
    m.m20 = _mat3Det(
      this.m01,
      this.m02,
      this.m03,
      this.m11,
      this.m12,
      this.m13,
      this.m31,
      this.m32,
      this.m33
    );
    m.m30 = -_mat3Det(
      this.m01,
      this.m02,
      this.m03,
      this.m11,
      this.m12,
      this.m13,
      this.m21,
      this.m22,
      this.m23
    );

    m.m01 = -_mat3Det(
      this.m10,
      this.m12,
      this.m13,
      this.m20,
      this.m22,
      this.m23,
      this.m30,
      this.m32,
      this.m33
    );
    m.m11 = _mat3Det(
      this.m00,
      this.m02,
      this.m03,
      this.m20,
      this.m22,
      this.m23,
      this.m30,
      this.m32,
      this.m33
    );
    m.m21 = -_mat3Det(
      this.m00,
      this.m02,
      this.m03,
      this.m10,
      this.m12,
      this.m13,
      this.m30,
      this.m32,
      this.m33
    );
    m.m31 = _mat3Det(
      this.m00,
      this.m02,
      this.m03,
      this.m10,
      this.m12,
      this.m13,
      this.m20,
      this.m22,
      this.m23
    );

    m.m02 = _mat3Det(
      this.m10,
      this.m11,
      this.m13,
      this.m20,
      this.m21,
      this.m23,
      this.m30,
      this.m31,
      this.m33
    );
    m.m12 = -_mat3Det(
      this.m00,
      this.m01,
      this.m03,
      this.m20,
      this.m21,
      this.m23,
      this.m30,
      this.m31,
      this.m33
    );
    m.m22 = _mat3Det(
      this.m00,
      this.m01,
      this.m03,
      this.m10,
      this.m11,
      this.m13,
      this.m30,
      this.m31,
      this.m33
    );
    m.m32 = -_mat3Det(
      this.m00,
      this.m01,
      this.m03,
      this.m10,
      this.m11,
      this.m13,
      this.m20,
      this.m21,
      this.m23
    );

    m.m03 = -_mat3Det(
      this.m10,
      this.m11,
      this.m12,
      this.m20,
      this.m21,
      this.m22,
      this.m30,
      this.m31,
      this.m32
    );
    m.m13 = _mat3Det(
      this.m00,
      this.m01,
      this.m02,
      this.m20,
      this.m21,
      this.m22,
      this.m30,
      this.m31,
      this.m32
    );
    m.m23 = -_mat3Det(
      this.m00,
      this.m01,
      this.m02,
      this.m10,
      this.m11,
      this.m12,
      this.m30,
      this.m31,
      this.m32
    );
    m.m33 = _mat3Det(
      this.m00,
      this.m01,
      this.m02,
      this.m10,
      this.m11,
      this.m12,
      this.m20,
      this.m21,
      this.m22
    );

    return m.transpose();
  }

  /**
   * Performs transpose operation on this matrix
   * @returns {Matrix4} self reference for easier method chaining
   */
  transpose() {
    const m = this.clone();
    this.m01 = m.m10;
    this.m02 = m.m20;
    this.m03 = m.m30;
    this.m10 = m.m01;
    this.m12 = m.m21;
    this.m13 = m.m31;
    this.m20 = m.m02;
    this.m21 = m.m12;
    this.m23 = m.m32;
    this.m30 = m.m03;
    this.m31 = m.m13;
    this.m32 = m.m23;
    return this;
  }

  /**
   * Inverts this matrix
   * @returns {Matrix4} self reference for easier method chaining
   */
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

/**
 * Helper method used to calculate determinant of 3 by 3 matrix
 * @param {number} m00 first row first column value
 * @param {number} m10 second row first column value
 * @param {number} m20 third row first column value
 * @param {number} m01 first row second column value
 * @param {number} m11 second row second column value
 * @param {number} m21 third row second column value
 * @param {number} m02 first row third column value
 * @param {number} m12 second row third column value
 * @param {number} m22 third row third column value
 * @returns {number} determinant of given 3 by 3 matrix
 */
const _mat3Det = (m00, m10, m20, m01, m11, m21, m02, m12, m22) => {
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
