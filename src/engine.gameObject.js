const { Transform } = require("./engine.gameObject.transform");
const { Material } = require("./engine.material");
const { Mesh } = require("./engine.utilities.mesh");

class GameObject {
  constructor() {
    this.transform = new Transform();
    this.mesh = new Mesh();
    this.material = new Material();
  }
}

exports.GameObject = GameObject;
