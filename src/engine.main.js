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

const main = () => {
  const engineInfo = new EngineInfo();
  EngineToolbox.createEngineInfo();
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
  const guiSight = resources.gameObjects.guiSight;

  // draw
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();
  Renderer.enableAlphaBlend();

  Input.addKeyboardEventListeners();
  Input.keyboard.onRelease["KeyL"] = Input.lockPointer;

  Game.mainFunction = () => {
    const s = 0.075;

    plane.transform.location.z = -5;
    plane.transform.rotation.y += Time.delta * 20;

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
    Renderer.drawGameObject(plane, camera);

    // gui (uses alpha - draw as last)
    Renderer.enableAlphaBlend();
    Renderer.drawGUIElement(guiSight, camera);
    Renderer.disableAlphaBlend();
  };

  Game.startLoop();
};

window.onload = main;
