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
const { createSceneElements } = require("./game.createSceneElements");
const { createMaterials } = require("./game.createMaterials");
const { initializeMaterials } = require("./game.initalizeMaterials");

const main = () => {
  const engineInfo = new EngineInfo();
  EngineToolbox.createEngineInfo();
  const gl = EngineToolbox.getGLContext();

  if (!gl) {
    return;
  }

  const scene = new DataBase();

  engineInfo.add("meshResources", new DataBase());
  engineInfo.add("textureResources", new DataBase());
  engineInfo.add("materialResources", new DataBase());
  engineInfo.add("scene", scene);

  // load mesh resources
  // const meshResources = engineInfo.get("meshResources");
  loadMeshes();

  // load texture resources
  // const textureResources = engineInfo.get("textureResources");
  loadTextures();

  // create materials
  createMaterials();

  // create scene (camera, lights, game objects ...)
  createSceneElements();

  // initialize materials with scene info and textures
  initializeMaterials();

  // draw
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();
  Renderer.enableAlphaBlend();

  Input.addKeyboardEventListeners();
  Input.keyboard.onRelease["KeyL"] = Input.lockPointer;

  const camera = scene.get("camera");
  const box = scene.get("box");
  const skybox = scene.get("skybox");
  const guiSight = scene.get("guiSight");

  Game.mainFunction = () => {
    const s = 0.075;

    box.transform.location.z = -5;
    box.transform.rotation.y += Time.delta * 20;

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

    guiSight.transform.location = new Vector3(0, 0, -1);
    guiSight.transform.scale = new Vector3(0.15, 0.15, 0.15);

    Renderer.clear();
    // skybox
    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox, camera);
    Renderer.enableDepthTest();
    // opaque elements
    Renderer.drawGameObject(box, camera);

    // gui (uses alpha - draw as last)
    Renderer.enableAlphaBlend();
    Renderer.drawGUIElement(guiSight, camera);
    Renderer.disableAlphaBlend();
  };

  Game.startLoop();
};

window.onload = main;
