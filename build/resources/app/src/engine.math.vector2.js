/**
 * Represents vector with two elements x and y
 */
class Vector2 {
  /**
   * Creates new vector2 instance
   * @param {number} x value of first vector element
   * @param {number} y value of second vector element
   */
  constructor(x = 0, y = 0) {
    /**
     * Value of first vector element
     * @type {number}
     */
    this.x = x;
    /**
     * Value of second vector element
     * @type {number}
     */
    this.y = y;
  }
}

exports.Vector2 = Vector2;
