const { PNG } = require("pngjs");
const { isPowerOf2 } = require("./engine.utilities");
const { getGLContext } = require("./engine.utilities");
const gl = getGLContext();

class Texture {
  constructor() {
    this.width = 1;
    this.height = 1;
    this.buffer = new Uint8Array([255, 0, 255, 255]);
    this.isPowerOf2 = false;
    this.textureObject = undefined;
  }

  /**
   *
   * @param {import("pngjs").PNGWithMetadata} pngImage
   */
  fromPNGImage(pngImage) {
    if (!gl || !pngImage) {
      return;
    }
    this.width = pngImage.width;
    this.height = pngImage.height;
    this.buffer = pngImage.data;
    this.isPowerOf2 = isPowerOf2(this.width) && isPowerOf2(this.height);
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
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    return this;
  }
}

exports.Texture = Texture;

class MaterialTextures {
  constructor() {
    this.color0 = new Texture();
    this.color1 = new Texture();
  }
}

exports.MaterialTextures = MaterialTextures;