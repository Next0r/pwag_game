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
const { handleGuiSight } = require("./game.handleGuiSight");

const main = () => {
  const engineInfo = EngineToolbox.createEngineInfo();
  const gl = EngineToolbox.getGLContext();

  if (!gl) {
    return;
  }

  const resources = CreateEngineResources();
  resources.build();
  gameInit();

  /**
   * @type {GameObject}
   */
  const plane = resources.gameObjects.plane;
  const camera = resources.gameObjects.camera;
  /**
   * @type {GameObject}
   */
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
  let boxPosition = new Vector3(0, 0, -5);
  let guiSightScale = new Vector3(0.2, 0.2, 0.2);
  let guiSightSensitivity = 0.0025;
  let guiSightPosition = new Vector3(0, 0, 0);
  const planeRotationSpeed = 0.5;
  let planePosition = new Vector3(0, 0, 0);
  const camOffsetVector = new Vector3(0, 3, 20);
  const planeVelocity = Vector3.forward;
  let planeSpeed = 0;
  const planeMaxRotationZ = 30;
  camera.projection.far = 1000;

  Input.keyboard.onRelease["KeyF"] = () => {
    planeSpeed = 20;
  };

  // const m = new Matrix4();
  // m.fromArray([1, 1, 2, 3, 4, 1, 5, 6, 7, 8, 1, 9, 10, 11, 12, 1]);
  // m.transpose();
  // console.log(m);

  Game.mainFunction = () => {
    planeRotationY -= guiSightPosition.x * planeRotationSpeed;
    planeRotationX += guiSightPosition.y * planeRotationSpeed;

    plane.transform.reset();
    plane.transform.translate(planePosition);
    plane.transform.rotateY(planeRotationY);
    plane.transform.rotateX(planeRotationX);
    plane.transform.rotateZ(guiSightPosition.x * planeMaxRotationZ);
    plane.transform.applyLocation(); // also resets location matrix
    plane.transform.applyRotation();
    plane.transform.translate(planeVelocity.clone().scale(planeSpeed * Time.delta));
    plane.transform.applyLocation();
    planePosition = plane.transform.matrix.position(); // update plane position

    handleGuiSight(guiSightPosition, guiSightSensitivity);
    guiSight.transform.reset();
    guiSight.transform.translate(guiSightPosition);
    guiSight.transform.scale(guiSightScale);
    guiSight.transform.applyLocation();
    guiSight.transform.applyScale();

    camera.transform.reset();
    camera.transform.translate(planePosition);
    camera.transform.rotateY(planeRotationY);
    camera.transform.rotateX(planeRotationX);
    camera.transform.applyLocation(); // also resets location matrix so another translate can be executed safely
    camera.transform.applyRotation();
    camera.transform.translate(camOffsetVector);
    camera.transform.applyLocation();

    skybox.transform.reset();
    skybox.transform.translate(camera.transform.matrix.position());
    skybox.transform.applyLocation();

    box.transform.reset();
    box.transform.scale(new Vector3(3, 3, 3));
    box.transform.applyScale();

    Renderer.clear();
    // skybox
    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox, camera);
    Renderer.enableDepthTest();
    // opaque elements
    Renderer.drawGameObject(plane, camera);
    Renderer.drawGameObject(box, camera);

    // gui (uses alpha - draw as last)
    Renderer.enableAlphaBlend();
    Renderer.drawGUIElement(guiSight, camera);
    Renderer.disableAlphaBlend();
  };

  Game.startLoop();
};

window.onload = main;
