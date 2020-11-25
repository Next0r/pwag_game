const { EngineToolbox } = require("./engine.toolbox");

/**
 * Represents texture read form textures directory and it's parameters
 */
class Texture {
  /**
   * Creates new texture instance
   */
  constructor() {
    /**
     * Texture width in pixels
     * @type {number}
     */
    this.width = 1;
    /**
     * Texture height in pixels
     * @type {number}
     */
    this.height = 1;
    /**
     * Buffer of texture data, each pixel is represented with 4 bytes
     * @type {Uint8Array}
     */
    this.buffer = new Uint8Array([255, 0, 255, 255]);
    /**
     * Textures that size is power of 2 can be mip mapped
     * @type {boolean}
     */
    this.isPowerOf2 = false;
    /**
     * Texture object used by WebGL2
     * @type {WebGLTexture}
     */
    this.textureObject = undefined;
  }

  /**
   * Fills texture instance with data acquired form png image
   * @param {import("pngjs").PNGWithMetadata} pngImage png with metadata read by PNG.js
   * @returns {Texture} self reference for easier method chaining
   */
  fromPNGImage(pngImage) {
    const gl = EngineToolbox.getGLContext();
    if (!pngImage) {
      return;
    }
    this.width = pngImage.width;
    this.height = pngImage.height;
    this.buffer = pngImage.data;
    this.isPowerOf2 =
      EngineToolbox.isPowerOf2(this.width) &&
      EngineToolbox.isPowerOf2(this.height);
    this.textureObject = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.textureObject);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.width,
      this.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.buffer
    );
    if (this.isPowerOf2) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    return this;
  }
}

exports.Texture = Texture;

/**
 * Simple container representing textures available in each material instance
 */
class MaterialTextures {
  /**
   * Creates new instance of texture container
   */
  constructor() {
    /**
     * Base color texture
     */
    this.color0 = new Texture();
    /**
     * Texture that will overlay base texture (based on alpha channel)
     */
    this.color1 = new Texture();
    /**
     * Normal map texture, not used yet
     */
    this.normal0 = new Texture();
  }
}

exports.MaterialTextures = MaterialTextures;
