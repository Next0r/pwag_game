const { Game } = require("./engine.game");
const { Vector3 } = require("./engine.math.vector3");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { initStartMenu } = require("./game.initStartMenu");
const { GameObject } = require("./engine.gameObject");
const { Time } = require("./engine.time");
const { Input } = require("./engine.input");
const { cameraController: cameraBehaviour } = require("./game.cameraController");
const { CreateResizingText } = require("./game.guiText");
const { aircraftController } = require("./game.aircraftController");

const handleStartMenu = () => {
  const resources = engineResources;
  initStartMenu();

  Input.keyboard.onRelease["Space"] = function () {
    Input.keyboard.onRelease = [];
    Game.stop();
    require("./game.handleLevel").handleLevel();
  };

  /**
   * @type {GameObject}
   */
  const aircraft = engineResources.gameObjects.aircraft;
  aircraft.transform.reset();
  aircraft.transform.translate(new Vector3(0,0.8,0));
  aircraft.transform.applyLocation();
  aircraft.transform.rotateY(180);
  aircraft.transform.applyRotation();
  aircraft.transform.rotateX(10);
  aircraft.transform.applyRotation();

  aircraftController.reset();
  aircraftController.propellerRotationSpeed = 500;

  const concrete = resources.gameObjects.concrete;

  cameraBehaviour.cameraRotation = new Vector3(-45, 0, 0);
  cameraBehaviour.cameraOffset = new Vector3(0, 0, 12);
  const cameraRotationSpeed = 2;

  const resizingText = CreateResizingText();

  Game.update = () => {
    cameraBehaviour.cameraRotation.y += Time.delta * cameraRotationSpeed;
    cameraBehaviour.rotateAround();

    
    aircraftController.transformParts();

    Renderer.clear();
    aircraftController.draw(true);

    Renderer.drawGameObject(concrete);

    Renderer.enableAlphaBlend();
    resizingText.draw("Press [SPACE] to start");
    Renderer.disableAlphaBlend();
  };

  Game.start();
};

exports.handleStartMenu = handleStartMenu;
