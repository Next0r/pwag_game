const { BoxCollider } = require("./engine.boxCollider");
const { CollisionSystem } = require("./engine.collisionSystem");
const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { gateController } = require("./game.gateController");
const { guiSightController } = require("./game.guiSightController");
const { GameObject } = require("./engine.gameObject");
const { Renderer } = require("./engine.renderer");

const aircraftController = {
  rotation: new Vector3(),
  rotPerSec: 60,
  zRotPerSec: 80,
  maxAcZRot: 60,
  speed: 30,
  speedMax: 50,
  speedMin: 20,
  acceleration: 2,
  position: new Vector3(0, 15, 0),
  rotBackSpeed: 3,
  propellerRotationZ: 0,
  propellerRotationSpeed: 1200,
  rudderMaxRotation: 40,
  elevatorMaxRotation: 45,
  flapRotationSpeed: 5,
  _flapRRotation: 0,
  _flapLRotation: 0,

  /**
   * @param {String} colliderID
   */
  onCollision: () => {},

  draw(realPropeller = false) {
    Renderer.drawGameObject(engineResources.gameObjects.aircraft);
    Renderer.drawGameObject(engineResources.gameObjects.flapL);
    Renderer.drawGameObject(engineResources.gameObjects.flapR);
    Renderer.drawGameObject(engineResources.gameObjects.elevatorR);
    Renderer.drawGameObject(engineResources.gameObjects.elevatorL);
    Renderer.drawGameObject(engineResources.gameObjects.rudder);
    if (!realPropeller) {
      Renderer.drawGameObject(engineResources.gameObjects.spinner);
      Renderer.enableAlphaBlend();
      Renderer.drawGameObject(engineResources.gameObjects.propellerPlane);
      Renderer.disableAlphaBlend();
    } else {
      Renderer.drawGameObject(engineResources.gameObjects.propeller);
    }
    return this;
  },

  transformParts() {
    /**
     * @type {GameObject}
     */
    const aircraft = engineResources.gameObjects.aircraft;

    const flapL = engineResources.gameObjects.flapL;
    flapL.transform.reset();
    flapL.transform.translate(new Vector3(-2.495, 0.332, 0.263));
    flapL.transform.rotateY(-9.82);
    flapL.transform.applyLocation();
    flapL.transform.applyRotation();
    flapL.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(flapL.transform.matrix);

    const flapR = engineResources.gameObjects.flapR;
    flapR.transform.reset();
    flapR.transform.translate(new Vector3(2.495, 0.332, 0.263));
    flapR.transform.rotateY(9.82);
    flapR.transform.applyLocation();
    flapR.transform.applyRotation();
    flapR.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(flapR.transform.matrix);

    let flapLTargetRotation;
    let flapRTargetRotation;

    if (Input.keyboard.isDown("KeyD")) {
      flapLTargetRotation = this.elevatorMaxRotation;
      flapRTargetRotation = -this.elevatorMaxRotation;
    } else if (Input.keyboard.isDown("KeyA")) {
      flapLTargetRotation = -this.elevatorMaxRotation;
      flapRTargetRotation = this.elevatorMaxRotation;
    } else {
      flapLTargetRotation =
        guiSightController.posY * this.elevatorMaxRotation * 0.5;
      flapRTargetRotation =
        guiSightController.posY * this.elevatorMaxRotation * 0.5;
    }

    // lerp
    this._flapLRotation +=
      Time.delta *
      this.flapRotationSpeed *
      (flapLTargetRotation - this._flapLRotation);
    this._flapRRotation +=
      Time.delta *
      this.flapRotationSpeed *
      (flapRTargetRotation - this._flapRRotation);

    flapL.transform.rotateX(this._flapLRotation);
    flapL.transform.applyRotation();
    flapR.transform.rotateX(this._flapRRotation);
    flapR.transform.applyRotation();

    const elevatorR = engineResources.gameObjects.elevatorR;
    elevatorR.transform.reset();
    elevatorR.transform.translate(new Vector3(-0.647, 0.556, 3.281));
    elevatorR.transform.applyLocation();
    elevatorR.transform.rotateX(
      guiSightController.posY * this.elevatorMaxRotation
    );
    elevatorR.transform.applyRotation();
    elevatorR.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(elevatorR.transform.matrix);

    const elevatorL = engineResources.gameObjects.elevatorL;
    elevatorL.transform.reset();
    elevatorL.transform.translate(new Vector3(0.647, 0.556, 3.281));
    elevatorL.transform.applyLocation();
    elevatorL.transform.rotateX(
      guiSightController.posY * this.elevatorMaxRotation
    );
    elevatorL.transform.applyRotation();
    elevatorL.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(elevatorL.transform.matrix);

    const rudder = engineResources.gameObjects.rudder;
    rudder.transform.reset();
    rudder.transform.translate(new Vector3(0, 0.506, 3.453));
    rudder.transform.applyLocation();
    rudder.transform.rotateY(guiSightController.posX * this.rudderMaxRotation);
    rudder.transform.applyRotation();
    rudder.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(rudder.transform.matrix);

    const propeller = engineResources.gameObjects.propeller;
    propeller.transform.reset();
    propeller.transform.translate(new Vector3(0, 0.335, -1.882));
    propeller.transform.applyLocation();
    this.propellerRotationZ -= Time.delta * this.propellerRotationSpeed;
    propeller.transform.rotateZ(this.propellerRotationZ);
    propeller.transform.applyRotation();
    propeller.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(propeller.transform.matrix);

    const propellerPlane = engineResources.gameObjects.propellerPlane;
    propellerPlane.transform.reset();
    propellerPlane.transform.translate(new Vector3(0, 0.335, -1.882));
    propellerPlane.transform.applyLocation();
    propellerPlane.transform.rotateZ(this.propellerRotationZ);
    propellerPlane.transform.applyRotation();
    propellerPlane.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(propellerPlane.transform.matrix);

    const spinner = engineResources.gameObjects.spinner;
    spinner.transform.reset();
    spinner.transform.translate(new Vector3(0, 0.335, -1.882));
    spinner.transform.applyLocation();
    spinner.transform.rotateZ(this.propellerRotationZ);
    spinner.transform.applyRotation();
    spinner.transform.matrix = aircraft.transform.matrix
      .clone()
      .multiply(spinner.transform.matrix);

    return this;
  },

  reset() {
    this.rotation = new Vector3();
    this.speed = (this.speedMax + this.speedMin) * 0.5;
    this.position = new Vector3(0, 15, 0);
    this.propellerRotationSpeed = 1200;
    return this;
  },

  addCollider() {
    const aircraft = engineResources.gameObjects.aircraft;
    const collider = new BoxCollider("aircraftCollider");
    collider.recalculate(engineResources.meshes.aircraft_mock_collider);
    collider.transformationMatrix = aircraft.transform.matrix;
    CollisionSystem.colliders.push(collider);
    aircraft.colliders.push(collider);
    collider.onCollision = this.onCollision;
    return this;
  },

  fly() {
    const aircraft = engineResources.gameObjects.aircraft;
    const posX = guiSightController.posX;
    const posY = guiSightController.posY;
    const rot = this.rotation;
    let neutralRotation = Math.sin(posX * Math.PI * 0.5) * this.maxAcZRot;
    // handle rotation
    if (Input.keyboard.isDown("KeyD") || Input.keyboard.isDown("KeyA")) {
      if (Input.keyboard.isDown("KeyD")) {
        rot.z += Time.delta * this.zRotPerSec;
        rot.z > 180 && (rot.z = -180);
      }
      if (Input.keyboard.isDown("KeyA")) {
        rot.z -= Time.delta * this.zRotPerSec;
        rot.z < -180 && (rot.z = 180);
      }
    } else {
      // lerp rotation
      rot.z +=
        (this.rotBackSpeed *
          Time.delta *
          (neutralRotation - rot.z) *
          (180 - Math.abs(rot.z))) /
        180;
    }
    this.rotation.y -= posX * Time.delta * this.rotPerSec;
    this.rotation.x += posY * Time.delta * this.rotPerSec;

    // handle speed
    let neutralSpeed = (this.speedMax + this.speedMin) * 0.5;
    if (Input.keyboard.isDown("KeyW")) {
      neutralSpeed = this.speedMax;
    } else if (Input.keyboard.isDown("KeyS")) {
      neutralSpeed = this.speedMin;
    }

    // lerp speed
    this.speed += Time.delta * this.acceleration * (neutralSpeed - this.speed);

    aircraft.transform.reset();
    aircraft.transform.translate(this.position);
    aircraft.transform.applyLocation();
    aircraft.transform.rotateY(this.rotation.y);
    aircraft.transform.rotateX(this.rotation.x);
    aircraft.transform.rotateZ(this.rotation.z);
    aircraft.transform.applyRotation();
    aircraft.transform.translate(new Vector3(0, 0, -this.speed * Time.delta));
    aircraft.transform.applyLocation();
    this.position = aircraft.transform.matrix.getPosition();

    this.transformParts();
  },
};

exports.aircraftController = aircraftController;
