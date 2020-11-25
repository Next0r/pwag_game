/**
 * Represents vector with three components x, y and z
 */
class Vector3 {
  /**
   * Creates new vector3 instance
   * @param {number} x value of first vector element
   * @param {number} y value of second vector element
   * @param {number} z value of third vector element
   */
  constructor(x = 0, y = 0, z = 0) {
    /**
     * Value of first vector element
     * @type {number}
     */
    this.x = x;
    /**
     * Value of second vector element
     * @type {number}
     */
    this.y = y;
    /**
     * Value of third vector element
     * @type {number}
     */
    this.z = z;
  }

  /**
   * Allows to acquire length of this vector
   * @returns {number}
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Creates new three element vector from this one
   * @returns {Vector3}
   */
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Changes values of this vector so it's length is equal to 1, this method does
   * NOT work on copy, consider using clone before
   * @returns {Vector3} self reference for easier method chaining
   */
  normalize() {
    const l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x = this.x / l;
    this.y = this.y / l;
    this.z = this.z / l;
    return this;
  }

  /**
   * Returns array containing x, y and z components of this vector
   * @returns {number[]}
   */
  toArray() {
    return [this.x, this.y, this.z];
  }

  /**
   * Adds given vector to this one, this method does NOT work on copy, consider
   * calling clone before
   * @param {Vector3} vector vector on the right side of addition
   * @returns {Vector3} self reference for easier method chaining
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }

  /**
   * Subtracts given vector from this one, this method does NOT work on copy, consider
   * calling clone before
   * @param {Vector3} vector vector on the right side of subtraction
   * @returns {Vector3} self reference for easier method chaining
   */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }

  /**
   * Scales this vector by scalar value, what can be described as multiplication of
   * each component by given scalar, this method does NOT work on copy, consider
   * calling clone before
   * @param {number} value scalar value on the right side of multiplication
   * @returns {Vector3} self reference for easier method chaining
   */
  scale(value) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }

  /**
   * Returns dot product of this vector and vector given
   * @param {Vector3} vector3 vector on the right side of dot operation
   * @returns {number} dot product value
   */
  dot(vector3) {
    return this.x * vector3.x + this.y * vector3.y + this.z * vector3.z;
  }

  /**
   * Allows to compare two vectors
   * @param {Vector3} vector3 vector that this one should be compared to
   * @returns {boolean} which is true if vectors are equal
   */
  isEqual(vector3) {
    return this.x === vector3.x && this.y === vector3.y && this.z === vector3.z;
  }

  /**
   * Represents OpenGL up vector [0, 1, 0]
   * @type {Vector3}
   */
  static up = new Vector3(0, 1, 0);
  /**
   * Represents OpenGL right vector [1, 0, 0]
   * @type {Vector3}
   */
  static right = new Vector3(1, 0, 0);
  /**
   * Represents OpenGL forward vector [0, 0, -1], remember that z axis is heading
   * inside camera in OpenGL coordinates system
   * @type {Vector3}
   */
  static forward = new Vector3(0, 0, -1);
}

exports.Vector3 = Vector3;
