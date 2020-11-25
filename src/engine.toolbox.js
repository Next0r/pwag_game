const fs = require("fs");
const { PNG } = require("pngjs");
const path = require("path");
const gameConfig = require(path.join(__dirname, "..", "gameConfig.json"));

/**
 * Container for multiple helper methods like canvas and WebGL2
 * context getters.
 */
class EngineToolbox {
  /**
   * Context acquired form created canvas
   * @type {WebGL2RenderingContext}
   */
  static _glContext = undefined;

  /**
   * Allows to acquire canvas element by id defined in game config file
   * @returns {HTMLCanvasElement} HTML canvas element where game might be rendered
   */
  static getCanvas() {
    const canvasID = gameConfig.canvasID;
    return document.getElementById(canvasID);
  }

  /**
   * Allows to acquire WebGL2 rendering context
   * @returns {WebGL2RenderingContext} WebGL2 rendering context
   */
  static getGLContext() {
    if (this._glContext) {
      return this._glContext;
    }

    const canvas = EngineToolbox.getCanvas();
    if (canvas) {
      EngineToolbox._glContext = canvas.getContext("webgl2");
      return EngineToolbox._glContext;
    }
  }

  /**
   * Creates new HTML canvas element in main window
   * @returns {EngineToolbox} self reference for easier method chaining
   */
  static createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = gameConfig.canvasID;
    canvas.width = gameConfig.canvasWidth;
    canvas.height = gameConfig.canvasHeight;
    canvas.setAttribute("width", gameConfig.canvasWidth);
    canvas.setAttribute("height", gameConfig.canvasHeight);
    document.body.appendChild(canvas);
    return this;
  }

  /**
   * Allows to acquire content of text file given by path string
   * @param {string} path path of text file
   * @returns {string|undefined} content of text file or undefined if error occurs
   */
  static readTextFile(path) {
    try {
      const file = fs.readFileSync(path, { encoding: "utf8" });
      return file;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Allows to acquire content of PNG image file given by path string
   * @param {string} path path of PNG image file
   * @returns {import("pngjs").PNGWithMetadata} png with metadata read by PNG.js
   */
  static readImage(path) {
    try {
      const imageBuffer = fs.readFileSync(path);
      const png = PNG.sync.read(imageBuffer);
      return png;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Checks if given value is power of 2
   * @param {number} value value that should be checked
   * @returns {boolean} true if value is power of 2
   */
  static isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  /**
   * Allows to compare two arrays, arrays are considered
   * non equal if their sizes differ
   * @param {Array} array1 array on the left of sign of equality
   * @param {Array} array2 array on the right of sign of equality
   * @returns {boolean} true if arrays are similar
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
