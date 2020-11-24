const { Matrix4 } = require("./engine.math.matrix4");
const { Vector3 } = require("./engine.math.vector3");

/**
 * Represents transform module of game object (or camera)
 * use is to change position, rotation and scale
 */
class Transform {
  /**
   * Creates new transform module
   */
  constructor() {
    /**
     * Typical transformation matrix avoid changing this property directly
     * @type {Matrix4}
     */
    this.matrix = new Matrix4();
    /**
     * Typical location matrix avoid changing this property directly
     * @type {Matrix4}
     */
    this._locationMatrix = new Matrix4();
    /**
     * Typical rotation matrix avoid changing this property directly
     * @type {Matrix4}
     */
    this._rotationMatrix = new Matrix4();
    /**
     * Typical scale matrix avoid changing this property directly
     * @type {Matrix4}
     */
    this._scaleMatrix = new Matrix4();
  }

  /**
   * Rotates rotation matrix by give angle in x axis, remember to call
   * applyRotation to make changes persistent
   * @param {Number} angle rotation angle in degrees
   * @returns {Transform} self reference for easier method chaining
   */
  rotateX(angle) {
    this._rotationMatrix.rotate(Vector3.right, angle);
    return this;
  }
  /**
   * Rotates rotation matrix by give angle in Y axis, remember to call
   * applyRotation to make changes persistent
   * @param {Number} angle rotation angle in degrees
   * @returns {Transform} self reference for easier method chaining
   */
  rotateY(angle) {
    this._rotationMatrix.rotate(Vector3.up, angle);
    return this;
  }
  /**
   * Rotates rotation matrix by give angle in Z axis, remember to call
   * applyRotation to make changes persistent
   * @param {Number} angle rotation angle in degrees
   * @returns {Transform} self reference for easier method chaining
   */
  rotateZ(angle) {
    this._rotationMatrix.rotate(Vector3.forward, angle);
    return this;
  }
  /**
   * Translates location matrix by given vector, remember to call applyLocation
   * to make changes persistent
   * @param {Vector3} translationVector x, y and z location matrix offset
   * @returns {Transform} self reference for easier method chaining
   */
  translate(translationVector) {
    this._locationMatrix.translate(translationVector);
    return this;
  }
  /**
   * Scales scale matrix by given vector, remember to call applyScale
   * to make changes persistent
   * @param {Vector3} scaleVector applied scale e.g [1, 2, 2]
   * @returns {Transform} self reference for easier method chaining
   */
  scale(scaleVector) {
    this._scaleMatrix.scale(scaleVector);
    return this;
  }

  /**
   * Makes all transform matrices (location, rotation, scale, transformation) identity
   * @returns {Transform} self reference for easier method chaining
   */
  reset() {
    this._locationMatrix.identity();
    this._rotationMatrix.identity();
    this._scaleMatrix.identity();
    this.matrix.identity();
    return this;
  }

  /**
   * Applies location matrix to transformation, use this method with applyScale
   * and applyRotation in different order to achieve different results, this
   * method also resets location matrix
   * @returns {Transform} self reference for easier method chaining
   */
  applyLocation() {
    this.matrix.multiply(this._locationMatrix);
    this._locationMatrix.identity();
    return this;
  }

  /**
   * Applies rotation matrix to transformation, use this method with applyScale
   * and applyLocation in different order to achieve different results, this
   * method also resets rotation matrix
   * @returns {Transform} self reference for easier method chaining
   */
  applyRotation() {
    this.matrix.multiply(this._rotationMatrix);
    this._rotationMatrix.identity();
    return this;
  }

  /**
   * Applies scale matrix to transformation, use this method with applyRotation
   * and applyLocation in different order to achieve different results, this
   * method also resets scale matrix
   * @returns {Transform} self reference for easier method chaining
   */
  applyScale() {
    this.matrix.multiply(this._scaleMatrix);
    this._scaleMatrix.identity();
    return this;
  }
}

exports.Transform = Transform;
