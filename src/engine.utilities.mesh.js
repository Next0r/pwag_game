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

  getMapArray() {
    // get order of mapping coordinates
    const indices = [];
    for (let element of this.vertices) {
      if (element[this.mapOffset] !== undefined) {
        indices.push(element[this.mapOffset]);
      }
    }

    // create array of coordinates with acquired order
    const outArray = [];
    for (let index of indices) {
      outArray.push(...this.map[index], 0);
    }

    return outArray;
  }

  getNormalsArray() {
    const indices = this.getNormalIndexArray();
    const outputArray = [];
    for (let index of indices) {
      outputArray.push(...this.normals[index], 0);
    }

    return outputArray;
  }

  getPositionsArray() {
    const indices = this.getPositionIndexArray();
    const outputArray = [];
    for (let index of indices) {
      outputArray.push(...this.positions[index], 1);
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
