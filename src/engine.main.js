const { Vector3 } = require("./engine.math.vector3");
const { Game } = require("./engine.game");
const { Time } = require("./engine.time");
const { EngineToolbox } = require("./engine.toolbox");
const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const { Vector4 } = require("./engine.math.vector4");
const { EngineInfo } = require("./engine.info");
const { CreateEngineResources } = require("./engine.resources");
const { createShaderProgram } = require("./engine.shader");
const { gameInit } = require("./game.init");
const { GameObject } = require("./engine.gameObject");
const { Matrix4 } = require("./engine.math.matrix4");
const { rmdir } = require("fs");

const main = () => {
  const engineInfo = EngineToolbox.createEngineInfo();
  const gl = EngineToolbox.getGLContext();

  if (!gl) {
    return;
  }

  const resources = CreateEngineResources();
  resources.build();
  gameInit();

  const plane = resources.gameObjects.plane;
  const camera = resources.gameObjects.camera;
  const skybox = resources.gameObjects.skybox;
  /**
   * @type {GameObject}
   */
  const guiSight = resources.gameObjects.guiSight;
  /**
   * @type {GameObject}
   */
  const box = resources.gameObjects.box;

  // draw
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();
  Renderer.enableAlphaBlend();

  Input.addKeyboardEventListeners();
  Input.keyboard.onRelease["KeyL"] = Input.lockPointer;

  // plane.transform.location.z = -20;

  let planeRotationY = 0;
  let planeRotationX = 0;
  let planePosition = new Vector3();
  let boxPosition = new Vector3(0, 0, -5);
  let guiSightScale = new Vector3(0.2, 0.2, 0.2);
  let guiSightSensitivity = 0.0025;
  let guiSightPosition = new Vector3(0, 0, 0);

  Game.mainFunction = () => {
    box.transform.reset();
    box.transform.translate(boxPosition);
    box.transform.applyLocation();

    if (guiSightPosition.x > -1 && Input.mouse.movementX < 0) {
      guiSightPosition.x += Input.mouse.movementX * guiSightSensitivity;
    } else if (guiSightPosition.x <= -1 && Input.mouse.movementX > 0) {
      guiSightPosition.x += Input.mouse.movementX * guiSightSensitivity;
    }

    if (guiSightPosition.x < 1 && Input.mouse.movementX > 0) {
      guiSightPosition.x += Input.mouse.movementX * guiSightSensitivity;
    } else if (guiSightPosition.x >= 1 && Input.mouse.movementX < 0) {
      guiSightPosition.x += Input.mouse.movementX * guiSightSensitivity;
    }

    if (guiSightPosition.x < -1) {
      guiSightPosition.x = -1;
    } else if (guiSightPosition.x > 1) {
      guiSightPosition.x = 1;
    }
    
    guiSight.transform.reset();
    guiSight.transform.translate(guiSightPosition);
    guiSight.transform.scale(guiSightScale);
    guiSight.transform.applyLocation();
    guiSight.transform.applyScale();

    Renderer.clear();
    // skybox
    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox, camera);
    Renderer.enableDepthTest();
    // opaque elements
    // Renderer.drawGameObject(plane, camera);
    Renderer.drawGameObject(box, camera);

    // gui (uses alpha - draw as last)
    Renderer.enableAlphaBlend();
    Renderer.drawGUIElement(guiSight, camera);
    Renderer.disableAlphaBlend();
  };

  Game.startLoop();
};

window.onload = main;
