const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { aircraftBehaviour } = require("./game.aircraftBehaviour");

const cameraBehaviour = {
  camera: engineResources.gameObjects.camera,
  cameraOffset: new Vector3(0, 3, 15),
  cameraPosition: new Vector3(),

  followAircraft() {
    const aircraftPosition = aircraftBehaviour.aircraftPosition;
    const aircraftRotation = aircraftBehaviour.aircraftRotation;

    this.camera.transform.reset();
    this.camera.transform.translate(aircraftPosition);
    this.camera.transform.applyLocation();
    this.camera.transform.rotateY(aircraftRotation.y);
    this.camera.transform.rotateX(aircraftRotation.x);
    this.camera.transform.applyRotation();
    this.camera.transform.translate(this.cameraOffset);
    this.camera.transform.applyLocation();

    this.cameraPosition = this.camera.transform.matrix.position();
  },
};

exports.cameraBehaviour = cameraBehaviour;
