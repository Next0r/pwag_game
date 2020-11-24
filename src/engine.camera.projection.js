const { Matrix4 } = require("./engine.math.matrix4");

/**
 * Projection module used in camera
 */
class Projection {
  /**
   * Creates new projection module
   */
  constructor() {
    /**
     * Field of view in degrees
     * @type {number}
     */
    this.fov = 45;
    /**
     * Screen aspect as x divided by y
     * @type {number}
     */
    this.aspect = 4 / 3;
    /**
     * Near clipping plane, elements that are closer to camera than this value
     * will not be rendered
     * @type {number}
     */
    this.near = 0.1;
    /**
     * Far clipping plane, elements farther from camera than this value will
     * not be rendered
     * @type {number}
     */
    this.far = 100;
    /**
     * Typical OpenGL projection matrix
     * @type {Matrix4}
     */
    this.matrix = new Matrix4();
  }

  /**
   * Recalculates projection matrix, if you change one of projection module
   * parameters, call this method to apply them
   * @returns {Projection} self reference for easier method chaining
   */
  rebuildMatrixPerspective() {
    this.matrix.identity();
    this.matrix.projection({
      fov: this.fov,
      aspect: this.aspect,
      near: this.near,
      far: this.far,
    });
    return this;
  }

  /**
   * Recalculates projection matrix as ortho (without perspective), such projection
   * is used to render GUI elements without perspective distortion
   * @returns {Projection} self reference for easier method chaining
   */
  rebuildMatrixOrtho() {
    this.matrix.identity();
    this.matrix.ortho({ aspect: this.aspect, near: this.near, far: this.far });
    return this;
  }
}

exports.Projection = Projection;
