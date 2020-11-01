const { EngineToolbox } = require("./engine.toolbox");

const mouse = {
  _lastMovementsX: [0, 0, 0],
  _lastMovementsY: [0, 0, 0],
  movementX: 0,
  movementY: 0,
};

const keyboard = {
  _keyInfo: {},
  onRelease: {},

  isDown(code) {
    return this._keyInfo[code] === true;
  },
};

const Input = {
  mouse: mouse,
  keyboard: keyboard,

  addKeyboardEventListeners() {
    window.addEventListener("keydown", (keyboard) => {
      setKeyDown(keyboard.code);
    });
    window.addEventListener("keyup", (keyboard) => {
      setKeyUp(keyboard.code);
      executeOnReleaseFunction(keyboard.code);
    });
  },

  lockPointer() {
    const canvas = EngineToolbox.getCanvas();
    if (!canvas || document.pointerLockElement === canvas) {
      return;
    }
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    canvas.requestPointerLock();
  },
};

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

  mouseFreezeTimeout = setTimeout(() => {
    Input.mouse.movementX = 0;
    Input.mouse.movementY = 0;
    Input.mouse._lastMovementsX = [0, 0, 0];
    Input.mouse._lastMovementsY = [0, 0, 0];
  }, 20);
};

exports.Input = Input;
