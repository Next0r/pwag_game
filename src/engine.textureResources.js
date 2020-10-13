const { Texture } = require("./engine.material.textures");

class TextureResources {
  constructor() {
    if (TextureResources.instance) {
      return TextureResources.instance;
    }

    this._textures = {};
    TextureResources.instance = this;
  }

  /**
   *
   * @param {String} id
   * @param {Texture} texture
   */
  add(id, texture) {
    this._textures[id] = texture;
    return this;
  }

  get(id) {
    return this._textures[id];
  }

  delete(id) {
    this._textures[id] = undefined;
    return this;
  }

  static instance = undefined;
}

exports.TextureResources = TextureResources;
