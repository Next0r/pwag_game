const { EngineToolbox } = require("./engine.toolbox");
const { Vector4 } = require("./engine.math.vector4");
const { Matrix4 } = require("./engine.math.matrix4");
const engineResources = require("./engine.resources").Resources();
const { charTable } = require("./engine.charTable");
const path = require("path");
const gameConfig = require(path.join(__dirname, "..", "gameConfig.json"));
const { GameObject } = require("./engine.gameObject");

/**
 * Container for methods that can be used to draw game
 * object and GUI elements e.g. text
 */
class Renderer {
  /**
   * @typedef {Object} DrawGUIElementOptions
   * @property {number} posX x position on the screen, use float from -1 to 1
   * @property {number} posY y position on the screen, use float from -1 to 1
   * @property {number} scaleX x scale of gui element, 1 is equal to screen scale
   * @property {number} scaleY y scale of gui element, 1 is equal to screen scale
   */

  /**
   * Draws gui element represented bu texture given
   * @param {Texture} texture texture that should be mapped onto this gui element
   * @param {DrawGUIElementOptions} options object containing element scale and position on screen
   */
  static drawGUIElement(
    texture,
    options = { posX: 0, posY: 0, scaleX: 0.1, scaleY: 0.1 }
  ) {
    const gl = EngineToolbox.getGLContext();
    const camera = engineResources.getCamera();
    const { posX, posY, scaleX, scaleY } = options;

    const mat = engineResources.getMaterial("guiElement");
    mat.textures.color0 = texture;

    const modelViewMatrix = new Matrix4();
    modelViewMatrix.m03 = posX;
    (modelViewMatrix.m13 = posY), (modelViewMatrix.m23 = -1);
    modelViewMatrix.m00 = scaleX / camera.projection.aspect;
    modelViewMatrix.m11 = scaleY;
    modelViewMatrix.m22 = 1;

    mat.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
    mat.uniforms.projectionMatrix.value = new Matrix4().toArray();
    mat.uniforms.normalMatrix.value = new Matrix4().toArray();

    mat.linkVertexArrays(engineResources.getMesh("guiPlane"));
    mat.uploadMatrix;
    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();

    gl.drawElements(
      gl.TRIANGLES,
      engineResources.getMesh("guiPlane").elementArray.length,
      gl.UNSIGNED_INT,
      0
    );
  }

  /**
   * Draws single game object on screen
   * @param {GameObject} gameObject game object that should be drawn on screen
   */
  static drawGameObject(gameObject) {
    const gl = EngineToolbox.getGLContext();
    const camera = engineResources.getCamera();
    camera.projection.rebuildMatrixPerspective();

    const mat = gameObject.material;
    const modelViewMatrix = camera.transform.matrix
      .clone()
      .inverse()
      .multiply(gameObject.transform.matrix);

    mat.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
    mat.uniforms.projectionMatrix.value = camera.projection.matrix.toArray();
    const scaleFactorMatrix = new Matrix4().scale(
      gameObject.transform.matrix.getScale()
    );
    mat.uniforms.normalMatrix.value = gameObject.transform.matrix
      .clone()
      .inverse()
      .transpose() // normal matrix without scaling factor applied
      .multiply(scaleFactorMatrix)
      .toArray(); // normal matrix with scaling factor applied

    mat.linkVertexArrays(gameObject.mesh);
    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();

    gl.drawElements(
      gl.TRIANGLES,
      gameObject.mesh.elementArray.length,
      gl.UNSIGNED_INT,
      0
    );
  }

  /**
   * @typedef {Object} DrawStringOptions
   * @param {number} posX x position on the screen, use float from -1 to 1
   * @param {number} posY y position on the screen, use float from -1 to 1
   * @param {number} size scale of single character, 1 is equal to screen scale
   * @param {number} charWidth defines character spacing
   * @param {boolean} center if true text origin will be in it's center
   * @param {number} toRight if true text origin will be on it's right side
   */

