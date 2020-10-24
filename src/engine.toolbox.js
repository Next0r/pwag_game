const fs = require("fs");
const { PNG } = require("pngjs");

const EngineToolbox = {
  _glContext: undefined,

  getCanvas() {
    const canvasID = EngineToolbox.readSettings().canvasID;
    return document.getElementById(canvasID);
  },

  /**
   * @returns {WebGL2RenderingContext}
   */
  getGLContext() {
    if (EngineToolbox._glContext) {
      return EngineToolbox._glContext;
    }

    const canvas = EngineToolbox.getCanvas();
    if (canvas) {
      EngineToolbox._glContext = canvas.getContext("webgl2");
      return EngineToolbox._glContext;
    }
  },

  createCanvas() {
    const settings = this.readSettings();
    const width = settings.width;
    const height = settings.height;
    const id = settings.canvasID;
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());
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

  readSettings() {
    const settingsText = this.readTextFile("./settings.json");
    if (!settingsText) {
      console.warn("Cannot read settings.json file.");
      return;
    }
    const settings = JSON.parse(settingsText);
    return settings;
  },
};

exports.EngineToolbox = EngineToolbox;
