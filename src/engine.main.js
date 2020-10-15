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

  // read and store textures
  const textureResources = new TextureResources();
  const testTextureImage = EngineToolbox.readImage("./textures/test_color.png");
  const testTexture = new Texture();
  testTexture.fromPNGImage(testTextureImage);
  textureResources.add("testTexture", testTexture);

  // create scene objects
  const gameObject = new GameObject();
  gameObject.mesh = sphere;
  gameObject.transform.location = new Vector3(0, 0, -5);
  gameObject.transform.rotation = new Vector3(0, 0, 0);
  gameObject.transform.scale = new Vector3(1, 1, 1);

  const gameObject2 = new GameObject();
  gameObject2.mesh = box;
  gameObject2.transform.location = new Vector3(0, 0, -4);
  gameObject2.transform.rotation = new Vector3(0, 0, 0);
  gameObject2.transform.scale = new Vector3(1, 1, 1);

  const camera = new Camera();
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
  material.uniforms.useVertexColor.value = [1];
  material.uniforms.useEmission.value = [0];

  material.textures.color0 = textureResources.get("testTexture");
  gameObject.material = material;
  gameObject2.material = material;
  

  // draw
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();

  Game.mainFunction = () => {
    gameObject.transform.rotation.y += Time.delta * 60;
    gameObject.transform.rotation.z += Time.delta * 60;
    gameObject.transform.location = new Vector3(Math.sin(Time.now), Math.cos(Time.now), -5);

    gameObject2.transform.location = new Vector3();    
    // gameObject2.transform.rotation.y += Time.delta * 60;
    // gameObject2.transform.rotation.z += Time.delta * 60;

    Renderer.clear();
    material.uniforms.useEmission.value = [1];
    Renderer.disableDepthTest();
    Renderer.drawGameObject(gameObject2, camera);
    Renderer.enableDepthTest();
    material.uniforms.useEmission.value = [0];

    Renderer.drawGameObject(gameObject, camera);
    
  };

  Game.startLoop();
};

window.onload = main;
