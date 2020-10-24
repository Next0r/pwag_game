const { engineResources } = require("./engine.resources");

const { GameObject } = require("./engine.gameObject");

const CreateCollisionSystem = () => ({
  checkCollisions() {
    const resources = engineResources;
    /**
     * @type {GameObject[]}
     */
    const gameObjects = resources.gameObjects;

    /**
     * @type {import("./engine.boxCollider").BoxCollider[]}
     */
    const colliders = [];
    for (let prop in gameObjects) {
      gameObjects[prop].colliders && colliders.push(...gameObjects[prop].colliders);
    }

    for (let i = 0; i < colliders.length; i += 1) {
      const collider = colliders[i];

      for (let j = i + 1; j < colliders.length; j++) {
        const nextCollider = colliders[j];
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
});

exports.CreateCollisionSystem = CreateCollisionSystem;
