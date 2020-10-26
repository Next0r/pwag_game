const { CreateBoxCollider } = require("./engine.boxCollider");
const { CollisionSystem } = require("./engine.collisionSystem");
const { Game } = require("./engine.game");
const { GameObject } = require("./engine.gameObject");
const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { EngineToolbox } = require("./engine.toolbox");
const { aircraftBehaviour } = require("./game.aircraftBehaviour");
const { cameraBehaviour } = require("./game.cameraBehaviour");
const { gateController } = require("./game.gateController");
const { guiSightBehaviour } = require("./game.guiSightBehaviour");
const { initLevel } = require("./game.initLevel");
const { skyboxBehaviour } = require("./game.skyboxBehaviour");

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
  const gate01 = gateController.spawnGate("B");
  const gate02 = gateController.spawnGate("R");

  gate01.translate(new Vector3(0, 0, -100));
  gate02
    .translate(new Vector3(50, 0, -200))
    .rotateY(-30)
    .applyRotation()
    .signOff()
    .signOff();

  const sightScale = 0.1;

  const acCollider = CreateBoxCollider("acCollider");
  acCollider.recalculate(engineResources.meshes.aircraft_mock_collider);

  acCollider.transformationMatrix = aircraft.transform.matrix;
  CollisionSystem.colliders.push(acCollider);

  const gateCollider = CreateBoxCollider("gateCollider");
  gateCollider.recalculate(engineResources.meshes.gate_score_collider);
  gateCollider.transformationMatrix = gate01.gate.transform.matrix;
  CollisionSystem.colliders.push(gateCollider);

  const c1 = CreateBoxCollider("c1");
  c1.recalculate(engineResources.meshes.gate_collider_01);
  c1.transformationMatrix = gate01.gate.transform.matrix;

  const c2 = CreateBoxCollider("c2");
  c2.recalculate(engineResources.meshes.gate_collider_02);
  c2.transformationMatrix = gate01.gate.transform.matrix;

  const c3 = CreateBoxCollider("c3");
  c3.recalculate(engineResources.meshes.gate_collider_03);
  c3.transformationMatrix = gate01.gate.transform.matrix;

  CollisionSystem.colliders.push(c1, c2, c3);

  acCollider.onCollide = (id) => {
    if (id === "c1" || id === "c2" || id === "c3") {
      console.log("Gate hit!");
    }
  };

  aircraftBehaviour.aircraftPosition = new Vector3();
  aircraftBehaviour.aircraftRotation = new Vector3();
  cameraBehaviour.cameraOffset = new Vector3(0, 3, 15);
  // aircraftBehaviour.aircraftVelocity = 0;

  EngineToolbox.getCanvas().addEventListener("click", () => {
    Input.lockPointer();
  });

  Game.update = () => {
    // if (Input.keyboard.isDown("KeyW")) {
    //   aircraftBehaviour.aircraftVelocity = 10;
    // } else if (Input.keyboard.isDown("KeyS")) {
    //   aircraftBehaviour.aircraftVelocity = -10;
    // } else {
    //   aircraftBehaviour.aircraftVelocity = 0;
    // }

    cameraBehaviour.followAircraft();
    aircraftBehaviour.fly();
    skyboxBehaviour.followCamera();

    guiSightBehaviour.followMouse();

    gate01.blink(0.5);
    gate01.bounce();

    CollisionSystem.checkCollisions();

    Renderer.clear();

    Renderer.disableDepthTest();
    Renderer.drawGameObject(skybox);
    Renderer.enableDepthTest();

    Renderer.drawGameObject(aircraft);
    gate01.draw();
    gate02.draw();

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
