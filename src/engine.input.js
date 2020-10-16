const { EngineToolbox } = require("./engine.toolbox");

class Mouse {
  constructor() {
    this.movementX = 0;
    this.movementY = 0;
    this.locked = false;
  }
}

class Keyboard {
  constructor() {
    this._keyInfo = {};
    this.onRelease = {};
  }

  isDown(code) {
    return this._keyInfo[code] === true;
  }
}

class Input {
  static mouse = new Mouse();
  static keyboard = new Keyboard();

  static addKeyboardEventListeners() {
    window.addEventListener("keydown", (keyboard) => {
      setKeyDown(keyboard.code);
    });
    window.addEventListener("keyup", (keyboard) => {
      setKeyUp(keyboard.code);
      executeOnReleaseFunction(keyboard.code);
    });
  }

  static lockPointer() {
    const canvas = EngineToolbox.getCanvas();
    if (!canvas) {
      return;
    }
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    canvas.requestPointerLock();
    Input.mouse.locked = true;
  }
}

const executeOnReleaseFunction = (code) => {
  if (typeof Input.keyboard.onRelease[code] === "function") {
    Input.keyboard.onRelease[code]();
  }
};

const setKeyDown = (code) => {
  Input.keyboard._keyInfo[code] = true;
};

const setKeyUp = (code) => {
  Input.keyboard._keyInfo[code] = false;
};

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