  /**
   * Allows to draw entire string on the screen
   * @param {string} string text that should be drawn on the screen
   * @param {DrawStringOptions} options object that contains text position, size, char spacing and origin options
   */
  static drawString(
    string = "Text",
    options = {
      posX: 0,
      posY: 0,
      size: 0.1,
      charWidth: 0.5,
      center: false,
      toRight: false,
    }
  ) {
    const { posX, posY, size, charWidth, center, toRight } = options;
    let posXOffset = 0;
    const strLen = string.length;

    center && (posXOffset = -strLen * size * charWidth * 0.5);
    toRight && (posXOffset = -strLen * size * charWidth);

    for (let char of string) {
      Renderer.drawChar(char, posX + posXOffset, posY, size);
      posXOffset += size * charWidth;
    }
  }

  /**
   * Draws given character on the screen
   * @param {string} char character that should be drawn
   * @param {number} posX x position on the screen, use float from -1 to 1
   * @param {number} posY y position on the screen, use float from -1 to 1
   * @param {number} size scale of single character, 1 is equal to screen scale
   */
  static drawChar(char = "A", posX = 0, posY = 0, size = 0.1) {
    const gl = EngineToolbox.getGLContext();
    const camera = engineResources.getCamera();
    const charDescriptor = charTable[char.charCodeAt(0)];

    const mat = engineResources.getMaterial("guiText");

    const modelViewMatrix = new Matrix4();
    modelViewMatrix.m03 = posX;
    modelViewMatrix.m13 = posY;
    modelViewMatrix.m23 = -1;
    modelViewMatrix.m00 = size / camera.projection.aspect;
    modelViewMatrix.m11 = size;
    modelViewMatrix.m22 = size;

    mat.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
    mat.uniforms.projectionMatrix.value = new Matrix4().toArray();
    mat.uniforms.normalMatrix.value = new Matrix4().toArray();

    mat.uniforms.mapOffsetX.value = [
      gameConfig.textGridSize * charDescriptor.posX,
    ];
    mat.uniforms.mapOffsetY.value = [
      gameConfig.textGridSize * charDescriptor.posY,
    ];

    mat.linkVertexArrays(engineResources.getMesh("textGUIPlane"));
    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();

    gl.drawElements(
      gl.TRIANGLES,
      engineResources.getMesh("textGUIPlane").elementArray.length,
      gl.UNSIGNED_INT,
      0
    );
  }

  /**
   * Sets clear color, which will be visible on the canvas if nothing is drawn on it
   * @param {Vector4} clearColor vector with four components representing r, g, b and a color channels
   * @returns {Renderer} self reference for easier method chaining
   */
  static setClearColor(clearColor) {
    const gl = EngineToolbox.getGLContext();
    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    return this;
  }

  /**
   * Enables depth testing so elements that are behind other scene objects will not be drawn
   * @returns {Renderer} self reference for easier method chaining
   */
  static enableDepthTest() {
    const gl = EngineToolbox.getGLContext();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    return this;
  }

  /**
   * Disables depth testing so objects drawn will not obscured by elements that are closer to camera,
   * this method is useful when you want to draw elements like skybox
   * @returns {Renderer} self reference for easier method chaining
   */
  static disableDepthTest() {
    const gl = EngineToolbox.getGLContext();
    gl.disable(gl.DEPTH_TEST);
    return this;
  }

  /**
   * Clears the canvas so it's filled with clear color 
   * @returns {Renderer} self reference for easier method chaining
   */
  static clear() {
    const gl = EngineToolbox.getGLContext();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return this;
  }

  /**
   * Enables alpha blending so transparent objects do not obscure objects behind them,
   * remember that in order to avoid rendering artifacts, objects with material that
   * uses alpha should be rendered in order depending on the distance from camera 
   * (closest elements last) 
   * @returns {Renderer} self reference for easier method chaining
   */
  static enableAlphaBlend() {
    const gl = EngineToolbox.getGLContext();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return this;
  }

  /**
   * Disables alpha blending so transparent objects obscure objects behind them
   * @returns {Renderer} self reference for easier method chaining
   */
  static disableAlphaBlend() {
    const gl = EngineToolbox.getGLContext();
    gl.disable(gl.BLEND);
    return this;
  }
}

exports.Renderer = Renderer;
