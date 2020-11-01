const { Projection } = require("./engine.camera.projection");
const { Transform } = require("./engine.gameObject.transform");

class Camera {
  constructor() {
    this.transform = new Transform();
    this.projection = new Projection();
  }
}

exports.Camera = Camera;
