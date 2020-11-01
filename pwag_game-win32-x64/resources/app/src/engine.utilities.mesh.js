const { Vector4 } = require("./engine.math.vector4");
const { Vector3 } = require("./engine.math.vector3");
const { EngineToolbox } = require("./engine.toolbox");

class Mesh {
  constructor(name = "") {
    this.name = name;

    this.vertexArrayObject = undefined;
    this.elementArrayVBO = undefined;
    this.positionsVBO = undefined;
    this.normalsVBO = undefined;
    this.mapVBO = undefined;
    this.colorVBO = undefined;

    /**
     * @type {Vector4[]}
     */
    this.positions = [];
    /**
     * @type {Vector4[]}
     */
    this.normals = [];
    /**
     * @type {Vector3[]}
     */
    this.map = [];
    /**
     * @type {Vector4[]}
     */
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
    this.reducedTangents = [];
    this.reducedBitangents = [];
  }

  createBuffers() {
    if (
      !(this.elementArray instanceof Array) ||
      this.elementArray.length === 0
    ) {
      return;
    }

    const gl = EngineToolbox.getGLContext();
    this.vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArrayObject);

    this.elementArrayVBO = gl.createBuffer();
    this.positionsVBO = gl.createBuffer();
    this.normalsVBO = gl.createBuffer();
    this.mapVBO = gl.createBuffer();
    this.colorVBO = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementArrayVBO);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint32Array(this.elementArray),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsVBO);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.getPositionsArray()),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsVBO);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.getNormalsArray()),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mapVBO);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.getMapArray()),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.getColorsArray()),
      gl.STATIC_DRAW
    );
  }

  static createGUIPlane() {
    const plane = new Mesh();
    plane.name = "GUIPlane";
    plane.positions = [
      new Vector4(-1, -1, 0, 1),
      new Vector4(1, -1, 0, 1),
      new Vector4(-1, 1, 0, 1),
      new Vector4(1, 1, 0, 1),
    ];
    plane.normals = [new Vector4(0, 0, 1, 0)];
    plane.map = [
      new Vector3(1, 1, 0),
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(1, 1, 0),
      new Vector3(1, 0, 0),
      new Vector3(0, 0, 0),
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

  /**
   * @param {Number} scaleFactor
   */
  scaleMap(scaleFactor) {
    for (let i = 0; i < this.map.length; i += 1) {
      this.map[i].x *= scaleFactor;
      this.map[i].y *= scaleFactor;
      this.map[i].z *= scaleFactor;
    }
    return this;
  }

  // createTangents() {
  //   if (this.mapOffset === undefined && this.vertices.length !== 0) {
  //     return;
  //   }

  //   for (let i = 0; i < this.vertices.length; i += 3) {
  //     const v0 = this.positions[this.vertices[i][this.positionOffset]];
  //     const v1 = this.positions[this.vertices[i + 1][this.positionOffset]];
  //     const v2 = this.positions[this.vertices[i + 2][this.positionOffset]];

  //     const uv0 = this.map[this.vertices[i][this.mapOffset]];
  //     const uv1 = this.map[this.vertices[i + 1][this.mapOffset]];
  //     const uv2 = this.map[this.vertices[i + 2][this.mapOffset]];

  //     const dPos1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
  //     const dPos2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

  //     const dUV1 = [uv1[0] - uv0[0], uv1[1] - uv0[1]];
  //     const dUV2 = [uv2[0] - uv0[0], uv2[1] - uv0[1]];

  //     const r = 1 / (dUV1[0] * dUV2[1] - dUV1[1] * dUV2[0]);

  //     const tangent = [];
  //     tangent.push((dPos1[0] * dUV2[1] - dPos2[0] * dUV1[1]) * r);
  //     tangent.push((dPos1[1] * dUV2[1] - dPos2[1] * dUV1[1]) * r);
  //     tangent.push((dPos1[2] * dUV2[1] - dPos2[2] * dUV1[1]) * r);

  //     const bitangent = [];
  //     bitangent.push((dPos2[0] * dUV1[0] - dPos1[0] * dUV2[0]) * r);
  //     bitangent.push((dPos2[1] * dUV1[0] - dPos1[1] * dUV2[0]) * r);
  //     bitangent.push((dPos2[2] * dUV1[0] - dPos1[2] * dUV2[0]) * r);

  //     this.tangents.push(tangent, tangent, tangent);
  //     this.bitangents.push(bitangent, bitangent, bitangent);
  //   }

  //   return this;
  // }

  getPositionsArray() {
    const out = [];
    if (this.positionOffset === undefined) {
      return out;
    }

    for (let vertex of this.reducedVertices) {
      const positionIndex = vertex[this.positionOffset];
      out.push(...this.positions[positionIndex].toArray());
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
      out.push(...this.normals[normalIndex].toArray());
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
      out.push(...this.colors[colorIndex].toArray());
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
      out.push(...this.map[mapIndex].toArray());
    }
    return out;
  }

  // getTangentArray() {
  //   const out = [];
  //   if (this.mapOffset === undefined) {
  //     return out;
  //   }

  //   for (let vertex of this.reducedVertices) {
  //     const tangentIndex = vertex.pop();
  //     out.push(...this.tangents[tangentIndex], 0);
  //   }
  //   return out;
  // }

  // getBitangentArray() {
  //   const out = [];
  //   if (this.mapOffset === undefined) {
  //     return out;
  //   }

  //   for (let vertex of this.reducedVertices) {
  //     const bitangentIndex = vertex.pop();
  //     out.push(...this.bitangents[bitangentIndex], 0);
  //   }
  //   return out;
  // }

  flipUV() {
    for (let i = 0; i < this.map.length; i++) {
      this.map[i].y = 1 - this.map[i].y;
    }
  }

  createElementArray() {
    const elementArray = [];
    const elementArrayClone = [];
    const verticesClone = [];

    for (let i = 0; i < this.vertices.length; i += 1) {
      verticesClone.push([...this.vertices[i]]);
      elementArray.push(i);
      elementArrayClone.push(i);
    }

    for (let i = 0; i < this.vertices.length; i += 1) {
      const vertex = this.vertices[i];
      const position = this.positions[vertex[this.positionOffset]];
      const normal = this.normals[vertex[this.normalOffset]];
      const map =
        this.mapOffset !== undefined
          ? this.map[vertex[this.mapOffset]]
          : new Vector3();
      const color =
        this.colorOffset !== undefined
          ? this.colors[vertex[this.colorOffset]]
          : new Vector4();

      for (let j = i + 1; j < this.vertices.length; j += 1) {
        const nextVertex = this.vertices[j];
        const nextPosition = this.positions[nextVertex[this.positionOffset]];
        const nextNormal = this.normals[nextVertex[this.normalOffset]];
        const nextMap =
          this.mapOffset !== undefined
            ? this.map[nextVertex[this.mapOffset]]
            : new Vector3();
        const nextColor =
          this.colorOffset !== undefined
            ? this.colors[nextVertex[this.colorOffset]]
            : new Vector4();

        if (
          elementArrayClone[i] == i && // affect vertices that has not been checked yet
          position.isEqual(nextPosition) &&
          normal.isEqual(nextNormal) &&
          map.isEqual(nextMap) &&
          color.isEqual(nextColor)
        ) {
          verticesClone[j] = undefined;
          elementArrayClone[j] = i;
        }
      }
    }

    const reducedVertices = [];
    for (let i = 0; i < verticesClone.length; i += 1) {
      verticesClone[i] && reducedVertices.push([...verticesClone[i]]);
    }

    for (let i = 0; i < elementArrayClone.length; i += 1) {
      const index = elementArrayClone[i];
      const vertex = verticesClone[index];

      if (vertex !== undefined) {
        for (let j = 0; j < reducedVertices.length; j += 1) {
          if (EngineToolbox.compareArrays(vertex, reducedVertices[j])) {
            elementArrayClone[i] = j;
            break;
          }
        }
      }
    }

    this.elementArray = elementArrayClone;
    this.reducedVertices = reducedVertices;
    return this;
  }
}

/**
 * @param {[]} vertex
 * @param {[][]} vertices
 */
const findVertex = (vertex, vertices) => {
  for (let i = 0; i < vertices.length; i += 1) {
    if (EngineToolbox.compareArrays(vertex, vertices[i])) {
      return i;
    }
  }
};

exports.Mesh = Mesh;
