const { GameObject } = require("./engine.gameObject");
const { Vector3 } = require("./engine.math.vector3");
const { Vector4 } = require("./engine.math.vector4");
const { Renderer } = require("./engine.renderer");
const { engineResources } = require("./engine.resources");
const { Time } = require("./engine.time");

const CreateGate = () => ({
  gate: new GameObject(),
  gateLamps: new GameObject(),
  gateSign: new GameObject(),
  blinkToggleTime: 0.5,
  bounceSpeed: 6,
  bounceStrength: 1,
  _signPosition: new Vector3(),
  _blinkTimer: 0,

  draw() {
    Renderer.drawGameObject(this.gate);
    Renderer.drawGameObject(this.gateLamps);
    Renderer.drawGameObject(this.gateSign);
    return this;
  },
  /**
   * @param {Vector3} vector3
   */
  translate(vector3) {
    this.gate.transform.translate(vector3);
    this.gateLamps.transform.translate(vector3);
    this.gateSign.transform.translate(vector3);

    this.gate.transform.applyLocation();
    this.gateLamps.transform.applyLocation();
    this.gateSign.transform.applyLocation();
    return this;
  },
  rotateY(angle) {
    this.gate.transform.rotateY(angle);
    this.gateLamps.transform.rotateY(angle);
    this.gateSign.transform.rotateY(angle);
    return this;
  },
  applyRotation() {
    this.gate.transform.applyRotation();
    this.gateLamps.transform.applyRotation();
    this.gateSign.transform.applyRotation();
    return this;
  },
  reset() {
    this.gate.transform.reset();
    this.gateLamps.transform.reset();
    this.gateSign.transform.reset();
    return this;
  },
  resetBlinkTimer() {
    this._blinkTimer = 0;
    return this;
  },
  blink() {
    this._blinkTimer += Time.delta;
    if (this._blinkTimer >= this.blinkToggleTime) {
      this.resetBlinkTimer();
      this.gateLamps.material =
        this.gateLamps.material === engineResources.materials.gate_lamps_off
          ? engineResources.materials.gate_lamps_on
          : engineResources.materials.gate_lamps_off;
    }
    return this;
  },
  bounce() {
    const gatePosition = this.gate.transform.matrix.getPosition();
    this._signPosition.y =
      Math.sin(Time.now * this.bounceSpeed) * this.bounceStrength;
    this.gateSign.transform.reset();
    this.gateSign.transform.translate(gatePosition.add(this._signPosition));
    this.gateSign.transform.applyLocation();
    return this;
  },
  signOff() {
    this.gateSign.material = engineResources.materials.gate_lamps_off;
    return this;
  },
  signOn() {
    this.gateSign.material = engineResources.materials.gate_lamps_on;
    return this;
  },
});

const gateController = {
  spawnGate(sign = "B") {
    const gate = CreateGate();
    gate.gate.mesh = engineResources.meshes.gate;
    gate.gate.material = engineResources.materials.gate;

    gate.gateLamps.mesh = engineResources.meshes.gate_lamps;
    gate.gateLamps.material = engineResources.materials.gate_lamps_off;

    switch (sign) {
      case "B":
        gate.gateSign.mesh = engineResources.meshes.bottom_sign;
        break;
      case "T":
        gate.gateSign.mesh = engineResources.meshes.top_sign;
        break;
      case "R":
        gate.gateSign.mesh = engineResources.meshes.right_sign;
        break;
      case "L":
        gate.gateSign.mesh = engineResources.meshes.left_sign;
        break;
      default:
        gate.gateSign.mesh = engineResources.meshes.bottom_sign;
        break;
    }
    gate.gateSign.material = engineResources.materials.gate_lamps_on;
    return gate;
  },
};

exports.gateController = gateController;
