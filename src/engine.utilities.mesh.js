const { EngineToolbox } = require("./engine.toolbox");

class Mesh {
  constructor(name = "") {
    this.name = name;

    this.positions = [];
    this.normals = [];
    this.map = [];
    this.colors = [];
    this.tangents = [];
    this.bitangents = [];

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
    this.reducedTangents = [];
    this.reducedBitangents = [];
  }

  static createGUIPlane() {
    const plane = new Mesh();
    plane.name = "GUIPlane";
    plane.positions = [
      [-1, -1, 0],
      [1, -1, 0],
      [-1, 1, 0],
      [1, 1, 0],
    ];
    plane.normals = [[0, 0, 1]];
    plane.map = [
      [1, 1],
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ];
    plane.positionOffset = 0;
    plane.normalOffset = 1;
    plane.mapOffset = 2;
    plane.colorOffset = undefined;
    plane.vertices = [
      [1, 0, 0],
      [2, 0, 1],
      [0, 0, 2],
      [1, 0, 3],
      [3, 0, 4],
      [2, 0, 5],
    ];
    plane.createElementArray();
    return plane;
  }

  createTangents() {
    if (this.mapOffset === undefined && this.vertices.length !== 0) {
      return;
    }

    for (let i = 0; i < this.vertices.length; i += 3) {
      const v0 = this.positions[this.vertices[i][this.positionOffset]];
      const v1 = this.positions[this.vertices[i + 1][this.positionOffset]];
      const v2 = this.positions[this.vertices[i + 2][this.positionOffset]];

      const uv0 = this.map[this.vertices[i][this.mapOffset]];
      const uv1 = this.map[this.vertices[i + 1][this.mapOffset]];
      const uv2 = this.map[this.vertices[i + 2][this.mapOffset]];

      const dPos1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
      const dPos2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

      const dUV1 = [uv1[0] - uv0[0], uv1[1] - uv0[1]];
      const dUV2 = [uv2[0] - uv0[0], uv2[1] - uv0[1]];

      const r = 1 / (dUV1[0] * dUV2[1] - dUV1[1] * dUV2[0]);

      const tangent = [];
      tangent.push((dPos1[0] * dUV2[1] - dPos2[0] * dUV1[1]) * r);
      tangent.push((dPos1[1] * dUV2[1] - dPos2[1] * dUV1[1]) * r);
      tangent.push((dPos1[2] * dUV2[1] - dPos2[2] * dUV1[1]) * r);

      const bitangent = [];
      bitangent.push((dPos2[0] * dUV1[0] - dPos1[0] * dUV2[0]) * r);
      bitangent.push((dPos2[1] * dUV1[0] - dPos1[1] * dUV2[0]) * r);
      bitangent.push((dPos2[2] * dUV1[0] - dPos1[2] * dUV2[0]) * r);

      this.tangents.push(tangent, tangent, tangent);
      this.bitangents.push(bitangent, bitangent, bitangent);
    }

    return this;
  }

  getPositionsArray() {
    const out = [];
    if (this.positionOffset === undefined) {
      return out;
    }

    for (let vertex of this.reducedVertices) {
      const positionIndex = vertex[this.positionOffset];
      out.push(...this.positions[positionIndex], 1);
    }
    return out;
  }

  getNormalsArray() {
    const out = [];
    if (this.normalOffset === undefined) {
      return out;
    }

    for (let vertex of this.reducedVertices) {
      const normalIndex = vertex[this.normalOffset];
      out.push(...this.normals[normalIndex], 0);
    }
    return out;
  }

  getColorsArray() {
    const out = [];
    if (this.colorOffset === undefined) {
      return out;
    }

    for (let vertex of this.reducedVertices) {
      const colorIndex = vertex[this.colorOffset];
      out.push(...this.colors[colorIndex]);
    }
    return out;
  }

  getMapArray() {
    const out = [];
    if (this.mapOffset === undefined) {
      return out;
    }

    for (let vertex of this.reducedVertices) {
      const mapIndex = vertex[this.mapOffset];
      out.push(...this.map[mapIndex], 0);
    }
    return out;
  }

  getTangentArray() {
    const out = [];
    if (this.mapOffset === undefined) {
      return out;
    }

    for (let vertex of this.reducedVertices) {
      const tangentIndex = vertex.pop();
      out.push(...this.tangents[tangentIndex], 0);
    }
    return out;
  }

  getBitangentArray() {
    const out = [];
    if (this.mapOffset === undefined) {
      return out;
    }

    for (let vertex of this.reducedVertices) {
      const bitangentIndex = vertex.pop();
      out.push(...this.bitangents[bitangentIndex], 0);
    }
    return out;
  }

  flipUV() {
    for (let i = 0; i < this.map.length; i++) {
      this.map[i][1] = 1 - this.map[i][1];
    }
  }

  createElementArray() {
    const elementArray = [];
    const verticesClone = [];

    for (let i = 0; i < this.vertices.length; i += 1) {
      verticesClone.push([...this.vertices[i]]);
      elementArray.push(i);
    }

    if (this.mapOffset !== undefined) {
      // Add tangent and bitangent index to vertex data
      this.createTangents();
      for (let i = 0; i < verticesClone.length; i += 1) {
        verticesClone[i].push(i);
      }
    }

    for (let i = 0; i < this.vertices.length; i += 1) {
      const vertex = this.vertices[i];

      const vertexInfo = [];
      this.positionOffset !== undefined && vertexInfo.push(...this.positions[vertex[this.positionOffset]]);
      this.normalOffset !== undefined && vertexInfo.push(...this.normals[vertex[this.normalOffset]]);
      this.mapOffset !== undefined && vertexInfo.push(...this.map[vertex[this.mapOffset]]);
      this.colorOffset !== undefined && vertexInfo.push(...this.colors[vertex[this.colorOffset]]);

      for (let j = i + 1; j < verticesClone.length; j += 1) {
        const nextVertex = verticesClone[j];

        if (nextVertex !== undefined) {
          const nextVertexInfo = [];
          this.positionOffset !== undefined && nextVertexInfo.push(...this.positions[nextVertex[this.positionOffset]]);
          this.normalOffset !== undefined && nextVertexInfo.push(...this.normals[nextVertex[this.normalOffset]]);
          this.mapOffset !== undefined && nextVertexInfo.push(...this.map[nextVertex[this.mapOffset]]);
          this.colorOffset !== undefined && nextVertexInfo.push(...this.colors[nextVertex[this.colorOffset]]);

          if (EngineToolbox.compareArrays(nextVertexInfo, vertexInfo)) {
            if (this.mapOffset !== undefined) {
              this.tangents[i][0] += this.tangents[j][0];
              this.tangents[i][1] += this.tangents[j][1];
              this.tangents[i][2] += this.tangents[j][2];

              this.bitangents[i][0] += this.bitangents[j][0];
              this.bitangents[i][1] += this.bitangents[j][1];
              this.bitangents[i][2] += this.bitangents[j][2];
            }

            verticesClone[j] = undefined;
            elementArray[j] = i;
          }
        }
      }
    }

    // fix element array
    let correction = 0;
    for (let i = 0; i < elementArray.length; i++) {
      if (verticesClone[i] === undefined) {
        correction += 1;
      } else {
        elementArray[i] -= correction;
      }
    }

    // remove vertices marked as undefined
    for (let i = 0; i < verticesClone.length; i++) {
      if (verticesClone[i] === undefined) {
        verticesClone.splice(i, 1);
        i -= 1;
      }
    }

    this.elementArray = elementArray;
    this.reducedVertices = verticesClone;
    return this;
  }
}

exports.Mesh = Mesh;
