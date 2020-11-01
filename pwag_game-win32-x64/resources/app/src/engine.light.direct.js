const { Vector3 } = require("./engine.math.vector3");

class DirectLight {
  constructor() {
    this.direction = new Vector3(1, -1, -1).normalize();
    this.color = new Vector3(1, 1, 1);
    this.value = 1;
  }
}

exports.DirectLight = DirectLight;
