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

  waterController.init();

  level0Controller.initialize();

  let score = 0;

  gateController.onGateScore = (gate) => {
    console.log(gate.type);
    score += 100;
    console.log(score);
  };

  gateController.onLastGateScore = (gate) => {
    score += 100;
    console.log(score);
    console.log("finished!");
  };

  const sightScale = 0.1;

  aircraftController.onCollision = (colliderID) => {
    gateController.handleScoreCollision(colliderID);
  };
  aircraftController.addCollider();
  // aircraftController.aircraftVelocity = 0;

  cameraBehaviour.cameraOffset = new Vector3(0, 3, 20);

  EngineToolbox.getCanvas().addEventListener("click", () => {
    Input.lockPointer();
  });

  Game.update = () => {
    cameraBehaviour.followAircraft();
    aircraftController.fly();
    skyboxBehaviour.followCamera();

    guiSightBehaviour.followMouse();

    gateController.bounceNextGate().blinkNextGate();

    CollisionSystem.checkCollisions();

    waterController.animate();
    
    Renderer.clear();

    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox);
    Renderer.enableDepthTest();

    waterController.draw();
    Renderer.drawGameObject(aircraft);

    for (let gate of gateController.gates) {
      gate.draw();
    }

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
