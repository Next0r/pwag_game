const { EngineToolbox } = require("./engine.toolbox");

class Mouse {}

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

const updatePosition = (mouse) => {
  console.log(mouse.movementX, mouse.movementY);
};

exports.Input = Input;
