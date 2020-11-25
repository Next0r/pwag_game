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
    const entry = array.find((element) => {
      element.name === name;
    });
    if (entry) {
      return entry.element;
    }
  }

  /**
   *
   * @param {string} name
   * @returns {Texture}
   */
  getTexture(name) {
    return this._findResource(this._textures, name);
  }

  /**
   *
   * @param {string} name
   * @returns {Mesh}
   */
  getMesh(name) {
    return this._findResource(this._meshes, name);
  }

  /**
   *
   * @param {string} name
   * @returns {string}
   */
  getShader(name) {
    return this._findResource(this._shaders, name);
  }

  /**
   *
   * @param {string} name
   * @returns {Material}
   */
  getMaterial(name) {
    return this._findResource(this._materials, name);
  }

  /**
   *
   * @param {string} name
   * @returns {GameObject}
   */
  getGameObject(name) {
    return this._findResource(this._gameObjects, name);
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

module.exports.newEngineResources = {
  Resources() {
    return new EngineResources();
  },
};

const engineResources = {
  textures: {},
  meshes: {
    guiPlane: Mesh.createGUIPlane(),
    textGUIPlane: Mesh.createGUIPlane().scaleMap(gameConfig.textGridSize),
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
    const textureNames = fs.readdirSync(
      path.join(__dirname, "..", gameConfig.texturesDir)
    );
    if (!textureNames) {
      console.warn("Cannot read texture resources.");
    } else {
      for (let textureName of textureNames) {
        const image = EngineToolbox.readImage(
          path.join(__dirname, "..", gameConfig.texturesDir, textureName)
        );
        const texture = new Texture().fromPNGImage(image);
        const id = textureName.split(".");
        id.pop();
        this.textures[id] = texture;
      }
    }

    // read meshes
    const meshNames = fs.readdirSync(
      path.join(__dirname, "..", gameConfig.meshesDir)
    );
    if (!meshNames) {
      console.warn("Cannot read mesh resources.");
    } else {
      for (let meshName of meshNames) {
        const mesh = readColladaFile(
          path.join(__dirname, "..", gameConfig.meshesDir, meshName)
        )[0];
        mesh.createElementArray();
        const id = meshName.split(".");
        id.pop();
        this.meshes[id] = mesh;
      }
    }

    // read shader sources
    const shaderNames = fs.readdirSync(
      path.join(__dirname, "..", gameConfig.shadersDir)
    );
    if (!shaderNames) {
      console.warn("Cannot read shader resources.");
    } else {
      for (let shaderName of shaderNames) {
        const shaderSource = EngineToolbox.readTextFile(
          path.join(__dirname, "..", gameConfig.shadersDir, shaderName)
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
