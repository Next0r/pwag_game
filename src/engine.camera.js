const { Projection } = require("./engine.camera.projection");
const { Transform } = require("./engine.gameObject.transform");
const { Matrix4 } = require("./engine.math.matrix4");

class Camera {
  constructor() {
    this.transform = new Transform();
    this.projection = new Projection();
  }


}

exports.Camera = Camera;
