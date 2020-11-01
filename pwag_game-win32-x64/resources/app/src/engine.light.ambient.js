const { Vector3 } = require("./engine.math.vector3");

class AmbientLight {
  constructor() {
    this.color = new Vector3(0.65, 0.8, 1);
    this.value = 0.2;
  }
}

exports.AmbientLight = AmbientLight;
