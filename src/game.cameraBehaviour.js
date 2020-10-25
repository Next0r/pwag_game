const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { aircraftBehaviour } = require("./game.aircraftBehaviour");

const cameraBehaviour = {
  cameraOffset: new Vector3(0, 3, 15),
  cameraPosition: new Vector3(),
  cameraRotation: new Vector3(),

  followAircraft() {
    const aircraftPosition = aircraftBehaviour.aircraftPosition;
    const aircraftRotation = aircraftBehaviour.aircraftRotation;
    const camera = engineResources.gameObjects.camera;

    camera.transform.reset();
    camera.transform.translate(aircraftPosition);
    camera.transform.applyLocation();
    camera.transform.rotateY(aircraftRotation.y);
    camera.transform.rotateX(aircraftRotation.x);
    camera.transform.applyRotation();
    camera.transform.translate(this.cameraOffset);
    camera.transform.applyLocation();

    this.cameraPosition = camera.transform.matrix.getPosition();
  },

  rotateAround() {
    const camera = engineResources.gameObjects.camera;
    camera.transform.reset();
    camera.transform.rotateY(this.cameraRotation.y);
    camera.transform.applyRotation();
    camera.transform.rotateX(this.cameraRotation.x);
    camera.transform.applyRotation();
    camera.transform.translate(this.cameraOffset);
    camera.transform.applyLocation();
  },
};

exports.cameraBehaviour = cameraBehaviour;
