const { EngineToolbox } = require("./engine.toolbox");
const { Vector4 } = require("./engine.math.vector4");
const { Matrix4 } = require("./engine.math.matrix4");
const engineResources = require("./engine.resources").Resources();
const { charTable } = require("./engine.charTable");
const path = require("path");
const gameConfig = require(path.join(__dirname, "..", "gameConfig.json"));

class Renderer {
  static drawGUIElement(
    texture,
    options = { posX: 0, posY: 0, scaleX: 0.1, scaleY: 0.1 }
  ) {
    const gl = EngineToolbox.getGLContext();
    const camera = engineResources.getCamera();
    const { posX, posY, scaleX, scaleY } = options;

    /**
     * @type {Material}
     */
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
   * @param {Vector4} clearColor
   */
  static setClearColor(clearColor) {
    const gl = EngineToolbox.getGLContext();
    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    return this;
  }

  static enableDepthTest() {
    const gl = EngineToolbox.getGLContext();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    return this;
  }

  static disableDepthTest() {
    const gl = EngineToolbox.getGLContext();
    gl.disable(gl.DEPTH_TEST);
    return this;
  }

  static clear() {
    const gl = EngineToolbox.getGLContext();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return this;
  }

  static enableAlphaBlend() {
    const gl = EngineToolbox.getGLContext();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return this;
  }

  static disableAlphaBlend() {
    const gl = EngineToolbox.getGLContext();
    gl.disable(gl.BLEND);
    return this;
  }
}

exports.Renderer = Renderer;
