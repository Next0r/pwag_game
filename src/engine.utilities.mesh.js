const { EngineToolbox } = require("./engine.toolbox");

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

    /**
     * Contains raw vertex data suitable for simple array drawing
     */
    this.vertices = [];
    /**
     * Contains reduced vertex data prepared to draw with element array buffer.
     */
    this.reducedVertices = [];
    this.elementArray = [];
  }

  getPositionsArray() {
    const out = [];
    for (let vertex of this.reducedVertices) {
      const positionIndex = vertex[this.positionOffset];
      out.push(...this.positions[positionIndex], 1);
    }
    return out;
  }

  getNormalsArray() {
    const out = [];
    for (let vertex of this.reducedVertices) {
      const normalIndex = vertex[this.normalOffset];
      out.push(...this.normals[normalIndex], 0);
    }
    return out;
  }

  getColorsArray() {
    const out = [];
    for (let vertex of this.reducedVertices) {
      const colorIndex = vertex[this.colorOffset];
      out.push(...this.colors[colorIndex]);
    }
    return out;
  }

  getMapArray() {
    const out = [];
    for (let vertex of this.reducedVertices) {
      const mapIndex = vertex[this.mapOffset];
      out.push(...this.map[mapIndex], 0);
    }
    return out;
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
        if (EngineToolbox.compareArrays(currentVertex, nextVertex)) {
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

    for (let i = 0; i < newVertexArrayCopy.length; i++) {
      for (let j = 0; j < newVertexArray.length; j++) {
        if (EngineToolbox.compareArrays(newVertexArrayCopy[i], newVertexArray[j])) {
          elementArray[i] = j;
        }
      }
    }

    this.reducedVertices = newVertexArray;
    this.elementArray = elementArray;
    return this;
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
      if (EngineToolbox.compareArrays(currentArrayValue, array[j])) {
        repetitionArray[j] = i;
      }
    }
  }

  return repetitionArray;
};
