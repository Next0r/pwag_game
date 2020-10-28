const { engineResources } = require("./engine.resources");
const { Material } = require("./engine.material");
const { Time } = require("./engine.time");
const { Vector3 } = require("./engine.math.vector3");
const { GameObject } = require("./engine.gameObject");
const { Renderer } = require("./engine.renderer");
const { CreateVector2 } = require("./engine.math.vector2");
const { aircraftController } = require("./game.aircraftController");

const waterController = {
  _animationTimer: 0,
  framesPerSecond: 32,
  waterPlaneSize: 400,
  gridSize: 6,
  /**
   * @type {GameObject}
   */
  waterPlane: undefined,

  init() {
    this.waterPlane = new GameObject();
    this.waterPlane.mesh = engineResources.meshes.water_plane;
    this.waterPlane.material = engineResources.materials.water;
    return this;
  },

  draw() {
    if (!this.waterPlane) {
      return;
    }

    /**
     * @type {Vector3}
     */
    const aircraftPosition = engineResources.gameObjects.aircraft.transform.matrix.getPosition();
    const x =
      Math.floor(aircraftPosition.x / this.waterPlaneSize) *
      this.waterPlaneSize;
    const z =
      Math.floor(aircraftPosition.z / this.waterPlaneSize) *
      this.waterPlaneSize;

    const origin = new Vector3(
      x - this.gridSize * 0.5 * this.waterPlaneSize,
      0,
      z + this.gridSize * 0.5 * this.waterPlaneSize
    );
    const currentPos = new Vector3(x, 0, z);

    for (let z = 0; z < this.gridSize; z += 1) {
      for (let x = 0; x < this.gridSize; x += 1) {
        currentPos.x = origin.x + this.waterPlaneSize * x;
        currentPos.z = origin.z - this.waterPlaneSize * z;

        this.waterPlane.transform.reset();
        this.waterPlane.transform.translate(currentPos);
        this.waterPlane.transform.applyLocation();

        Renderer.drawGameObject(this.waterPlane);
      }
    }

    return this;
  },

  animate() {
    /**
     * @type {Material}
     */
    const waterMaterial = engineResources.materials.water;
    this._animationTimer += Time.delta;

    if (this._animationTimer < 1 / this.framesPerSecond) {
      return;
    }

    this._animationTimer = 0;

    const offsetX = waterMaterial.uniforms.mapOffsetX.value[0];
    const offsetY = waterMaterial.uniforms.mapOffsetY.value[0];

    if (offsetX < 0.875) {
      waterMaterial.uniforms.mapOffsetX.value = [offsetX + 0.125];
    } else if (offsetY < 0.875) {
      waterMaterial.uniforms.mapOffsetY.value = [offsetY + 0.125];
      waterMaterial.uniforms.mapOffsetX.value = [0];
    } else {
      waterMaterial.uniforms.mapOffsetY.value = [0];
      waterMaterial.uniforms.mapOffsetX.value = [0];
    }
    return this;
  },
};

exports.waterController = waterController;
