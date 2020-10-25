const { Camera } = require("./engine.camera");
const { GameObject } = require("./engine.gameObject");
const { EngineToolbox } = require("./engine.toolbox");
const { Vector4 } = require("./engine.math.vector4");
const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");
const { gameInit } = require("./game.init");
const { engineResources } = require("./engine.resources");
const { charTable } = require("./engine.charTable");

const Renderer = {
  /**
   * Applies scale correction to GUI element (to take screen aspect into account),
   * enforces element's location to be in front of camera and draws it with
   * orthogonal projection.
   * @param {GameObject} GUIElement
   */
  drawGUIElement(GUIElement) {
    const gl = EngineToolbox.getGLContext();
    const camera = engineResources.gameObjects.camera;

    const mat = GUIElement.material;
    const modelViewMatrix = GUIElement.transform.matrix.clone();
    // correct element scale with screen aspect
    const scaleCorrection = new Vector3(1 / camera.projection.aspect, 1, 1);
    modelViewMatrix.scale(scaleCorrection);
    // force z position to -1
    modelViewMatrix.m32 = -1;

    mat.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
    mat.uniforms.projectionMatrix.value = new Matrix4().toArray();
    mat.uniforms.normalMatrix.value = new Matrix4().toArray();

    mat.createVertexArray(GUIElement.mesh);

    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();
    mat.bindVertexArray();

    gl.drawElements(
      gl.TRIANGLES,
      GUIElement.mesh.elementArray.length,
      gl.UNSIGNED_INT,
      0
    );
  },

  /**
   * @param {GameObject} gameObject
   */
  drawGameObject(gameObject) {
    const gl = EngineToolbox.getGLContext();
    const camera = engineResources.gameObjects.camera;
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

    mat.createVertexArray(gameObject.mesh);

    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();
    mat.bindVertexArray();

    gl.drawElements(
      gl.TRIANGLES,
      gameObject.mesh.elementArray.length,
      gl.UNSIGNED_INT,
      0
    );
  },

  drawString(
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

    if (center) {
      posXOffset = -string.length * size * charWidth * 0.5;
    } else if (toRight) {
      posXOffset = -string.length * size * charWidth;
    }

    for (let char of string) {
      this.drawChar(char, posX + posXOffset, posY, size);
      posXOffset += size * charWidth;
    }
  },

  drawChar(char = "A", posX = 0, posY = 0, size = 0.1) {
    const gl = EngineToolbox.getGLContext();
    const camera = engineResources.gameObjects.camera;
    const charDescriptor = charTable[char.charCodeAt(0)];

    const textPlane = engineResources.meshes.textGUIPlane;
    const mat = engineResources.materials.guiText;

    const locationMatrix = new Matrix4();
    locationMatrix.translate(new Vector3(posX, posY, -1));

    const scaleMatrix = new Matrix4();
    scaleMatrix.scale(
      new Vector3((1 / camera.projection.aspect) * size, 1 * size, 1 * size)
    );

    const modelViewMatrix = new Matrix4();
    modelViewMatrix.multiply(locationMatrix).multiply(scaleMatrix);

    mat.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
    mat.uniforms.projectionMatrix.value = new Matrix4().toArray();
    mat.uniforms.normalMatrix.value = new Matrix4().toArray();

    mat.uniforms.mapOffsetX.value = [
      EngineToolbox.getSettings().textGridSize * charDescriptor.posX,
    ];
    mat.uniforms.mapOffsetY.value = [
      EngineToolbox.getSettings().textGridSize * charDescriptor.posY,
    ];

    mat.createVertexArray(textPlane);

    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();
    mat.bindVertexArray();

    gl.drawElements(
      gl.TRIANGLES,
      textPlane.elementArray.length,
      gl.UNSIGNED_INT,
      0
    );
  },

  /**
   * @param {Vector4} clearColor
   */
  setClearColor(clearColor) {
    const gl = EngineToolbox.getGLContext();
    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    return this;
  },

  enableDepthTest() {
    const gl = EngineToolbox.getGLContext();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    return this;
  },

  disableDepthTest() {
    const gl = EngineToolbox.getGLContext();
    gl.disable(gl.DEPTH_TEST);
    return this;
  },

  clear() {
    const gl = EngineToolbox.getGLContext();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return this;
  },

  enableAlphaBlend() {
    const gl = EngineToolbox.getGLContext();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return this;
  },

  disableAlphaBlend() {
    const gl = EngineToolbox.getGLContext();
    gl.disable(gl.BLEND);
    return this;
  },
};

exports.Renderer = Renderer;
