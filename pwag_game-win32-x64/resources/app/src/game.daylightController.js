const { Input } = require("./engine.input");
const { Vector3 } = require("./engine.math.vector3");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");
const { Material } = require("./engine.material");

const daylightController = {
  _sunRotation: 135,
  sunRotationSpeed: 360,

  reset() {
    this._sunRotation = 135;
    return this;
  },

  handleDaylight() {
    const directLight = engineResources.gameObjects.directLight;

    if (Input.keyboard.isDown("ArrowRight")) {
      this._sunRotation += Time.delta * this.sunRotationSpeed;
      console.log(this._sunRotation);
    }
    if (Input.keyboard.isDown("ArrowLeft")) {
      this._sunRotation -= Time.delta * this.sunRotationSpeed;
      console.log(this._sunRotation);
    }

    const f = Math.PI / 180;

    const x = Math.sin(this._sunRotation * f);
    const z = Math.cos(this._sunRotation * f);

    directLight.direction.x = x;
    directLight.direction.z = z;
    directLight.direction.y = -1;
    directLight.direction.normalize();

    /**
     *@type {Material}
     */
    let mat = engineResources.materials.aircraft;
    mat.uniforms.directLightDirection.value = directLight.direction.toArray();

    mat = engineResources.materials.gate;
    mat.uniforms.directLightDirection.value = directLight.direction.toArray();

    mat = engineResources.materials.gate_lamps_off;
    mat.uniforms.directLightDirection.value = directLight.direction.toArray();

    return this;
  },
};

exports.daylightController = daylightController;
