const { Mesh } = require("./engine.utilities.mesh");
const { EngineToolbox } = require("./engine.toolbox");
const { Vector4 } = require("./engine.math.vector4");
const { Vector3 } = require("./engine.math.vector3");

/**
 * Allows to find source element by name in XML collada file
 * @param {HTMLCollection} sourceElements source elements in XML collada file
 * @param {string} name name of source element that should be found
 * @returns {HTMLElement|undefined} source element representing array of values stored in XML collada file or undefined if element cannot be found
 */
const findSourceElement = (sourceElements, name) => {
  for (let element of sourceElements) {
    const elementID = element.id;
    const IDWords = elementID.split("-");
    if (IDWords.find((item) => item == name)) {
      return element;
    }
  }
  return;
};

/**
 * Acquires useful data from source element e.g. array of vertex positions, normals etc.
 * @param {HTMLElement} sourceElement source element representing array of values stored in XML collada file
 * @returns {Vector3[]|Vector4[]} set of vectors where each represents elements like position, normal vector, uv coordinates etc.
 */
const parseSourceElement = (sourceElement, type = "position") => {
  const floatArrayText = sourceElement.getElementsByTagName("float_array")[0]
    .textContent;
  const floatArrayTextElements = floatArrayText.trim().split(/\s+/);
  const sourceType = type.toUpperCase();
  const dataSet = [];

  switch (sourceType) {
    case "POSITION":
      for (let i = 0; i < floatArrayTextElements.length; i += 3) {
        dataSet.push(
          new Vector4(
            parseFloat(floatArrayTextElements[i]),
            parseFloat(floatArrayTextElements[i + 1]),
            parseFloat(floatArrayTextElements[i + 2]),
            1
          )
        );
      }
      break;
    case "NORMAL":
      for (let i = 0; i < floatArrayTextElements.length; i += 3) {
        dataSet.push(
          new Vector4(
            parseFloat(floatArrayTextElements[i]),
            parseFloat(floatArrayTextElements[i + 1]),
            parseFloat(floatArrayTextElements[i + 2]),
            0
          )
        );
      }
      break;
    case "MAP":
      for (let i = 0; i < floatArrayTextElements.length; i += 2) {
        dataSet.push(
          new Vector3(
            parseFloat(floatArrayTextElements[i]),
            parseFloat(floatArrayTextElements[i + 1]),
            0
          )
        );
      }
      break;
    case "COLOR":
      for (let i = 0; i < floatArrayTextElements.length; i += 4) {
        dataSet.push(
          new Vector4(
            parseFloat(floatArrayTextElements[i]),
            parseFloat(floatArrayTextElements[i + 1]),
            parseFloat(floatArrayTextElements[i + 2]),
            parseFloat(floatArrayTextElements[i + 3])
          )
        );
      }
      break;
  }

  return dataSet;
};

/**
 * Allows to acquire number that represents index in vertex info array
 * for source give, single record in vertex info array might look like [1, 6, 3],
 * offset 1 of source "position" means that sixth position is part of this vertex info
 * @param {HTMLCollection} inputElements collection of input elements stored in XML collada file
 * @param {string} inputSemantic name of input that source offset should be found e.g. POSITION
 * @returns {number|undefined} source offset or undefined if such source is not found
 */
const findInputOffset = (inputElements, inputSemantic) => {
  for (let element of inputElements) {
    const semantic = element.getAttribute("semantic");
    if (semantic.toUpperCase() === inputSemantic.toUpperCase()) {
      return parseInt(element.getAttribute("offset"));
    }
  }
  return;
};

/**
 * @typedef {Object} TrianglesParseResult
 * @property {number} indexOffset offset in vertex info array for vertex (position) source
 * @property {number} normalOffset offset in vertex info array for normal source
 * @property {number} mapOffset offset in vertex info array for map source
 * @property {number} colorOffset offset in vertex info array for color source
 * @property {number[][]} vertices vertex info array
 */

/**
 * Acquires vertex info array from given triangles element and offset for each source of vertex data
 * @param {HTMLElement} trianglesElement XML element of collada file that represents mesh triangles (vertex info array)
 * @returns {TrianglesParseResult} set of source offsets and vertex info array
 */
const parseTrianglesElement = (trianglesElement) => {
  const pElementText = trianglesElement.getElementsByTagName("p")[0]
    .textContent;

  const pElementTextElements = pElementText.trim().split(/\s+/);

  const inputElements = trianglesElement.getElementsByTagName("input");

  const vertices = [];
  let tmpArr = [];
  for (let i = 0; i < pElementTextElements.length; i += inputElements.length) {
    for (let j = i; j < i + inputElements.length; j++) {
      tmpArr.push(parseInt(pElementTextElements[j]));
    }
    vertices.push(tmpArr);
    tmpArr = [];
  }

  const indexOffset = findInputOffset(inputElements, "VERTEX");
  const normalOffset = findInputOffset(inputElements, "NORMAL");
  const mapOffset = findInputOffset(inputElements, "TEXCOORD");
  const colorOffset = findInputOffset(inputElements, "COLOR");

  return { indexOffset, normalOffset, mapOffset, colorOffset, vertices };
};

/**
 * Reads given XML geometry tag from collada file that contains single mesh object definition
 * @param {HTMLElement} geometry XML geometry tag
 * @returns {Mesh} mesh object containing useful vertex data
 */
const readGeometry = (geometry) => {
  const geometryName = geometry.getAttribute("name");
  const meshElement = geometry.getElementsByTagName("mesh")[0];
  const sourceElements = meshElement.getElementsByTagName("source");

  const positionsElement = findSourceElement(sourceElements, "positions");
  const normalsElement = findSourceElement(sourceElements, "normals");
  const mapElement = findSourceElement(sourceElements, "map");
  const colorsElement = findSourceElement(sourceElements, "colors");
  const trianglesElement = meshElement.getElementsByTagName("triangles")[0];

  if (!positionsElement || !normalsElement || !trianglesElement) {
    return;
  }

  const mesh = new Mesh(geometryName);
  mesh.positions = parseSourceElement(positionsElement, "POSITION");
  mesh.normals = parseSourceElement(normalsElement, "NORMAL");
  mesh.map =
    mapElement === undefined ? [] : parseSourceElement(mapElement, "MAP");
  mesh.colors =
    colorsElement === undefined
      ? []
      : parseSourceElement(colorsElement, "COLOR");

  const meshTriangleInfo = parseTrianglesElement(trianglesElement);
  mesh.vertices = meshTriangleInfo.vertices;
  mesh.positionOffset = meshTriangleInfo.indexOffset;
  mesh.normalOffset = meshTriangleInfo.normalOffset;
  mesh.mapOffset = meshTriangleInfo.mapOffset;
  mesh.colorOffset = meshTriangleInfo.colorOffset;

  return mesh;
};

/**
 * Parses collada file into array of mesh objects that can be used as components of game objects
 * @param {string} path path to collada file
 * @returns {Mesh[]} array of meshes stored in collada file
 */
const readColladaFile = (path) => {
  const file = EngineToolbox.readTextFile(path);
  if (!file) {
    return;
  }

  const parser = new DOMParser();
  const xml = parser.parseFromString(file, "text/xml");

  const geometries = xml.getElementsByTagName("geometry");

  const meshes = [];

  for (let geometry of geometries) {
    const mesh = readGeometry(geometry);
    mesh.flipUV();
    meshes.push(mesh);
  }

  return meshes;
};

exports.readColladaFile = readColladaFile;
