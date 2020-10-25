const { Vector3 } = require("./engine.math.vector3");
const { Game } = require("./engine.game");
const { Time } = require("./engine.time");
const { EngineToolbox } = require("./engine.toolbox");
const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const { Vector4 } = require("./engine.math.vector4");
const { engineResources } = require("./engine.resources");
const { createShaderProgram } = require("./engine.shader");
const { gameInit } = require("./game.init");
const { GameObject } = require("./engine.gameObject");
const { Matrix4 } = require("./engine.math.matrix4");
const { rmdir } = require("fs");
const { handleGuiSight } = require("./game.handleGuiSight");
const { Mesh } = require("./engine.utilities.mesh");
const { CreateBoxCollider } = require("./engine.boxCollider");
const { CreateCollisionSystem } = require("./engine.collisionSystem");
const { handleStartMenu } = require("./game.handleStartMenu");

const main = () => {
  EngineToolbox.createCanvas();
  const gl = EngineToolbox.getGLContext();

  if (!gl) {
    console.warn("Cannot acquire WebGL2 rendering context.");
    return;
  }

  const settings = EngineToolbox.getSettings();
  const resources = engineResources;
  resources.build();
  const collisionSystem = CreateCollisionSystem();
  const camera = resources.gameObjects.camera;
  camera.projection.aspect = settings.width / settings.height;

  // draw
  Renderer.setClearColor(new Vector4(0, 0, 0, 1));
  Renderer.enableDepthTest();
  Renderer.enableAlphaBlend();

  handleStartMenu();
  
};

window.onload = main;
