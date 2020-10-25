const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");

/**
 *
 * @param {Number} guiSightSensitivity
 */
const handleGuiSight = (
  position = { posX: 0, posY: 0 },
  guiSightSensitivity
) => {
  const movementX = Input.mouse.movementX * guiSightSensitivity;
  const movementY =
    Input.mouse.movementY *
    guiSightSensitivity *
    engineResources.gameObjects.camera.projection.aspect;

  if (!movementX && !movementY) {
    return;
  }

  if (position.posX > -1 && movementX < 0) {
    position.posX += movementX;
  } else if (position.posX <= -1 && movementX > 0) {
    position.posX += movementX;
  }

  if (position.posX < 1 && movementX > 0) {
    position.posX += movementX;
  } else if (position.posX >= 1 && movementX < 0) {
    position.posX += movementX;
  }

  if (position.posX < -1) {
    position.posX = -1;
  } else if (position.posX > 1) {
    position.posX = 1;
  }

  if (position.posY > -1 && movementY < 0) {
    position.posY += movementY;
  } else if (position.posY <= -1 && movementY > 0) {
    position.posY += movementY;
  }

  if (position.posY < 1 && movementY > 0) {
    position.posY += movementY;
  } else if (position.posY >= 1 && movementY < 0) {
    position.posY += movementY;
  }

  if (position.posY > 1) {
    position.posY = 1;
  } else if (position.posY < -1) {
    position.posY = -1;
  }
};

exports.handleGuiSight = handleGuiSight;
