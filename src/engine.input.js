const { EngineToolbox } = require("./engine.toolbox");

/**
 * Mouse properties (also movement) container
 */
class Mouse {
  /**
   * Crates new mouse instance
   */
  constructor() {
    /**
     * Array of previous mouse movement in x axis - used for smoothing
     * @type {number[]}
     */
    this._lastMovementsX = [0, 0, 0];
    /**
     * Array of previous mouse movement in y axis - used for smoothing
     * @type {number[]}
     */
    this._lastMovementsY = [0, 0, 0];
    /**
     * Last mouse movement in x axis
     * @type {number}
     */
    this.movementX = 0;
    /**
     * Last mouse movement in y axis
     * @type {number}
     */
    this.movementY = 0;
  }
}

/**
 * Keyboard properties container, allows to check
 * if key was pressed or set event that should occur on
 * key release
 */
class Keyboard {
  /**
   * Creates new keyboard properties container
   */
  constructor() {
    /**
     * Contains set of boolean properties representing
     * currently held down keys
     * @type {Object}
     */
    this._keyInfo = {};
    /**
     * Contains set of functions that are called when 
     * key is released, to add such event add property to
     * this object e.g. Input.keyboard.onRelease["keyA"] = foo();
     */
    this.onRelease = {};
  }

  /**
   * Use this method to check if key represented by string code is currently held down
   * @param {string} code string code of keyboard, you can check key codes in MDN docs
   * @returns {boolean} true if key is currently held down
   */
  isDown(code) {
    return this._keyInfo[code] === true;
  }
}

/**
 * Engine input manager, allows access to mouse and keyboards
 */
class Input {
  /**
   * Use this property to access mouse movement
   */
  static mouse = new Mouse();
  /**
   * Use this property to set on key release events and check if
   * key is held down
   */
  static keyboard = new Keyboard();
  /**
   * Handler to mouse freeze timeout, part of system that allows
   * to avoid ghost mouse movement
   */
  static _mouseFreezeTimeout = undefined;

  /**
   * This method is called on engine init (you rather do not have to call it
   * on your own), adds keyboard event listeners to window, so keyboard
   * property may contain useful data
   */
  static _addKeyboardEventListeners() {
    window.addEventListener("keydown", (keyboard) => {
      Input._setKeyDown(keyboard.code);
    });
    window.addEventListener("keyup", (keyboard) => {
      Input._setKeyUp(keyboard.code);
      Input._executeOnReleaseFunction(keyboard.code);
    });
  }

  /**
   * Locks mouse pointer to canvas element, use ALT or
   * default escape key to unlock pointer, call this method
   * if you want to access mouse movement data and hide mouse cursor
   */
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

  /**
   * Method passed to listener that allows to fire custom event on
   * keyboard key release
   * @param {string} code keyboard key code, check key codes in MDN docs
   */
  static _executeOnReleaseFunction(code) {
    if (typeof Input.keyboard.onRelease[code] === "function") {
      Input.keyboard.onRelease[code]();
    }
  }

  /**
   * Method passed to listener that allows to set useful data in keyboard property
   * @param {string} code keyboard key code, check key codes in MDN docs
   */
  static _setKeyDown(code) {
    Input.keyboard._keyInfo[code] = true;
  }

  /**
   * Method passed to listener that allows to set useful data in keyboard property
   * @param {string} code keyboard key code, check key codes in MDN docs
   */
  static _setKeyUp(code) {
    Input.keyboard._keyInfo[code] = false;
  }

  /**
   * Method passed to listener of pointer lock API, it adds mouse event
   * listener so movement might be recorded
   */
  static _lockChangeAlert() {
    const canvas = EngineToolbox.getCanvas();
    if (document.pointerLockElement === canvas) {
      document.addEventListener("mousemove", Input._updatePosition, false);
    } else {
      document.removeEventListener("mousemove", Input._updatePosition, false);
    }
  }

  /**
   * Updates mouse position so mouse property contains useful data,
   * handles mouse movement smoothing and freeze to avoid ghost movement
   * @param {Object} mouse mouse object passed by mousemove event listener
   */
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
