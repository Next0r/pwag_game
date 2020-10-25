const { Game } = require("./engine.game");
const { Vector3 } = require("./engine.math.vector3");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { initStartMenu } = require("./game.initStartMenu");
const { GameObject } = require("./engine.gameObject");
const { Time } = require("./engine.time");
const { Input } = require("./engine.input");

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
  const camera = resources.gameObjects.camera;

  let camRotationY = 0;
  let textSize = 0.075;
  let cameraOffset = 12;

  Game.update = () => {
    camRotationY += Time.delta * 2;

    camera.transform.reset();
    camera.transform.rotateY(camRotationY);
    camera.transform.applyRotation();
    camera.transform.rotateX(-45);
    camera.transform.applyRotation();
    camera.transform.translate(new Vector3(0, 0, cameraOffset));
    camera.transform.applyLocation();

    textSize + Math.sin(Time.now * 5);

    Renderer.drawGameObject(aircraft);
    Renderer.drawGameObject(concrete);

    Renderer.enableAlphaBlend();
    Renderer.drawString("Press [SPACE] to start", {
      posX: 0,
      posY: -0.5,
      size: textSize + Math.sin(Time.now * Math.PI) * textSize * 0.1,
      charWidth: 0.55,
      center: true,
    });
    Renderer.disableAlphaBlend();
  };

  Game.start();
};

exports.handleStartMenu = handleStartMenu;
