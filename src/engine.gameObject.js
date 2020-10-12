const { Transform } = require("./engine.gameObject.transform");
const { ProgramInfo } = require("./engine.shader.programInfo");
const { Mesh } = require("./engine.utilities.mesh");
const { VertexInfo } = require("./engine.vertexInfo");

class GameObject {
  constructor() {
    this.transform = new Transform();
    this.mesh = new Mesh();
    this.vertexInfo = new VertexInfo(this);
    this.programInfo = new ProgramInfo();
  }
}

exports.GameObject = GameObject;
