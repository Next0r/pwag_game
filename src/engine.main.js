const { createShaderProgram } = require("./engine.shader");
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
const { Texture } = require("./engine.material.textures");
const { removeDoubles, toArrayWithUniqueValues, createRepetitionArray, Mesh } = require("./engine.utilities.mesh");
const { EngineToolbox } = require("./engine.toolbox");
const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const { Vector4 } = require("./engine.math.vector4");
const { time } = require("console");
const { loadTextures } = require("./game.loadTextures");
const { loadMeshes } = require("./game.loadMeshes");
const { EngineInfo } = require("./engine.info");
const { DataBase } = require("./engine.dataBase");

const main = () => {
  const engineInfo = new EngineInfo();
  EngineToolbox.createEngineInfo();
  const gl = EngineToolbox.getGLContext();

  if (!gl) {
    return;
  }

  const vsSource = EngineToolbox.readTextFile("./shaders/testVS.txt");
  const fsSource = EngineToolbox.readTextFile("./shaders/testFS.txt");

  engineInfo.add("meshResources", new DataBase());
  engineInfo.add("textureResources", new DataBase());
  engineInfo.add("materialResources", new DataBase());
  engineInfo.add("scene", new DataBase());

  // load mesh resources
  const meshResources = engineInfo.get("meshResources");
  loadMeshes();

  // load texture resources
  const textureResources = engineInfo.get("textureResources");
  loadTextures();

  // create scene objects
  const GUIElement = new GameObject();
  GUIElement.mesh = meshResources.get("gui_plane");

  const gameObject = new GameObject();
  gameObject.mesh = meshResources.get("box");

  const skybox = new GameObject();
  skybox.mesh = meshResources.get("skybox");

  const camera = new Camera();
  camera.projection.fov = 50;

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

  const guiMaterial = new Material(shaderProgram);
  guiMaterial.uniforms.color0Sampler.value = [0];
  guiMaterial.uniforms.useVertexColor.value = [0];
  guiMaterial.uniforms.useEmission.value = [1];

  guiMaterial.textures.color0 = textureResources.get("gui_sight");

  gameObject.material = material;
  skybox.material = skyboxMaterial;
  GUIElement.material = guiMaterial;

  // draw
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();
  Renderer.enableAlphaBlend();

  Input.addKeyboardEventListeners();
  Input.keyboard.onRelease["KeyL"] = Input.lockPointer;

  Game.mainFunction = () => {
    const s = 0.075;

    gameObject.transform.location.z = -5;
    gameObject.transform.rotation.y += Time.delta * 20;

    camera.transform.rotation.x += Input.mouse.movementY * s;
    camera.transform.rotation.y -= Input.mouse.movementX * s;

    const camSpeed = 3;
    const forward = camera.transform.forward();
    forward.scale(Time.delta * camSpeed);
    const right = camera.transform.right();
    right.scale(Time.delta * camSpeed);
    if (Input.keyboard.isDown("KeyW")) {
      camera.transform.location.add(forward);
    } else if (Input.keyboard.isDown("KeyS")) {
      camera.transform.location.subtract(forward);
    }
    if (Input.keyboard.isDown("KeyA")) {
      camera.transform.location.subtract(right);
    } else if (Input.keyboard.isDown("KeyD")) {
      camera.transform.location.add(right);
    }

    skybox.transform.location = camera.transform.location;

    GUIElement.transform.location = new Vector3(0, 0, -1);
    GUIElement.transform.scale = new Vector3(0.15, 0.15, 0.15);

    Renderer.clear();
    // skybox
    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox, camera);
    Renderer.enableDepthTest();
    // opaque elements
    Renderer.drawGameObject(gameObject, camera);

    // gui
    Renderer.enableAlphaBlend();
    Renderer.drawGUIElement(GUIElement, camera);
    Renderer.disableAlphaBlend();
  };

  Game.startLoop();
};

window.onload = main;
