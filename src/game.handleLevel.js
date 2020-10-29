const { CreateBoxCollider } = require("./engine.boxCollider");
const { CollisionSystem } = require("./engine.collisionSystem");
const { Game } = require("./engine.game");
const { GameObject } = require("./engine.gameObject");
const { Input } = require("./engine.input");
const { CreateVector2 } = require("./engine.math.vector2");
const { Vector3 } = require("./engine.math.vector3");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { EngineToolbox } = require("./engine.toolbox");
const { aircraftController } = require("./game.aircraftController");
const { cameraController } = require("./game.cameraController");
const { gateController } = require("./game.gateController");
const { CreateJumpText, CreateSimpleText } = require("./game.guiText");
const { guiSightController } = require("./game.guiSightController");
const { initLevel } = require("./game.initLevel");
const { level0Controller } = require("./game.level0Controller");
const { skyboxBehaviour } = require("./game.skyboxBehaviour");
const { waterController, CreateWater } = require("./game.waterController");

const handleLevel = () => {
  const resources = engineResources;
  initLevel();

  Input.lockPointer();
  Input.keyboard.onRelease["Escape"] = () => {
    Input.keyboard.onRelease["Escape"] = undefined;
    Game.stop();
    require("./game.handleStartMenu").handleStartMenu();
  };

  const skybox = resources.gameObjects.skybox;
  const aircraft = resources.gameObjects.aircraft;

  const jumpText = CreateJumpText();
  const altText = CreateSimpleText({ posX: -0.95, posY: -0.9 });
  const spdText = CreateSimpleText({ posX: -0.95, posY: -0.8 });
  const scoreText = CreateSimpleText({ posX: -0.95, posY: 0.9 });

  waterController.init().addCollider();
  level0Controller.init();
  aircraftController.addCollider();

  const pointsPerGate = 50;
  let lastScore = 0;

  gateController.onGateScore = (gate) => {
    jumpText.resetTimer();
    const rotZ = aircraftController.rotation.z;
    console.log(aircraftController.rotation.z);
    let bonus = 0;
    switch (gate.type) {
      case "T":
        if (rotZ <= 90 && rotZ >= -90) {
          bonus = (1 - Math.abs(rotZ) / 90) * pointsPerGate;
        }
        break;
      case "B":
        if (Math.abs(rotZ) >= 90) {
          bonus = ((Math.abs(rotZ) - 90) / 90) * pointsPerGate;
          console.log(bonus);
        }
        break;
      case "R":
        if (rotZ >= 0 && rotZ <= 180) {
          bonus = (1 - Math.abs(rotZ - 90) / 90) * pointsPerGate;
        }
        break;
      case "L":
        if (rotZ <= 0 && rotZ >= -180) {
          bonus = (1 - Math.abs(rotZ + 90) / 90) * pointsPerGate;
        }
        break;
    }
    lastScore = Math.ceil(bonus) + pointsPerGate;
    score += lastScore;
  };

  gateController.onLastGateScore = (gate) => {
    gateController.onGateScore(gate);
    console.log("finished!");
  };

  cameraController.cameraOffset = new Vector3(0, 3, 20);

  let score = 0;
  let scoreAnimated = score;

  EngineToolbox.getCanvas().addEventListener("click", () => {
    Input.lockPointer();
  });

  Game.update = () => {
    if (scoreAnimated < score) {
      scoreAnimated += 1;
    }

    cameraController.followAircraft();
    aircraftController.fly();
    skyboxBehaviour.followCamera();
    guiSightController.followMouse();
    gateController.bounceNextGate().blinkNextGate();
    waterController.animate().updateCollider();

    CollisionSystem.checkCollisions();

    Renderer.clear();
    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox);
    Renderer.enableDepthTest();

    waterController.draw();
    Renderer.drawGameObject(aircraft);
    gateController.draw();

    Renderer.enableAlphaBlend();
    jumpText.draw(lastScore.toString());
    altText.draw(
      `Alt: ${aircraftController.position.y.toFixed(1).toString(2)}`
    );
    spdText.draw(
      `Spd: ${(aircraftController.speed * 3.6).toFixed(1).toString()}`
    );
    scoreText.draw(`Score: ${scoreAnimated.toString()}`);
    guiSightController.draw();

    Renderer.disableAlphaBlend();
  };

  Game.start();
};

exports.handleLevel = handleLevel;
