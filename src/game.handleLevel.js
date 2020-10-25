const { Game } = require("./engine.game");
const { GameObject } = require("./engine.gameObject");
const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { aircraftBehaviour } = require("./game.aircraftBehaviour");
const { cameraBehaviour } = require("./game.cameraBehaviour");
const { handleGuiSight } = require("./game.handleGuiSight");
const { initHandleLevel } = require("./game.initHandleLevel");

const handleLevel = () => {
  const resources = engineResources;
  initHandleLevel();

  Input.lockPointer();
  Input.keyboard.onRelease["Escape"] = () => {
    Input.keyboard.onRelease["Escape"] = undefined;
    Game.stop();
    require("./game.handleStartMenu").handleStartMenu();
  };

  const skybox = resources.gameObjects.skybox;
  /**
   * @type {GameObject}
   */
  const aircraft = resources.gameObjects.aircraft;
  /**
   * @type {GameObject}
   */
  const gate01 = resources.gameObjects.gate01;

  const sightPosition = {
    posX: 0,
    posY: 0,
  };
  const sightScale = 0.1;
  const sightSensitivity = 0.002;
  const gate01Position = new Vector3(0, 10, -100);

  aircraftBehaviour.aircraftPosition = new Vector3();
  aircraftBehaviour.aircraftRotation = new Vector3();

  Game.update = () => {
    cameraBehaviour.followAircraft();
    aircraftBehaviour.handleAircraftMovement(sightPosition);

    skybox.transform.reset();
    skybox.transform.translate(cameraBehaviour.cameraPosition);
    skybox.transform.applyLocation();

    gate01.transform.reset();
    gate01.transform.translate(gate01Position);
    gate01.transform.applyLocation();

    handleGuiSight(sightPosition, sightSensitivity);

    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox);
    Renderer.enableDepthTest();

    Renderer.drawGameObject(aircraft);
    Renderer.drawGameObject(gate01);

    Renderer.enableAlphaBlend();
    Renderer.drawGUIElement(resources.textures.gui_sight, {
      posX: sightPosition.posX,
      posY: sightPosition.posY,
      scaleX: sightScale,
      scaleY: sightScale,
    });
    Renderer.disableAlphaBlend();
  };

  Game.start();
};

exports.handleLevel = handleLevel;
