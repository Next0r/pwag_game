const { EngineToolbox } = require("./engine.toolbox");
const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const { Vector4 } = require("./engine.math.vector4");
const { engineResources } = require("./engine.resources");
const path = require("path");
const settings = require(path.join(__dirname, "..", "settings.json"));
const start = require(path.join(__dirname, "..", settings.startUpFilePath));

const main = () => {
  EngineToolbox.createCanvas();
  const gl = EngineToolbox.getGLContext();

  window.addEventListener("click", () => {
    EngineToolbox.getCanvas().webkitRequestFullScreen(
      Element.ALLOW_KEYBOARD_INPUT
    );
  });

  if (!gl) {
    console.warn("Cannot acquire WebGL2 rendering context.");
    return;
  }

  if (!settings) {
    console.warn("Settings file is missing");
    return;
  }

  const resources = engineResources;
  resources.build();
  const camera = resources.gameObjects.camera;
  camera.projection.aspect = settings.width / settings.height;

  Input._addKeyboardEventListeners();
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();
  Renderer.enableAlphaBlend();

  if (typeof start === "function") {
    start();
  }
};

window.onload = main;
