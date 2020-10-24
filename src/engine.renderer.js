const { Camera } = require("./engine.camera");
const { GameObject } = require("./engine.gameObject");
const { EngineToolbox } = require("./engine.toolbox");
const { Vector4 } = require("./engine.math.vector4");
const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");
const { gameInit } = require("./game.init");

const Renderer = {
  /**
   * Applies scale correction to GUI element (to take screen aspect into account),
   * enforces element's location to be in front of camera and draws it with
   * orthogonal projection.
   * @param {GameObject} GUIElement
   * @param {Camera} camera
   */
  drawGUIElement(GUIElement, camera) {
    const gl = EngineToolbox.getGLContext();
    camera.projection.rebuildMatrixOrtho();

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

    gl.drawElements(gl.TRIANGLES, GUIElement.mesh.elementArray.length, gl.UNSIGNED_INT, 0);
  },

  /**
   * @param {GameObject} gameObject
   * @param {Camera} camera
   */
  drawGameObject(gameObject, camera) {
    const gl = EngineToolbox.getGLContext();
    camera.projection.rebuildMatrixPerspective();

    const mat = gameObject.material;
    const modelViewMatrix = camera.transform.matrix.clone().inverse().multiply(gameObject.transform.matrix);

    mat.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
    mat.uniforms.projectionMatrix.value = camera.projection.matrix.toArray();
    const scaleFactorMatrix = new Matrix4().scale(gameObject.transform.matrix.getScale());
    mat.uniforms.normalMatrix.value = gameObject.transform.matrix
      .clone()
      .inverse()
      .transpose() // normal matrix without scaling factor applied
      .multiply(scaleFactorMatrix)
      .toArray(); // normal matrix with scaling factor applied

    //if (Renderer.lastMaterialUsed === mat && Renderer.lastMeshUsed !== gameObject.mesh) {
    // rebuild vao and vbos if using the same material with different mesh
    mat.createVertexArray(gameObject.mesh);
    //}

    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();
    mat.bindVertexArray();

    //Renderer.lastMeshUsed = gameObject.mesh;
    //Renderer.lastMaterialUsed = gameObject.material;

    gl.drawElements(gl.TRIANGLES, gameObject.mesh.elementArray.length, gl.UNSIGNED_INT, 0);
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
