const { EngineInfo } = require("./engine.info");
const { Material } = require("./engine.material");
const { createShaderProgram } = require("./engine.shader");
const { EngineToolbox } = require("./engine.toolbox");

const createMaterials = () => {
  const engineInfo = new EngineInfo();
  const materialResources = engineInfo.get("materialResources");

  const vertexShaderSource = EngineToolbox.readTextFile("./shaders/testVS.txt");
  const fragmentShaderSource = EngineToolbox.readTextFile("./shaders/testFS.txt");

  const shaderProgram = createShaderProgram(vertexShaderSource, fragmentShaderSource);

  const boxMaterial = new Material(shaderProgram);
  const skyboxMaterial = new Material(shaderProgram);
  const guiSightMaterial = new Material(shaderProgram);

  materialResources.add("box", boxMaterial);
  materialResources.add("skybox", skyboxMaterial);
  materialResources.add("guiSight", guiSightMaterial);
};

exports.createMaterials = createMaterials;
