const { Game } = require("./engine.game");
const { GameObject } = require("./engine.gameObject");
const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { aircraftBehaviour } = require("./game.aircraftBehaviour");
const { cameraBehaviour } = require("./game.cameraBehaviour");
const { guiSightBehaviour } = require("./game.guiSightBehaviour");
const { initHandleLevel } = require("./game.initHandleLevel");
const { skyboxBehaviour } = require("./game.skyboxBehaviour");

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
  const aircraft = resources.gameObjects.aircraft;
  const gate01 = resources.gameObjects.gate01;

  const sightScale = 0.1;
  const gate01Position = new Vector3(0, 10, -100);

  aircraftBehaviour.aircraftPosition = new Vector3();
  aircraftBehaviour.aircraftRotation = new Vector3();

  Game.update = () => {
    cameraBehaviour.followAircraft();
    aircraftBehaviour.fly();
    skyboxBehaviour.followCamera();

    gate01.transform.reset();
    gate01.transform.translate(gate01Position);
    gate01.transform.applyLocation();

    guiSightBehaviour.followMouse();

    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox);
    Renderer.enableDepthTest();

    Renderer.drawGameObject(aircraft);
    Renderer.drawGameObject(gate01);

    Renderer.enableAlphaBlend();
    Renderer.drawGUIElement(resources.textures.gui_sight, {
      posX: guiSightBehaviour.posX,
      posY: guiSightBehaviour.posY,
      scaleX: sightScale,
      scaleY: sightScale,
    });
    Renderer.disableAlphaBlend();
  };

  Game.start();
};

exports.handleLevel = handleLevel;
