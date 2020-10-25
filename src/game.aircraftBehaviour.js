const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { guiSightBehaviour } = require("./game.guiSightBehaviour");

const aircraftBehaviour = {
  aircraft: engineResources.gameObjects.aircraft,
  aircraftRotation: new Vector3(),
  acRotPerSec: 60,
  maxAcZRot: 30,
  aircraftVelocity: 20,
  aircraftPosition: new Vector3(),

  fly() {
    const aircraft = engineResources.gameObjects.aircraft;
    const posX = guiSightBehaviour.posX;
    const posY = guiSightBehaviour.posY;

    this.aircraftRotation.y -= posX * Time.delta * this.acRotPerSec;
    this.aircraftRotation.x += posY * Time.delta * this.acRotPerSec;

    aircraft.transform.reset();
    aircraft.transform.translate(this.aircraftPosition);
    aircraft.transform.applyLocation();
    aircraft.transform.rotateY(this.aircraftRotation.y);
    aircraft.transform.rotateX(this.aircraftRotation.x);
    aircraft.transform.rotateZ(posX * this.maxAcZRot);
    aircraft.transform.applyRotation();
    aircraft.transform.translate(
      new Vector3(0, 0, -this.aircraftVelocity * Time.delta)
    );
    aircraft.transform.applyLocation();
    this.aircraftPosition = aircraft.transform.matrix.getPosition();
  },
};

exports.aircraftBehaviour = aircraftBehaviour;
