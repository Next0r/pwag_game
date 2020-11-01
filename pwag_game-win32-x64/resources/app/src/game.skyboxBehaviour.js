const { engineResources } = require("./engine.resources");
const { GameObject } = require("./engine.gameObject");

const skyboxBehaviour = {
  followCamera() {
    const camera = engineResources.gameObjects.camera;
    /**
     * @type {GameObject}
     */
    const skybox = engineResources.gameObjects.skybox;
    skybox.transform.reset();
    skybox.transform.translate(camera.transform.matrix.getPosition());
    skybox.transform.applyLocation();
  },
};

exports.skyboxBehaviour = skyboxBehaviour;
