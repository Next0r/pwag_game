const { CreateBoxCollider } = require("./engine.boxCollider");
const { CollisionSystem } = require("./engine.collisionSystem");
const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { guiSightBehaviour } = require("./game.guiSightBehaviour");

const aircraftController = {
  aircraftRotation: new Vector3(),
  rotPerSec: 60,
  zRotPerSec: 80,
  maxAcZRot: 60,
  aircraftVelocity: 30,
  aircraftPosition: new Vector3(0, 15, 0),
  rotBackSpeed: 3,
  onCollision: () => {},

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
    const posX = guiSightBehaviour.posX;
    const posY = guiSightBehaviour.posY;
    const rot = this.aircraftRotation;
    let neutralRotation = Math.sin(posX * Math.PI * 0.5) * this.maxAcZRot;

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
      // lerp
      rot.z +=
        (this.rotBackSpeed *
          Time.delta *
          (neutralRotation - rot.z) *
          (180 - Math.abs(rot.z))) /
        180;
    }

    this.aircraftRotation.y -= posX * Time.delta * this.rotPerSec;
    this.aircraftRotation.x += posY * Time.delta * this.rotPerSec;

    aircraft.transform.reset();
    aircraft.transform.translate(this.aircraftPosition);
    aircraft.transform.applyLocation();
    aircraft.transform.rotateY(this.aircraftRotation.y);
    aircraft.transform.rotateX(this.aircraftRotation.x);
    aircraft.transform.rotateZ(this.aircraftRotation.z);
    aircraft.transform.applyRotation();
    aircraft.transform.translate(
      new Vector3(0, 0, -this.aircraftVelocity * Time.delta)
    );
    aircraft.transform.applyLocation();
    this.aircraftPosition = aircraft.transform.matrix.getPosition();
  },
};

exports.aircraftController = aircraftController;
