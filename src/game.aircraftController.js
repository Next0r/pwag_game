const { CreateBoxCollider } = require("./engine.boxCollider");
const { CollisionSystem } = require("./engine.collisionSystem");
const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { gateController } = require("./game.gateController");
const { guiSightController } = require("./game.guiSightController");

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
  /**
   * @param {String} colliderID
   */
  onCollision: () => {},

  reset() {
    this.rotation = new Vector3();
    this.speed = (this.speedMax + this.speedMin) * 0.5;
    this.position = new Vector3(0, 15, 0);
    return this;
  },

  addCollider() {
    const aircraft = engineResources.gameObjects.aircraft;
    const collider = CreateBoxCollider("aircraftCollider");
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
  },
};

exports.aircraftController = aircraftController;
