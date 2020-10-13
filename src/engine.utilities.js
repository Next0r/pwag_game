const fs = require("fs");
const { PNG } = require("pngjs");

let GL = undefined;
const defaultCanvasID = "game_window";

const loadGLContext = (canvasID) => {
  const canvas = document.getElementById(canvasID);
  if (canvas) {
    GL = canvas.getContext("webgl2");
  }
};

exports.loadGLContext = loadGLContext;

/**
 * @returns {WebGL2RenderingContext}
 */
const getGLContext = () => {
  if (!GL) {
    loadGLContext(defaultCanvasID);
  }
  return GL;
};

exports.getGLContext = getGLContext;

const readTextFile = (path) => {
  try {
    const file = fs.readFileSync(path, { encoding: "utf8" });
    return file;
  } catch (err) {
    return undefined;
  }
};

exports.readTextFile = readTextFile;

const readImage = (path) => {
  try {
    const imageBuffer = fs.readFileSync(path);
    const png = PNG.sync.read(imageBuffer);
    return png;
  } catch (err) {
    return undefined;
  }
};

exports.readImage = readImage;

const isPowerOf2 = (value) => {
  return (value & (value - 1)) === 0;
};

exports.isPowerOf2 = isPowerOf2;


