const { Vector3 } = require("./engine.math.vector3");

class AmbientLight {
  constructor() {
    this.color = new Vector3(1, 1, 1);
    this.value = 0.1;
  }
}

exports.AmbientLight = AmbientLight;
