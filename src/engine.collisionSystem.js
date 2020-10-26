const { engineResources } = require("./engine.resources");

const { GameObject } = require("./engine.gameObject");

const CollisionSystem = {
  /**
   * @type {import("./engine.boxCollider").BoxCollider[]}
   */
  colliders: [],
  
  checkCollisions() {
    for (let i = 0; i < this.colliders.length; i += 1) {
      const collider = this.colliders[i];

      for (let j = i + 1; j < this.colliders.length; j++) {
        const nextCollider = this.colliders[j];
        const colliderID = collider.doesCollide(nextCollider);

        // if collision ocurred fire collision functions for both colliders
        // taking part in collision
        if (colliderID !== undefined) {
          collider.onCollide(colliderID);
          nextCollider.onCollide(collider.id);
        }
      }
    }
  },
};

exports.CollisionSystem = CollisionSystem;
