const { Vector3 } = require("./engine.math.vector3");

/**
 * Represents direct light present on scene
 * use instance of this class to change it's intensity, direction
 * or color
 */
class DirectLight {
  /**
   * Creates direct light instance
   */
  constructor() {
    /**
     * Normalized light direction vector, lights behaves properly
     * if y value is negative
     * @type {Vector3}
     */
    this.direction = new Vector3(1, -1, -1).normalize();
    /**
     * Direct light color use float values from 0 to 1 for each channel
     * @type {Vector3}
     */
    this.color = new Vector3(1, 1, 1);
    /**
     * Direct light intensity use float value from 0 to 1
     * @type {number}
     */
    this.value = 1;
  }
}

exports.DirectLight = DirectLight;
