const { readTextFile } = require("./engine.utilities");
const { Mesh } = require("./engine.utilities.mesh");

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
 *
 * @param {HTMLElement} sourceElement
 */
const parseSourceElement = (sourceElement) => {
  const accessorStride = parseInt(
    sourceElement.getElementsByTagName("accessor")[0].getAttribute("stride")
  );

  const floatArrayText = sourceElement.getElementsByTagName("float_array")[0]
    .textContent;

  const floatArrayTextElements = floatArrayText.trim().split(/\s+/);

  const dataSet = [];
  let tmpVector = [];
  for (let i = 0; i < floatArrayTextElements.length; i++) {
    tmpVector.push(parseFloat(floatArrayTextElements[i]));
    if (tmpVector.length === accessorStride) {
      dataSet.push(tmpVector);
      tmpVector = [];
    }
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
  const geometryID = geometry.getAttribute("id");
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
  mesh.positions = parseSourceElement(positionsElement);
  mesh.normals = parseSourceElement(normalsElement);
  mesh.map = parseSourceElement(mapElement);
  mesh.colors = parseSourceElement(colorsElement);

  const meshTraingleInfo = parseTrianglesElement(trianglesElement);
  mesh.vertices = meshTraingleInfo.vertices;
  mesh.indexOffset = meshTraingleInfo.indexOffset;
  mesh.normalOffset = meshTraingleInfo.normalOffset;
  mesh.mapOffset = meshTraingleInfo.mapOffset;
  mesh.colorOffset = meshTraingleInfo.colorOffset;

  return mesh;
};

const readColladaFile = (path) => {
  const file = readTextFile(path);
  if (!file) {
    return;
  }

  const parser = new DOMParser();
  const xml = parser.parseFromString(file, "text/xml");

  const geometries = xml.getElementsByTagName("geometry");

  const meshes = [];

  for (let geometry of geometries) {
    meshes.push(readGeometry(xml, geometry));
  }

  return meshes;
};

exports.readColladaFile = readColladaFile;
