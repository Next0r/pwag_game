const { createShaderProgram } = require("./engine.shader");
const utilitiesCollada = require("./engine.utilities.collada");
const { Vector3 } = require("./engine.math.vector3");
const { GameObject } = require("./engine.gameObject");
const { Camera } = require("./engine.camera");
const { DirectLight } = require("./engine.light.direct");
const { AmbientLight } = require("./engine.light.ambient");
const { Matrix4 } = require("./engine.math.matrix4");
const { Material } = require("./engine.material");
const { Game } = require("./engine.game");
const { Time } = require("./engine.time");
const { readFile } = require("fs");
const { TextureResources } = require("./engine.textureResources");
const { Texture } = require("./engine.material.textures");
const { removeDoubles, toArrayWithUniqueValues, createRepetitionArray } = require("./engine.utilities.mesh");
const { EngineToolbox } = require("./engine.toolbox");
const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const { Vector4 } = require("./engine.math.vector4");
const { time } = require("console");

const main = () => {
  // create game info
  EngineToolbox.createEngineInfo();
  const gl = EngineToolbox.getGLContext();

  const canvas = EngineToolbox.getCanvas();
  canvas.addEventListener("mousedown", () => {
    Input.lockPointer();
  });

  if (!gl) {
    return;
  }

  // read resources
  const vsSource = EngineToolbox.readTextFile("./shaders/testVS.txt");
  const fsSource = EngineToolbox.readTextFile("./shaders/testFS.txt");
  const box = utilitiesCollada.readColladaFile("./models/box2.dae")[0];
  box.createElementArray();
  const sphere = utilitiesCollada.readColladaFile("./models/sphere.dae")[0];
  sphere.createElementArray();
  const plane = utilitiesCollada.readColladaFile("./models/plane.dae")[0];
  plane.createElementArray();
  const plane2 = utilitiesCollada.readColladaFile("./models/plane2.dae")[0]; // with vertex colors
  plane2.createElementArray();
  const skyboxMesh = utilitiesCollada.readColladaFile("./models/skybox.dae")[0];
  skyboxMesh.createElementArray();

  // read and store textures
  const textureResources = new TextureResources();
  const testTextureImage = EngineToolbox.readImage("./textures/test_color.png");
  const testTexture = new Texture();
  testTexture.fromPNGImage(testTextureImage);
  textureResources.add("testTexture", testTexture);
  const skyboxColorImage = EngineToolbox.readImage("./textures/skybox_color_01.png");
  const skyboxColor = new Texture();
  skyboxColor.fromPNGImage(skyboxColorImage);
  textureResources.add("skybox_color", skyboxColor);

  // create scene objects
  const gameObject = new GameObject();
  gameObject.mesh = box;

  const skybox = new GameObject();
  skybox.mesh = skyboxMesh;

  const camera = new Camera();
  camera.projection.fov = 50;
  camera.transform.rebuildMatrix();
  camera.projection.rebuildMatrix();

  const directLight = new DirectLight();
  const ambientLight = new AmbientLight();

  // setup material parameters
  const shaderProgram = createShaderProgram(vsSource, fsSource);
  const material = new Material(shaderProgram);
  material.uniforms.directLightDirection.value = directLight.direction.toArray();
  material.uniforms.directLightColor.value = directLight.color.toArray();
  material.uniforms.directLightValue.value = [directLight.value];
  material.uniforms.ambientLightColor.value = ambientLight.color.toArray();
  material.uniforms.ambientLightValue.value = [ambientLight.value];
  material.uniforms.color0Sampler.value = [0];
  material.uniforms.useVertexColor.value = [0];
  material.uniforms.useEmission.value = [0];

  material.textures.color0 = textureResources.get("testTexture");

  const skyboxMaterial = new Material(shaderProgram);
  skyboxMaterial.uniforms.color0Sampler.value = [0];
  skyboxMaterial.uniforms.useVertexColor.value = [0];
  skyboxMaterial.uniforms.useEmission.value = [1];

  skyboxMaterial.textures.color0 = textureResources.get("skybox_color");

  gameObject.material = material;
  skybox.material = skyboxMaterial;

  // draw
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();

  Game.mainFunction = () => {
    const s = 0.05;

    gameObject.transform.location.z = -5;

    camera.transform.rotation.x += Input.mouse.movementY * s;
    camera.transform.rotation.y -= Input.mouse.movementX * s;

    Renderer.clear();

    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox, camera);
    Renderer.enableDepthTest();

    Renderer.drawGameObject(gameObject, camera);
  };

  Game.startLoop();
};

window.onload = main;
