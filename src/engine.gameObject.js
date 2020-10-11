const { Transform } = require("./engine.gameObject.transform");
const { Mesh } = require("./engine.utilities.mesh");

class GameObject {
  constructor() {
    this.transform = new Transform();
    this.mesh = new Mesh();
  }
}

exports.GameObject = GameObject;
