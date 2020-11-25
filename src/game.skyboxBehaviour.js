const engineResources = require("./engine.resources").Resources();
const { GameObject } = require("./engine.gameObject");

const skyboxBehaviour = {
  followCamera() {
    const camera = engineResources.getCamera();
    /**
     * @type {GameObject}
     */
    const skybox = engineResources.getGameObject("skybox");
    skybox.transform.reset();
    skybox.transform.translate(camera.transform.matrix.getPosition());
    skybox.transform.applyLocation();
  },
};

exports.skyboxBehaviour = skyboxBehaviour;
