const fs = require("fs");
const { PNG } = require("pngjs");
const { EngineInfo } = require("./engine.info");

class EngineToolbox {
  static createEngineInfo() {
    return new EngineInfo();
  }

  static getCanvasID() {
    const engineInfo = new EngineInfo();
    return engineInfo.get("canvasID");
  }

  static getCanvas() {
    const canvasID = EngineToolbox.getCanvasID();
    return document.getElementById(canvasID);
  }

  /**
   * @returns {WebGL2RenderingContext}
   */
  static getGLContext() {
    const canvas = EngineToolbox.getCanvas();
    if (canvas) {
      return canvas.getContext("webgl2");
    }
  }

  static readTextFile(path) {
    try {
      const file = fs.readFileSync(path, { encoding: "utf8" });
      return file;
    } catch (err) {
      return undefined;
    }
  }

  static readImage(path) {
    try {
      const imageBuffer = fs.readFileSync(path);
      const png = PNG.sync.read(imageBuffer);
      return png;
    } catch (err) {
      return undefined;
    }
  }

  static isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  /**
   * @param {Array} array1
   * @param {Array} array2
   */
  static compareArrays(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }
}

exports.EngineToolbox = EngineToolbox;
