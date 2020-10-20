const { Camera } = require("./engine.camera");
const { GameObject } = require("./engine.gameObject");
const { EngineInfo } = require("./engine.info");
const { EngineToolbox } = require("./engine.toolbox");
const { Vector4 } = require("./engine.math.vector4");
const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");

const gl = EngineToolbox.getGLContext();

class Renderer {
  //   /**
  //    * @type {Mesh}
  //    */
  //   static lastMeshUsed = undefined;
  //   /**
  //    * @type {Material}
  //    */
  //   static lastMaterialUsed = undefined;

  /**
   * Applies scale correction to GUI element (to take screen aspect into account),
   * enforces element's location to be in front of camera and draws it with
   * orthogonal projection.
   * @param {GameObject} GUIElement
   * @param {Camera} camera
   */
  static drawGUIElement(GUIElement, camera) {
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
    mat.uniforms.normalMatrix.value = GUIElement.transform.matrix.clone().inverse().transpose().toArray();

    mat.createVertexArray(GUIElement.mesh);

    mat.uploadUniforms();
    mat.uploadTextures();
    mat.useProgram();
    mat.bindVertexArray();

    gl.drawElements(gl.TRIANGLES, GUIElement.mesh.elementArray.length, gl.UNSIGNED_INT, 0);
  }

  /**
   * @param {GameObject} gameObject
   * @param {Camera} camera
   */
  static drawGameObject(gameObject, camera) {
    camera.projection.rebuildMatrixPerspective();

    const mat = gameObject.material;
    const modelViewMatrix = camera.transform.matrix.clone().inverse().multiply(gameObject.transform.matrix);

    mat.uniforms.modelViewMatrix.value = modelViewMatrix.toArray();
    mat.uniforms.projectionMatrix.value = camera.projection.matrix.toArray();
    mat.uniforms.normalMatrix.value = gameObject.transform.matrix.clone().inverse().transpose().toArray();

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
  }

  /**
   * @param {Vector4} clearColor
   */
  static setClearColor(clearColor) {
    if (!gl) {
      return;
    }
    const engineInfo = new EngineInfo();
    engineInfo.add("clearColor", clearColor);
    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    return this;
  }

  static enableDepthTest() {
    if (!gl) {
      return;
    }
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  static disableDepthTest() {
    if (!gl) {
      return;
    }
    gl.disable(gl.DEPTH_TEST);
  }

  static clear() {
    if (!gl) {
      return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  static enableAlphaBlend() {
    if (!gl) {
      return;
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  static disableAlphaBlend() {
    if (!gl) {
      return;
    }
    gl.disable(gl.BLEND);
  }
}

exports.Renderer = Renderer;
