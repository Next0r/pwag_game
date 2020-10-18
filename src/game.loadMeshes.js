const { EngineInfo } = require("./engine.info");
const { Mesh } = require("./engine.utilities.mesh");

const { readColladaFile } = require("./engine.utilities.collada");

const loadMeshes = () => {
  const engineInfo = new EngineInfo();
  const meshResources = engineInfo.get("meshResources");

  // read resources
  const box = readColladaFile("./models/box2.dae")[0];
  box.createElementArray();
  const sphere = readColladaFile("./models/sphere.dae")[0];
  sphere.createElementArray();
  const skybox = readColladaFile("./models/skybox.dae")[0];
  skybox.createElementArray();
  const planeMock = readColladaFile("./models/plane_mock.dae")[0];
  planeMock.createElementArray();

  // generate resources
  const guiPlane = Mesh.createGUIPlane();

  meshResources.add("box", box);
  meshResources.add("sphere", sphere);
  meshResources.add("skybox", skybox);
  meshResources.add("guiPlane", guiPlane);
  meshResources.add("planeMock", box);
};

exports.loadMeshes = loadMeshes;
