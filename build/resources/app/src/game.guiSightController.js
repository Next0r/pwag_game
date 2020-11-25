const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const engineResources = require("./engine.resources").Resources();

const guiSightController = {
  posX: 0,
  posY: 0,
  sensitivity: 0.002,
  size: 0.1,

  reset() {
    this.posX = 0;
    this.posY = 0;
  },

  draw() {
    Renderer.drawGUIElement(engineResources.getTexture("gui_sight"), {
      posX: this.posX,
      posY: this.posY,
      scaleX: this.size,
      scaleY: this.size,
    });
    return this;
  },

  followMouse() {
    const movementX = Input.mouse.movementX * this.sensitivity;
    const movementY =
      Input.mouse.movementY *
      this.sensitivity *
      engineResources.getCamera().projection.aspect;

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

exports.guiSightController = guiSightController;
