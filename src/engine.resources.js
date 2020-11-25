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
const { Game } = require("./engine.game");
const gameConfig = require(path.join(__dirname, "..", "gameConfig.json"));

class ResourceEntry {
  /**
   *
   * @param {string} name
   * @param {Texture|Mesh|String|Material|GameObject} element
   */
  constructor(name, element) {
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {Texture|Mesh|String|Material|GameObject}
     */
    this.element = element;
  }
}

class EngineResources {
  constructor() {
    if (EngineResources._instance) {
      return EngineResources._instance;
    }

    /**
     * @type {ResourceEntry[]}
     */
    this._textures = [];
    /**
     * @type {ResourceEntry[]}
     */
    this._meshes = [];
    /**
     * @type {ResourceEntry[]}
     */
    this._shaders = [];
    /**
     * @type {ResourceEntry[]}
     */
    this._materials = [];
    /**
     * @type {ResourceEntry[]}
     */
    this._gameObjects = [];
    /**
     * @type {ResourceEntry[]}
     */

    this._meshes.push(new ResourceEntry("guiPlane", Mesh.createGUIPlane()));
    this._meshes.push(
      new ResourceEntry(
        "textGUIPlane",
        Mesh.createGUIPlane().scaleMap(gameConfig.textGridSize)
      )
    );

    this._gameObjects.push(new ResourceEntry("camera", new Camera()));
    this._gameObjects.push(new ResourceEntry("directLight", new DirectLight()));
    this._gameObjects.push(
      new ResourceEntry("ambientLight", new AmbientLight())
    );

    EngineResources._instance = this;
  }

  /**
   * @type {EngineResources}
   */
  static _instance;

  /**
   * @returns {Camera}
   */
  getCamera() {
    return this._gameObjects[0].element;
  }

  /**
   * @returns {DirectLight}
   */
  getDirectLight() {
    return this._gameObjects[1].element;
  }

  /**
   * @returns {AmbientLight}
   */
  getAmbientLight() {
    return this._gameObjects[2].element;
  }

  /**
   *
   * @param {ResourceEntry[]} array
   * @param {string} name
   */
  _findResource(array, name) {
    let resource = undefined;
    for (let entry of array) {
      if (entry.name === name) {
        resource = entry.element;
      }
    }

    if (resource) {
      return resource;
    } else {
      throw new Error();
    }
  }

  /**
   *
   * @param {string} name
   * @returns {Texture}
   */
  getTexture(name) {
    try {
      return this._findResource(this._textures, name);
    } catch (e) {
      throw new Error(`Texture ${name} not found`);
    }
  }

  /**
   *
   * @param {string} name
   * @returns {Mesh}
   */
  getMesh(name) {
    try {
      return this._findResource(this._meshes, name);
    } catch (e) {
      throw new Error(`Mesh ${name} not found`);
    }
  }

  /**
   *
   * @param {string} name
   * @returns {string}
   */
  getShader(name) {
    try {
      return this._findResource(this._shaders, name);
    } catch (e) {
      throw new Error(`Shader ${name} not found`);
    }
  }

  /**
   *
   * @param {string} name
   * @returns {Material}
   */
  getMaterial(name) {
    try {
      return this._findResource(this._materials, name);
    } catch (e) {
      throw new Error(`Shader ${name} not found`);
    }
  }

  /**
   *
   * @param {string} name
   * @returns {GameObject}
   */
  getGameObject(name) {
    try {
      return this._findResource(this._gameObjects, name);
    } catch (e) {
      throw new Error(`GameObject ${name} not found`);
    }
  }

  _readTextures() {
    try {
      const textureNames = fs.readdirSync(
        path.join(__dirname, "..", gameConfig.texturesDir)
      );

      for (let textureName of textureNames) {
        const image = EngineToolbox.readImage(
          path.join(__dirname, "..", gameConfig.texturesDir, textureName)
        );
        const texture = new Texture().fromPNGImage(image);
        const name = textureName.split(".")[0];

        this._textures.push(new ResourceEntry(name, texture));
      }

      return this;
    } catch (e) {
      throw new Error("Error reading textures");
    }
  }

  _readMeshes() {
    try {
      const meshNames = fs.readdirSync(
        path.join(__dirname, "..", gameConfig.meshesDir)
      );

      for (let meshName of meshNames) {
        const mesh = readColladaFile(
          path.join(__dirname, "..", gameConfig.meshesDir, meshName)
        )[0];
        mesh.createElementArray();

        const name = meshName.split(".")[0];

        this._meshes.push(new ResourceEntry(name, mesh));
      }

      return this;
    } catch (e) {
      throw new Error("Error reading meshes");
    }
  }

  _readShaders() {
    try {
      const shaderNames = fs.readdirSync(
        path.join(__dirname, "..", gameConfig.shadersDir)
      );

      for (let shaderName of shaderNames) {
        const shaderSource = EngineToolbox.readTextFile(
          path.join(__dirname, "..", gameConfig.shadersDir, shaderName)
        );

        const name = shaderName.split(".")[0];
        this._shaders.push(new ResourceEntry(name, shaderSource));
      }

      return this;
    } catch (e) {
      throw new Error("Error reading shaders");
    }
  }

  _readMaterials() {
    try {
      for (let name of gameConfig.materials) {
        this._materials.push(new ResourceEntry(name, new Material()));
      }

      return this;
    } catch (e) {
      throw new Error("Error reading materials");
    }
  }

  _readGameObjects() {
    try {
      for (let name of gameConfig.gameObjects) {
        this._gameObjects.push(new ResourceEntry(name, new GameObject()));
      }

      return this;
    } catch (e) {
      throw new Error("Error reading game objects");
    }
  }
}

module.exports = {
  Resources() {
    return new EngineResources();
  },
};
