const fs = require("fs");
const { PNG } = require("pngjs");
const path = require("path");
const gameConfig = require(path.join(__dirname, "..", "gameConfig.json"));

const EngineToolbox = {
  _glContext: undefined,

  getCanvas() {
    const canvasID = gameConfig.canvasID;
    return document.getElementById(canvasID);
  },

  /**
   * @returns {WebGL2RenderingContext}
   */
  getGLContext() {
    if (this._glContext) {
      return this._glContext;
    }

    const canvas = EngineToolbox.getCanvas();
    if (canvas) {
      EngineToolbox._glContext = canvas.getContext("webgl2");
      return EngineToolbox._glContext;
    }
  },

  createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = gameConfig.canvasID;
    canvas.width = gameConfig.canvasWidth;
    canvas.height = gameConfig.canvasHeight;
    canvas.setAttribute("width", gameConfig.canvasWidth);
    canvas.setAttribute("height", gameConfig.canvasHeight);
    document.body.appendChild(canvas);
    return this;
  },

  readTextFile(path) {
    try {
      const file = fs.readFileSync(path, { encoding: "utf8" });
      return file;
    } catch (err) {
      return undefined;
    }
  },

  readImage(path) {
    try {
      const imageBuffer = fs.readFileSync(path);
      const png = PNG.sync.read(imageBuffer);
      return png;
    } catch (err) {
      return undefined;
    }
  },

  isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  },

  /**
   * @param {Array} array1
   * @param {Array} array2
   */
  compareArrays(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  },
};

exports.EngineToolbox = EngineToolbox;
