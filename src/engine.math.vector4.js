class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  normalize() {
    const l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    this.x = this.x / l;
    this.y = this.y / l;
    this.z = this.z / l;
    this.w = this.w / l;
    return this;
  }

  /**
   * @param {Vector4} vector4
   */
  subtract(vector4) {
    this.x -= vector4.x;
    this.y -= vector4.y;
    this.z -= vector4.z;
    this.w -= vector4.w;
    return this;
  }

  /**
   * @param {Vector4} vector4
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
   * @param {Vector4} vector4
   */
  dot(vector4) {
    return this.x * vector4.x + this.y * vector4.y + this.z * vector4.z + this.w * vector4.w;
  }
}

exports.Vector4 = Vector4;
