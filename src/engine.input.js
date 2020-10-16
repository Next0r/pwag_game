const { EngineToolbox } = require("./engine.toolbox");

class Mouse {
  constructor() {
    this.movementX = 0;
    this.movementY = 0;
  }
}

class Input {
  static mouse = new Mouse();

  static lockPointer() {
    const canvas = EngineToolbox.getCanvas();
    if (!canvas) {
      return;
    }
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    canvas.requestPointerLock();
  }
}

const lockChangeAlert = () => {
  const canvas = EngineToolbox.getCanvas();
  if (document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    document.removeEventListener("mousemove", updatePosition, false);
  }
};

let mouseFreezeTimeout = undefined;

const updatePosition = (mouse) => {
  if (mouseFreezeTimeout) {
    clearTimeout(mouseFreezeTimeout);
  }
  Input.mouse.movementX = mouse.movementX;
  Input.mouse.movementY = -mouse.movementY;
  mouseFreezeTimeout = setTimeout(() => {
    Input.mouse.movementX = 0;
    Input.mouse.movementY = 0;
  }, 20);
};

exports.Input = Input;
