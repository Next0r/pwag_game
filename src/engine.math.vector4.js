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
}

exports.Vector4 = Vector4;
