const { Game } = require("./engine.game");
const { Vector3 } = require("./engine.math.vector3");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { initStartMenu } = require("./game.initStartMenu");
const { GameObject } = require("./engine.gameObject");
const { Time } = require("./engine.time");
const { Input } = require("./engine.input");
const { cameraBehaviour } = require("./game.cameraBehaviour");
const { CreateResizingText } = require("./game.guiText");

const handleStartMenu = () => {
  const resources = engineResources;
  initStartMenu();

  Input.keyboard.onRelease["Space"] = function () {
    Input.keyboard.onRelease["Space"] = undefined;
    Game.stop();
    require("./game.handleLevel").handleLevel();
  };

  const aircraft = resources.gameObjects.startMenuAircraft;
  const concrete = resources.gameObjects.concrete;

  cameraBehaviour.cameraRotation = new Vector3(-45, 0, 0);
  cameraBehaviour.cameraOffset = new Vector3(0, 0, 12);
  const cameraRotationSpeed = 2;

  const resizingText = CreateResizingText();

  Game.update = () => {
    cameraBehaviour.cameraRotation.y += Time.delta * cameraRotationSpeed;
    cameraBehaviour.rotateAround();

    Renderer.clear();
    
    Renderer.drawGameObject(aircraft);
    Renderer.drawGameObject(concrete);

    Renderer.enableAlphaBlend();
    resizingText.draw("Press [SPACE] to start");
    Renderer.disableAlphaBlend();
  };

  Game.start();
};

exports.handleStartMenu = handleStartMenu;
