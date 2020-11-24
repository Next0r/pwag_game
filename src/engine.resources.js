const { Camera } = require("./engine.camera");
const { AmbientLight } = require("./engine.light.ambient");
const { DirectLight } = require("./engine.light.direct");
const { Mesh } = require("./engine.utilities.mesh");
const fs = require("fs");
const { EngineToolbox } = require("./engine.toolbox");
const { Texture } = require("./engine.material.textures");
const { readColladaFile } = require("./engine.utilities.collada");
const { Material } = require("./engine.material");
const { GameObject } = require("./engine.gameObject");
const path = require("path");
const gameConfig = require(path.join(__dirname, "..", "gameConfig.json"));

const engineResources = {
  textures: {},
  meshes: {
    guiPlane: Mesh.createGUIPlane(),
    textGUIPlane: Mesh.createGUIPlane().scaleMap(
      gameConfig.textGridSize
    ),
  },
  shaders: {},
  materials: {},
  gameObjects: {
    camera: new Camera(),
    directLight: new DirectLight(),
    ambientLight: new AmbientLight(),
  },
  build() {
    // read textures
    const textureNames = fs.readdirSync(gameConfig.texturesDir);
    if (!textureNames) {
      console.warn("Cannot read texture resources.");
    } else {
      for (let textureName of textureNames) {
        const image = EngineToolbox.readImage(
          `${gameConfig.texturesDir}/${textureName}`
        );
        const texture = new Texture().fromPNGImage(image);
        const id = textureName.split(".");
        id.pop();
        this.textures[id] = texture;
      }
    }

    // read meshes
    const meshNames = fs.readdirSync(gameConfig.meshesDir);
    if (!meshNames) {
      console.warn("Cannot read mesh resources.");
    } else {
      for (let meshName of meshNames) {
        const mesh = readColladaFile(`${gameConfig.meshesDir}/${meshName}`)[0];
        mesh.createElementArray();
        const id = meshName.split(".");
        id.pop();
        this.meshes[id] = mesh;
      }
    }

    // read shader sources
    const shaderNames = fs.readdirSync(gameConfig.shadersDir);
    if (!shaderNames) {
      console.warn("Cannot read shader resources.");
    } else {
      for (let shaderName of shaderNames) {
        const shaderSource = EngineToolbox.readTextFile(
          `${gameConfig.shadersDir}/${shaderName}`
        );
        const id = shaderName.split(".");
        id.pop();
        this.shaders[id] = shaderSource;
      }
    }

    // create materials
    const materialNames = gameConfig.materials;
    if (materialNames && materialNames instanceof Array) {
      for (let name of materialNames) {
        this.materials[name] = new Material();
      }
    } else {
      console.warn("Invalid materials array. Cannot create materials.");
    }

    // create gameObjects
    const gameObjectNames = gameConfig.gameObjects;
    if (gameObjectNames && gameObjectNames instanceof Array) {
      for (let name of gameObjectNames) {
        this.gameObjects[name] = new GameObject();
      }
    } else {
      console.warn("Invalid game object array. Cannot create game objects.");
    }
  },
};

exports.engineResources = engineResources;
