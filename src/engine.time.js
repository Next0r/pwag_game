/**
 * Simple game timing information container
 */
class Time {
  /**
   * Time when last frame was rendered
   * @type {number}
   */
  static then = 0;
  /**
   * Time when current frame was rendered
   * @type {number}
   */
  static now = 0;
  /**
   * Time that elapsed since last frame was rendered
   * @type {number}
   */
  static delta = 0;
}

exports.Time = Time;
