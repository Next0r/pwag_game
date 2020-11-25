/**
 * Represents vector containing four components x, y, z and w
 */
class Vector4 {
  /**
   * Creates new vector 4 instance, default new vector represents
   * point in 3D space, so it's w component is equal to 1
   * @param {number} x first component of vector
   * @param {number} y second component of vector
   * @param {number} z third component of vector
   * @param {number} w fourth component of vector
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    /**
     * First component of vector
     * @type {number}
     */
    this.x = x;
    /**
     * Second component of vector
     * @type {number}
     */
    this.y = y;
    /**
     * Third component of vector
     * @type {number}
     */
    this.z = z;
    /**
     * Fourth component of vector
     * @type {number}
     */
    this.w = w;
  }

  /**
   * Changes values of this vector so it's length is equal to 1, this method does
   * NOT work on copy, consider using clone before
   * @returns {Vector4} self reference for easier method chaining
   */
  normalize() {
    const l = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
    this.x = this.x / l;
    this.y = this.y / l;
    this.z = this.z / l;
    this.w = this.w / l;
    return this;
  }

  /**
   * Subtracts given vector from this one, this method does NOT work on copy, consider
   * calling clone before
   * @param {Vector4} vector4 vector on the right side of subtraction
   * @returns {Vector4} self reference for easier method chaining
   */
  subtract(vector4) {
    this.x -= vector4.x;
    this.y -= vector4.y;
    this.z -= vector4.z;
    this.w -= vector4.w;
    return this;
  }

  /**
   * Returns cross product of this vector and vector given, this operation returns
   * vector in 3D space, so it's w element is equal to 0
   * @param {Vector4} vector4 vector on the right side of dot operation
   * @returns {Vector4} representation of cross product
   */
  cross(vector4) {
    const newVector = new Vector4();
    newVector.x = this.y * vector4.z - this.z * vector4.y;
    newVector.y = this.z * vector4.x - this.x * vector4.z;
    newVector.z = this.x * vector4.y - this.y * vector4.x;
    newVector.w = 0;
    return newVector;
  }

  /**
   * Returns dot product of this vector and vector given
   * @param {Vector4} vector4 vector on the right side of dot operation
   * @returns {number} dot product value
   */
  dot(vector4) {
    return (
      this.x * vector4.x +
      this.y * vector4.y +
      this.z * vector4.z +
      this.w * vector4.w
    );
  }

  /**
   * Returns array containing x, y, z and w components of this vector
   * @returns {number[]} array of vector components
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * Allows to compare two vectors
   * @param {Vector4} vector4 vector that this one should be compared to
   * @returns {boolean} true if vectors are equal
   */
  isEqual(vector4) {
    return (
      this.x === vector4.x &&
      this.y === vector4.y &&
      this.z === vector4.z &&
      this.w === vector4.w
    );
  }
}

exports.Vector4 = Vector4;
