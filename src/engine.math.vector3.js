class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
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
}

exports.Vector3 = Vector3;
