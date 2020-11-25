const { Projection } = require("./engine.camera.projection");
const { Transform } = require("./engine.gameObject.transform");

/**
 * Represents virtual camera present on scene
 */
class Camera {
  /**
   * Creates new camera
   */
  constructor() {
    /**
     * Transform module of camera, allows to modify it's position, rotation and scale
     * @type {Transform} 
     */
    this.transform = new Transform();
    /**
     * Projection module of camera, allows to modify viewport properties e.g. aspect
     * @type {Projection}
     */
    this.projection = new Projection();
  }
}

exports.Camera = Camera;
