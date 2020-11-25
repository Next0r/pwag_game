const { Vector4 } = require("./engine.math.vector4");
const { Vector3 } = require("./engine.math.vector3");
const { EngineToolbox } = require("./engine.toolbox");

/**
 * Container for data describing single mesh object, also
 * contains methods that might be used to create simple meshes, meshes
 * that can be acquired from engine resources should already have reduced arrays generated
 * for vertex indexing and UVs flipped to match OpenGL standard
 */
class Mesh {
  /**
   * Creates new mesh instance
   * @param {string} name name of new mesh component
   */
  constructor(name = "") {
    /**
     * Name of this mesh component
     * @type {string} 
     */
    this.name = name;
    /**
     * Object that bounds all buffers that supply shader attributes with data
     * @type {WebGLVertexArrayObject}
     */
    this.vertexArrayObject = undefined;
    /**
     * Buffer that contains order in which data from other vertex buffers should be read
     * @type {WebGLBuffer}
     */
    this.elementArrayVBO = undefined;
    /**
     * Buffer that contains vertex positions
     * @type {WebGLBuffer}
     */
    this.positionsVBO = undefined;
    /**
     * Buffer that contains vertex normals
     * @type {WebGLBuffer}
     */
    this.normalsVBO = undefined;
    /**
     * Buffer that contains vertex UV mapping
     * @type {WebGLBuffer}
     */
    this.mapVBO = undefined;
    /**
     * Buffer that contains vertex colors
     * @type {WebGLBuffer}
     */
    this.colorVBO = undefined;

    /**
     * Raw positions read from file (last component of vector4 equal to 1)
     * @type {Vector4[]}
     */
    this.positions = [];
    /**
     * Raw normals read from file (last component of vector4 equal to 0)
     * @type {Vector4[]}
     */
    this.normals = [];
    /**
     * Raw UV mapping read from file (last component of vector3 equal to 1)
     * @type {Vector4[]}
     */
    this.map = [];
    /**
     * Raw vertex colors read from file
     * @type {Vector4[]}
     */
    this.colors = [];

    /**
     * Offset of position info in vertex info array
     * @type {number}
     */
    this.positionOffset = 0;
    /**
     * Offset of normals info in vertex info array
     * @type {number}
     */
    this.normalOffset = 1;
    /**
     * Offset of mapping info in vertex info array
     * @type {number}
     */
    this.mapOffset = 2;
    /**
     * Offset of color info in vertex info array
     * @type {number}
     */
    this.colorOffset = 3;

    /**
     * Contains raw vertex data suitable for simple array drawing
     * @type {number[]}
     */
    this.vertices = [];
    /**
     * Contains reduced vertex data prepared to draw with element array buffer.
     * @type {number[]}
     */
    this.reducedVertices = [];
    /**
     * Contains order in which data from other vertex buffers should be read
     * @type {number[]}
     */
    this.elementArray = [];
  }

  /**
   * Creates buffers for this mesh, element array has to be set to call this
   * method
   */
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

  /**
   * Creates plane that can be used to render GUI elements on it
   * @returns {Mesh} simple plane that allows to render GUI elements on it
   */
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
   * Allows to change scale of mapping in this mesh
   * @param {Number} scaleFactor factor on the right side of multiplication
   * @returns {Mesh} self reference for easier method chaining
   */
  scaleMap(scaleFactor) {
    for (let i = 0; i < this.map.length; i += 1) {
      this.map[i].x *= scaleFactor;
      this.map[i].y *= scaleFactor;
      this.map[i].z *= scaleFactor;
    }
    return this;
  }

  /**
   * Allows to acquire array of vertex positions, returns empty array if
   * positions offset is not defined, can be used only if reduced vertices array
   * has been created
   * @returns {number[]} array of positions, that can be supplied directly into WebGL buffer
   */
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

  /**
   * Allows to acquire array of vertex normals, returns empty array if
   * normals offset is not defined, can be used only if reduced vertices array
   * has been created
   * @returns {number[]} array of normals, that can be supplied directly into WebGL buffer
   */
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

  /**
   * Allows to acquire array of vertex colors, returns empty array if
   * colors offset is not defined, can be used only if reduced vertices array
   * has been created
   * @returns {number[]} array of colors, that can be supplied directly into WebGL buffer
   */
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

  /**
   * Allows to acquire array of vertex UV mapping, returns empty array if
   * UV mapping offset is not defined, can be used only if reduced vertices array
   * has been created
   * @returns {number[]} array of UV mapping, that can be supplied directly into WebGL buffer
   */
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

  /**
   * Flips UV mapping so it matches OpenGL mapping standard rather than Direct3D one
   * @returns {Mesh} self reference for easier method chaining
   */
  flipUV() {
    for (let i = 0; i < this.map.length; i++) {
      this.map[i].y = 1 - this.map[i].y;
    }
    return this;
  }

  /**
   * Creates set of reduced vertices, so element array and it's buffer can be used
   * to reduce GPU memory usage
   * @returns {Mesh} self reference for easier method chaining
   */
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

exports.Mesh = Mesh;
