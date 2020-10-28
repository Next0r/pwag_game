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
const { cameraBehaviour } = require("./game.cameraBehaviour");
const { gateController } = require("./game.gateController");
const { CreateJumpText, CreateSimpleText } = require("./game.guiText");
const { guiSightBehaviour } = require("./game.guiSightBehaviour");
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

  waterController.init();
  level0Controller.initialize();

  let score = 0;
  let scoreAnimated = score;

  gateController.onGateScore = (gate) => {
    jumpText.resetTimer();
    score += 100;
    console.log(gate.type);
  };

  gateController.onLastGateScore = (gate) => {
    jumpText.resetTimer();
    score += 100;
    console.log("finished!");
  };

  const sightScale = 0.1;

  /**
   *
   * @param {String} colliderID
   */
  aircraftController.onCollision = (colliderID) => {
    const [tag] = colliderID.split("_");
    if (tag == "GATE") {
      gateController.handleScoreCollision(colliderID);
    } else {
      console.log(`${colliderID} hit!`);
    }
  };
  aircraftController.addCollider();
  // aircraftController.aircraftVelocity = 0;

  cameraBehaviour.cameraOffset = new Vector3(0, 3, 20);

  EngineToolbox.getCanvas().addEventListener("click", () => {
    Input.lockPointer();
  });

  let aircraftSpeed = (aircraftController.aircraftVelocity * 3.6).toFixed(1);

  Game.update = () => {
    if (scoreAnimated < score) {
      scoreAnimated += 1;
    }

    cameraBehaviour.followAircraft();
    aircraftController.fly();
    skyboxBehaviour.followCamera();
    guiSightBehaviour.followMouse();
    gateController.bounceNextGate().blinkNextGate();
    waterController.animate();

    CollisionSystem.checkCollisions();

    Renderer.clear();
    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox);
    Renderer.enableDepthTest();

    waterController.draw();
    Renderer.drawGameObject(aircraft);
    gateController.draw();

    Renderer.enableAlphaBlend();
    jumpText.draw("100");
    altText.draw(
      `Alt: ${aircraftController.aircraftPosition.y.toFixed(1).toString(2)}`
    );
    spdText.draw(`Spd: ${aircraftSpeed.toString()}`);
    scoreText.draw(`Score: ${scoreAnimated.toString()}`);

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
