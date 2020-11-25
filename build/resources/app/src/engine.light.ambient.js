const { Vector3 } = require("./engine.math.vector3");

/**
 * Represents ambient light present on scene
 * use instance of this class to change it's intensity
 * or color
 */
class AmbientLight {
  /**
   * Creates ambient light instance
   */
  constructor() {
    /**
     * Ambient light color use float values from 0 to 1 for each channel
     * @type {Vector3} 
     */
    this.color = new Vector3(0.65, 0.8, 1);
    /**
     * Ambient light intensity use float value from 0 to 1
     * @type {number}
     */
    this.value = 0.2;
  }
}

exports.AmbientLight = AmbientLight;
