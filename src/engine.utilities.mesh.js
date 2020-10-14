const { compareArrays } = require("./engine.utilities");

class Mesh {
  constructor(name = "") {
    this.name = name;

    this.positions = [];
    this.normals = [];
    this.map = [];
    this.colors = [];

    this.positionOffset = 0;
    this.normalOffset = 1;
    this.mapOffset = 2;
    this.colorOffset = 3;

    this.vertices = [];
    this.reducedVertices = [];
    this.elementArray = [];
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
      outputArray.push(vertex[this.positionOffset]);
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

  createElementArray() {
    const normalRepetitionArray = this.normalOffset !== undefined ? createRepetitionArray(this.normals) : undefined;
    const mapRepetitionArray = this.mapOffset !== undefined ? createRepetitionArray(this.map) : undefined;
    const colorRepetitionArray = this.colorOffset !== undefined ? createRepetitionArray(this.colors) : undefined;

    // create new vertex array containing non-unique values for normal, map and color
    const newVertexArray = [];
    for (let i = 0; i < this.vertices.length; i++) {
      const currentVertex = this.vertices[i];
      const newVertex = [...currentVertex];

      if (this.normalOffset !== undefined) {
        newVertex[this.normalOffset] = normalRepetitionArray[currentVertex[this.normalOffset]];
      }
      if (this.mapOffset !== undefined) {
        newVertex[this.mapOffset] = mapRepetitionArray[currentVertex[this.mapOffset]];
      }
      if (this.colorOffset !== undefined) {
        newVertex[this.colorOffset] = colorRepetitionArray[currentVertex[this.colorOffset]];
      }
      newVertexArray.push(newVertex);
    }

    // copy new vertex array
    const newVertexArrayCopy = [];
    for (let element of newVertexArray) {
      newVertexArrayCopy.push([...element]);
    }

    // remove non unique values from created vertex array
    for (let i = 0; i < newVertexArray.length; i++) {
      const currentVertex = newVertexArray[i];
      for (let j = i + 1; j < newVertexArray.length; j++) {
        const nextVertex = newVertexArray[j];
        if (compareArrays(currentVertex, nextVertex)) {
          newVertexArray.splice(j, 1);
          j -= 1;
          i -= 1;
        }
      }
    }

    // create new element array
    const elementArray = [];
    for (let i = 0; i < this.vertices.length; i++) {
      elementArray.push(i);
    }

    console.log(newVertexArrayCopy);

    for (let i = 0; i < newVertexArrayCopy.length; i++) {
      for (let j = 0; j < newVertexArray.length; j++) {
        if (compareArrays(newVertexArrayCopy[i], newVertexArray[j])) {
          elementArray[i] = j;
        }
      }
    }

    return { newVertexArray, elementArray };
  }
}

exports.Mesh = Mesh;

/**
 * @param {Array} array
 */
const createRepetitionArray = (array) => {
  const repetitionArray = [];
  for (let i = 0; i < array.length; i++) {
    repetitionArray.push(i);
  }

  for (let i = 0; i < array.length; i++) {
    const currentArrayValue = array[i];
    for (let j = i + 1; j < array.length; j++) {
      if (compareArrays(currentArrayValue, array[j])) {
        repetitionArray[j] = i;
      }
    }
  }

  return repetitionArray;
};
