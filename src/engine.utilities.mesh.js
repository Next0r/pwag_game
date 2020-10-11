class Mesh {
  constructor(name = "") {
    this.name = name;
    this.positions = [];
    this.normals = [];
    this.map = [];
    this.colors = [];
    this.indexOffset = 0;
    this.normalOffset = 1;
    this.mapOffset = 2;
    this.colorOffset = 3;
    this.vertices = [];
  }

  getNormalsArray() {
    const indices = this.getNormalIndexArray();
    const outputArray = [];
    for (let index of indices) {
      outputArray.push(...this.normals[index]);
    }

    return outputArray;
  }

  getPositionsArray() {
    const indices = this.getPositionIndexArray();
    const outputArray = [];
    for (let index of indices) {
      outputArray.push(...this.positions[index]);
    }

    return outputArray;
  }

  getColorsArray() {
    const outputArray = [];
    for (let color of this.colors) {
      outputArray.push(...color);
    }
    return outputArray;
  }

  getPositionIndexArray() {
    const outputArray = [];
    for (let vertex of this.vertices) {
      outputArray.push(vertex[this.indexOffset]);
    }
    return outputArray;
  }

  getNormalIndexArray() {
    const outputArray = [];
    for (let vertex of this.vertices) {
      outputArray.push(vertex[this.normalOffset]);
    }
    return outputArray;
  }
}

exports.Mesh = Mesh;
