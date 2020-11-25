const { EngineToolbox } = require("./engine.toolbox");
const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const { Vector4 } = require("./engine.math.vector4");
const engineResources = require("./engine.resources").Resources();
const path = require("path");
const gameConfig = require(path.join(__dirname, "..", "gameConfig.json"));
const start = require(path.join(__dirname, "..", gameConfig.startUpFilePath));

class EngineProgram {
  static _addRequestFullScreenListener() {
    window.addEventListener("click", () => {
      EngineToolbox.getCanvas().webkitRequestFullScreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    });
  }

  static main() {
    // check is game configuration file defined
    if (!gameConfig) {
      console.warn("Game configuration file is missing");
      return;
    }

    // create canvas
    EngineToolbox.createCanvas();

    // check if can acquire WebGL2 context
    if (!EngineToolbox.getGLContext()) {
      console.warn("Cannot acquire WebGL2 rendering context.");
      return;
    }

    // handle request full screen listener
    if (gameConfig.fullScreenOnClick) {
      EngineProgram._addRequestFullScreenListener();
    }

    // const test = newEngineResources;
    // const res = test.Resources();
    // try {
    //   res
    //     ._readTextures()
    //     ._readMeshes()
    //     ._readShaders()
    //     ._readMaterials()
    //     ._readGameObjects();
    //   console.log(res);
    // } catch (e) {
    //   console.log(e);
    // }

    // const res2 = test.Resources();

    // console.log(res === res2);

    try {
      engineResources
        ._readTextures()
        ._readMeshes()
        ._readShaders()
        ._readMaterials()
        ._readGameObjects();
    } catch (e) {
      console.warn(e);
      return;
    }

    const camera = engineResources.getCamera();
    camera.projection.aspect = gameConfig.canvasWidth / gameConfig.canvasHeight;

    Input._addKeyboardEventListeners();
    Renderer.setClearColor(new Vector4(0, 0, 0, 1));
    Renderer.enableDepthTest();
    Renderer.enableAlphaBlend();

    if (typeof start === "function") {
      start();
    }
  }
}

window.onload = EngineProgram.main();
