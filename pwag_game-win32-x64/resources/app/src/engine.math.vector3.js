class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  length(){
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  normalize() {
    const l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x = this.x / l;
    this.y = this.y / l;
    this.z = this.z / l;
    return this;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  /**
   * @param {Vector3} vector
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }

  /**
   * @param {Vector3} vector
   */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }

  /**
   * @param {Number} value
   */
  scale(value) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }

  /**
   *
   * @param {Vector3} vector3
   */
  dot(vector3) {
    return this.x * vector3.x + this.y * vector3.y + this.z * vector3.z;
  }

  /**
   *
   * @param {Vector3} vector3
   */
  isEqual(vector3) {
    return this.x === vector3.x && this.y === vector3.y && this.z === vector3.z;
  }

  static up = new Vector3(0, 1, 0);
  static right = new Vector3(1, 0, 0);
  static forward = new Vector3(0, 0, -1);
}

exports.Vector3 = Vector3;
