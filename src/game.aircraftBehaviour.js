const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");

const aircraftBehaviour = {
  aircraft: engineResources.gameObjects.aircraft,
  aircraftRotation: new Vector3(),
  acRotPerSec: 60,
  maxAcZRot: 30,
  aircraftVelocity: 20,
  aircraftPosition: new Vector3(),

  handleAircraftMovement(sightPosition = { posX: 0, posY: 0 }) {
    this.aircraftRotation.y -=
      sightPosition.posX * Time.delta * this.acRotPerSec;
    this.aircraftRotation.x +=
      sightPosition.posY * Time.delta * this.acRotPerSec;

    this.aircraft.transform.reset();
    this.aircraft.transform.translate(this.aircraftPosition);
    this.aircraft.transform.applyLocation();
    this.aircraft.transform.rotateY(this.aircraftRotation.y);
    this.aircraft.transform.rotateX(this.aircraftRotation.x);
    this.aircraft.transform.rotateZ(sightPosition.posX * this.maxAcZRot);
    this.aircraft.transform.applyRotation();
    this.aircraft.transform.translate(
      new Vector3(0, 0, -this.aircraftVelocity * Time.delta)
    );
    this.aircraft.transform.applyLocation();
    this.aircraftPosition = this.aircraft.transform.matrix.position();
  },
};

exports.aircraftBehaviour = aircraftBehaviour;
