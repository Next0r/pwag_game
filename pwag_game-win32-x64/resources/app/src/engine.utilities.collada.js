const { Mesh } = require("./engine.utilities.mesh");
const { EngineToolbox } = require("./engine.toolbox");
const { Vector4 } = require("./engine.math.vector4");
const { Vector3 } = require("./engine.math.vector3");

/**
 *
 * @param {HTMLCollection} sourceElements
 * @param {*} name
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
 * @param {HTMLElement} sourceElement
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
 *
 * @param {HTMLCollection} inputElements
 * @param {String} inputSemantic
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
 *
 * @param {HTMLElement} trianglesElement
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
 * @param {XMLDocument} xml
 * @param {HTMLElement} geometry
 */
const readGeometry = (xml, geometry) => {
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
    const mesh = readGeometry(xml, geometry);
    mesh.flipUV();
    meshes.push(mesh);
  }

  return meshes;
};

exports.readColladaFile = readColladaFile;
