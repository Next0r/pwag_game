const { EngineToolbox } = require("./engine.toolbox");

class Mouse {
  constructor() {
    this._lastMovementsX = [0, 0, 0];
    this._lastMovementsY = [0, 0, 0];
    this.movementX = 0;
    this.movementY = 0;
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
  static _mouseFreezeTimeout = undefined;

  static addKeyboardEventListeners() {
    window.addEventListener("keydown", (keyboard) => {
      Input._setKeyDown(keyboard.code);
    });
    window.addEventListener("keyup", (keyboard) => {
      Input._setKeyUp(keyboard.code);
      Input._executeOnReleaseFunction(keyboard.code);
    });
  }

  static lockPointer() {
    const canvas = EngineToolbox.getCanvas();
    if (!canvas || document.pointerLockElement === canvas) {
      return;
    }
    document.addEventListener(
      "pointerlockchange",
      Input._lockChangeAlert,
      false
    );
    canvas.requestPointerLock();
  }

  static _executeOnReleaseFunction(code) {
    if (typeof Input.keyboard.onRelease[code] === "function") {
      Input.keyboard.onRelease[code]();
    }
  }

  static _setKeyDown(code) {
    Input.keyboard._keyInfo[code] = true;
  }

  static _setKeyUp(code) {
    Input.keyboard._keyInfo[code] = false;
  }

  static _lockChangeAlert() {
    const canvas = EngineToolbox.getCanvas();
    if (document.pointerLockElement === canvas) {
      document.addEventListener("mousemove", Input._updatePosition, false);
    } else {
      document.removeEventListener("mousemove", Input._updatePosition, false);
    }
  }

  static _updatePosition(mouse) {
    if (Input._mouseFreezeTimeout) {
      clearTimeout(Input._mouseFreezeTimeout);
    }

    const avgMovementX =
      (mouse.movementX +
        Input.mouse._lastMovementsX.reduce((prev, curr) => {
          return prev + curr;
        })) /
      (Input.mouse._lastMovementsX.length + 1);

    const avgMovementY =
      (mouse.movementY +
        Input.mouse._lastMovementsY.reduce((prev, curr) => {
          return prev + curr;
        })) /
      (Input.mouse._lastMovementsY.length + 1);

    Input.mouse.movementX = avgMovementX;
    Input.mouse.movementY = -avgMovementY;

    Input.mouse._lastMovementsX.push(mouse.movementX);
    Input.mouse._lastMovementsY.push(mouse.movementY);
    Input.mouse._lastMovementsX.shift();
    Input.mouse._lastMovementsY.shift();

    Input._mouseFreezeTimeout = setTimeout(() => {
      Input.mouse.movementX = 0;
      Input.mouse.movementY = 0;
      Input.mouse._lastMovementsX = [0, 0, 0];
      Input.mouse._lastMovementsY = [0, 0, 0];
    }, 20);
  }
}

exports.Input = Input;
