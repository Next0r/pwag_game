const { BoxCollider } = require("./engine.boxCollider");

/**
 * Collision system prototype, can be used to check
 * collisions between box colliders
 */
class CollisionSystem {
  /**
   * Creates collision system instance
   */
  constructor() {
    /**
     * Array of box colliders taking part in collision verification
     * @type {BoxCollider[]}
     */
    this.colliders = [];
  }

  /**
   * Removes all colliders from collision system
   * @returns {CollisionSystem} self reference for easier method chaining
   */
  reset() {
    this.colliders = [];
    return this;
  }

  /**
   * Checks if collision between colliders in system occurred, if so
   * colliders onCollision methods are fired (collider ID is provided
   * as first parameter)
   * @returns {CollisionSystem} self reference for easier method chaining
   */
  checkCollisions() {
    for (let i = 0; i < this.colliders.length; i += 1) {
      const collider = this.colliders[i];

      for (let j = i + 1; j < this.colliders.length; j++) {
        const nextCollider = this.colliders[j];
        const colliderID = collider.doesCollide(nextCollider);

        // if collision ocurred fire collision functions for both colliders
        // taking part in collision
        if (colliderID !== undefined) {
          collider.onCollision(colliderID);
          nextCollider.onCollision(collider.id);
        }
      }
    }
    return this;
  }
}

// const CollisionSystem = {
//   /**
//    * @type {BoxCollider[]}
//    */
//   colliders: [],

//   reset() {
//     this.colliders = [];
//   },

//   checkCollisions() {
//     for (let i = 0; i < this.colliders.length; i += 1) {
//       const collider = this.colliders[i];

//       for (let j = i + 1; j < this.colliders.length; j++) {
//         const nextCollider = this.colliders[j];
//         const colliderID = collider.doesCollide(nextCollider);

//         // if collision ocurred fire collision functions for both colliders
//         // taking part in collision
//         if (colliderID !== undefined) {
//           collider.onCollision(colliderID);
//           nextCollider.onCollision(collider.id);
//         }
//       }
//     }
//   },
// };

exports.CollisionSystem = new CollisionSystem();
