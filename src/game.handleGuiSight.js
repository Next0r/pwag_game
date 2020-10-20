const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");

/**
 *
 * @param {Vector3} guiSightPosition
 * @param {Number} guiSightSensitivity
 */
const handleGuiSight = (guiSightPosition, guiSightSensitivity) => {
  const movementX = Input.mouse.movementX * guiSightSensitivity;
  const movementY = Input.mouse.movementY * guiSightSensitivity;

  if (!movementX && !movementY) {
    return;
  }

  if (guiSightPosition.x > -1 && movementX < 0) {
    guiSightPosition.x += movementX;
  } else if (guiSightPosition.x <= -1 && movementX > 0) {
    guiSightPosition.x += movementX;
  }

  if (guiSightPosition.x < 1 && movementX > 0) {
    guiSightPosition.x += movementX;
  } else if (guiSightPosition.x >= 1 && movementX < 0) {
    guiSightPosition.x += movementX;
  }

  if (guiSightPosition.x < -1) {
    guiSightPosition.x = -1;
  } else if (guiSightPosition.x > 1) {
    guiSightPosition.x = 1;
  }

  if (guiSightPosition.y > -1 && movementY < 0) {
    guiSightPosition.y += movementY;
  } else if (guiSightPosition.y <= -1 && movementY > 0) {
    guiSightPosition.y += movementY;
  }

  if (guiSightPosition.y < 1 && movementY > 0) {
    guiSightPosition.y += movementY;
  } else if (guiSightPosition.y >= 1 && movementY < 0) {
    guiSightPosition.y += movementY;
  }

  if (guiSightPosition.y > 1) {
    guiSightPosition.y = 1;
  } else if (guiSightPosition.y < -1) {
    guiSightPosition.y = -1;
  }
};

exports.handleGuiSight = handleGuiSight;
