const { Input } = require("./engine.input");
const { engineResources } = require("./engine.resources");

const guiSightBehaviour = {
  posX: 0,
  posY: 0,
  sensitivity: 0.002,
  followMouse() {
    const movementX = Input.mouse.movementX * this.sensitivity;
    const movementY =
      Input.mouse.movementY *
      this.sensitivity *
      engineResources.gameObjects.camera.projection.aspect;

    if (!movementX && !movementY) {
      return;
    }

    if (this.posX > -1 && movementX < 0) {
      this.posX += movementX;
    } else if (this.posX <= -1 && movementX > 0) {
      this.posX += movementX;
    }

    if (this.posX < 1 && movementX > 0) {
      this.posX += movementX;
    } else if (this.posX >= 1 && movementX < 0) {
      this.posX += movementX;
    }

    if (this.posX < -1) {
      this.posX = -1;
    } else if (this.posX > 1) {
      this.posX = 1;
    }

    if (this.posY > -1 && movementY < 0) {
      this.posY += movementY;
    } else if (this.posY <= -1 && movementY > 0) {
      this.posY += movementY;
    }

    if (this.posY < 1 && movementY > 0) {
      this.posY += movementY;
    } else if (this.posY >= 1 && movementY < 0) {
      this.posY += movementY;
    }

    if (this.posY > 1) {
      this.posY = 1;
    } else if (this.posY < -1) {
      this.posY = -1;
    }
  },
};

exports.guiSightBehaviour = guiSightBehaviour;
