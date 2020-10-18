const { Texture } = require("./engine.material.textures");
const { EngineToolbox } = require("./engine.toolbox");
const { EngineInfo } = require("./engine.info");

const loadTextures = () => {
  const engineInfo = new EngineInfo();
  const textureResources = engineInfo.get("textureResources");

  const testTextureImage = EngineToolbox.readImage("./textures/test_color.png");
  const testTexture = new Texture();
  testTexture.fromPNGImage(testTextureImage);
  textureResources.add("testTexture", testTexture);

  const skyboxColorImage = EngineToolbox.readImage("./textures/skybox_color_01.png");
  const skyboxColor = new Texture();
  skyboxColor.fromPNGImage(skyboxColorImage);
  textureResources.add("skybox_color", skyboxColor);

  const guiSightImage = EngineToolbox.readImage("./textures/gui_sight.png");
  const guiSightTexture = new Texture();
  guiSightTexture.fromPNGImage(guiSightImage);
  textureResources.add("gui_sight", guiSightTexture);
};

exports.loadTextures = loadTextures;
