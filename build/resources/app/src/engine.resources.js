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

/**
 * Represents single entry in engine resources, each entry has
 * name and element like texture, material, game object, etc.
 */
class ResourceEntry {
  /**
   * Creates resource entry instance
   * @param {string} name name of resource (similar to one defined in game config file)
   * @param {Texture|Mesh|String|Material|GameObject} element resource element, might be texture, material, shader source, game object or mesh
   */
  constructor(name, element) {
    /**
     * name of resource (similar to one defined in game config file)
     * @type {string}
     */
    this.name = name;
    /**
     * resource element, might be texture, material, shader source, game object or mesh
     * @type {Texture|Mesh|String|Material|GameObject}
     */
    this.element = element;
  }
}

/**
 * Storage of all elements used in game like textures, materials, game objects
 * camera, lights etc. use get methods to acquire resources by name
 */
class EngineResources {
  /**
   * Creates new engine resources or returns existing one, also creates
   * camera, ambient and direct lights, gui meshes and stores them as
   * resources
   */
  constructor() {
    if (EngineResources._instance) {
      return EngineResources._instance;
    }

    /**
     * Textures represented by name of file stored in texture directory
     * @type {ResourceEntry[]}
     */
    this._textures = [];
    /**
     * Meshes represented by name of file stored in mesh directory
     * @type {ResourceEntry[]}
     */
    this._meshes = [];
    /**
     * Shader sources represented by name of file stored in shader directory
     * @type {ResourceEntry[]}
     */
    this._shaders = [];
    /**
     * Materials represented by names defined in game config file
     * @type {ResourceEntry[]}
     */
    this._materials = [];
    /**
     * Game objects represented by names defined in game config file
     * @type {ResourceEntry[]}
     */
    this._gameObjects = [];

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
   * Instance of already defined resources
   * @type {EngineResources}
   */
  static _instance;

  /**
   * Allows to acquire camera game object
   * @returns {Camera}
   */
  getCamera() {
    return this._gameObjects[0].element;
  }

  /**
   * Allows to acquire direct light game object
   * @returns {DirectLight}
   */
  getDirectLight() {
    return this._gameObjects[1].element;
  }

  /**
   * Allows to acquire ambient light game object
   * @returns {AmbientLight}
   */
  getAmbientLight() {
    return this._gameObjects[2].element;
  }

  /**
   * Finds resource in specified category (textures, materials etc.)
   * @param {ResourceEntry[]} array array that should be searched
   * @param {string} name name of element that should be found
   * @throws {Error} that indicates that resource has not been found
   * @returns {Texture|Mesh|String|Material|GameObject}
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
   * Finds texture resource by given name corresponding to texture file name in texture directory
   * @param {string} name name of the file without ".png"
   * @returns {Texture}
   * @throws {Error} if texture is not found by give name
   */
  getTexture(name) {
    try {
      return this._findResource(this._textures, name);
    } catch (e) {
      throw new Error(`Texture ${name} not found`);
    }
  }

  /**
   * Finds mesh resource by given name corresponding to mesh file name in mesh directory
   * @param {string} name name of the file without ".dae"
   * @returns {Mesh}
   * @throws {Error} if mesh is not found by give name
   */
  getMesh(name) {
    try {
      return this._findResource(this._meshes, name);
    } catch (e) {
      throw new Error(`Mesh ${name} not found`);
    }
  }

  /**
   * Finds shader resource by given name corresponding to shader file name in shader directory
   * @param {string} name name of the file without ".txt"
   * @returns {string}
   * @throws {Error} if shader is not found by give name
   */
  getShader(name) {
    try {
      return this._findResource(this._shaders, name);
    } catch (e) {
      throw new Error(`Shader ${name} not found`);
    }
  }

  /**
   * Finds material resource by given name corresponding to name defined in game config file
   * @param {string} name material name defined in game config file
   * @returns {Material}
   * @throws {Error} if material is not found by give name
   */
  getMaterial(name) {
    try {
      return this._findResource(this._materials, name);
    } catch (e) {
      throw new Error(`Shader ${name} not found`);
    }
  }

  /**
   * Finds game object resource by given name corresponding to name defined in game config file
   * @param {string} name game object  name defined in game config file
   * @returns {Material}
   * @throws {Error} if game object  is not found by give name
   */
  getGameObject(name) {
    try {
      return this._findResource(this._gameObjects, name);
    } catch (e) {
      throw new Error(`GameObject ${name} not found`);
    }
  }

  /**
   * Reads textures from directory defined in game config file, this method
   * is called on engine init and should be not used directly
   * @throws {Error} if reading fails
   */
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

  /**
   * Reads meshes from directory defined in game config file, this method
   * is called on engine init and should be not used directly
   * @throws {Error} if reading fails
   */
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

  /**
   * Reads shaders from directory defined in game config file, this method
   * is called on engine init and should be not used directly
   * @throws {Error} if reading fails
   */
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

  /**
   * Creates set of materials defined in game config file
   * @throws {Error} if creating materials fails
   */
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

  /**
   * Creates set of game objects defined in game config file
   * @throws {Error} if creating game objects fails
   */
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
