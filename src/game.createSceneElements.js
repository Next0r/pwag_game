const { Camera } = require("./engine.camera");
const { Game } = require("./engine.game");
const { GameObject } = require("./engine.gameObject");
const { EngineInfo } = require("./engine.info");
const { AmbientLight } = require("./engine.light.ambient");
const { DirectLight } = require("./engine.light.direct");

const createSceneElements = () => {
  const engineInfo = new EngineInfo();
  const scene = engineInfo.get("scene");
  const meshResources = engineInfo.get("meshResources");
  const materialResources = engineInfo.get("materialResources");

  // create basic scene elements
  const camera = new Camera();
  camera.projection.fov = 50;

  const ambientLight = new AmbientLight();
  const directLight = new DirectLight();

  // create game objects, bind meshes and materials
  const guiSight = new GameObject();
  guiSight.mesh = meshResources.get("guiPlane");
  guiSight.material = materialResources.get("guiSight");

  const skybox = new GameObject();
  skybox.mesh = meshResources.get("skybox");
  skybox.material = materialResources.get("skybox");

  const box = new GameObject();
  box.mesh = meshResources.get("box");
  box.material = materialResources.get("box");

  scene.add("camera", camera);
  scene.add("ambientLight", ambientLight);
  scene.add("directLight", directLight);

  scene.add("guiSight", guiSight);
  scene.add("skybox", skybox);
  scene.add("box", box);
};

exports.createSceneElements = createSceneElements;
