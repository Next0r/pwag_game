const { BoxCollider } = require("./engine.boxCollider");
const { CollisionSystem } = require("./engine.collisionSystem");
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
  // scoreCollider: undefined,
  type: undefined,

  addGateCollider(colliderID) {
    let collider = new BoxCollider(`${colliderID}_0`);
    collider.recalculate(engineResources.meshes.gate_collider_01);
    collider.transformationMatrix = this.gate.transform.matrix;
    CollisionSystem.colliders.push(collider);

    collider = new BoxCollider(`${colliderID}_1`);
    collider.recalculate(engineResources.meshes.gate_collider_02);
    collider.transformationMatrix = this.gate.transform.matrix;
    CollisionSystem.colliders.push(collider);

    collider = new BoxCollider(`${colliderID}_2`);
    collider.recalculate(engineResources.meshes.gate_collider_03);
    collider.transformationMatrix = this.gate.transform.matrix;
    CollisionSystem.colliders.push(collider);
    return this;
  },

  addScoreCollider(colliderID) {
    const collider = new BoxCollider(colliderID);
    collider.recalculate(engineResources.meshes.gate_score_collider);
    collider.transformationMatrix = this.gate.transform.matrix;
    CollisionSystem.colliders.push(collider);
    return this;
  },
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
    const gateRotation = this.gate.transform.matrix.getRotation();
    this._signPosition.y =
      Math.sin(Time.now * this.bounceSpeed) * this.bounceStrength;
    this.gateSign.transform.reset();
    this.gateSign.transform.translate(gatePosition.add(this._signPosition));
    this.gateSign.transform.applyLocation();
    this.gateSign.transform.rotateY(gateRotation.y);
    this.gateSign.transform.applyRotation();
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
  lampsOff() {
    this.gateLamps.material = engineResources.materials.gate_lamps_off;
    return this;
  },

  resetSignPosition() {
    const gatePosition = this.gate.transform.matrix.getPosition();
    const gateRotation = this.gate.transform.matrix.getRotation();

    this.gateSign.transform.reset();
    this.gateSign.transform.translate(gatePosition);
    this.gateSign.transform.rotateY(gateRotation.y);
    this.gateSign.transform.applyLocation();
    this.gateSign.transform.applyRotation();

    return this;
  },
});

const gateController = {
  gates: [],
  scoredGates: [],
  nextGate: 0,
  lastGate: undefined,
  onLastGateScore: () => {},
  onGateScore: () => {},

  draw() {
    for (let gate of this.gates) {
      gate.draw();
    }
    return this;
  },

  bounceNextGate() {
    this.nextGate !== undefined && this.gates[this.nextGate].bounce();
    return this;
  },

  blinkNextGate() {
    this.nextGate !== undefined && this.gates[this.nextGate].blink();
    return this;
  },

  reset() {
    this.gates = [];
    this.scoredGates = [];
    this.nextGate = 0;
    this.lastGate = undefined;
    return this;
  },

  /**
   * @param {[]} gates
   */
  setGates(gates) {
    this.gates = gates;
    this.scoredGates = new Array(gates.length).fill(false);
  },

  /**
   * @param {String} colliderID
   */
  handleScoreCollision(colliderID) {
    const [tag, number] = colliderID.split("_");
    if (tag !== "GATE") {
      return;
    }

    const gateNumber = parseInt(number);

    // do not count already scored gate
    if (this.scoredGates[gateNumber] == true) {
      return;
    }

    // if it's first gate or previous gate has been scored
    if (gateNumber == 0 || this.scoredGates[gateNumber - 1] == true) {
      this.scoredGates[gateNumber] = true;

      // switch off sign of scored gate
      this.gates[gateNumber].signOff();
      this.gates[gateNumber].lampsOff();
      this.gates[gateNumber].resetSignPosition();

      // switch on sign of next gate if exists
      if (this.gates[gateNumber + 1] !== undefined) {
        this.gates[gateNumber + 1].signOn();
        this.nextGate = gateNumber + 1;
        this.onGateScore(this.gates[gateNumber]);
      } else {
        // it was last gate
        this.nextGate = undefined;
        this.onLastGateScore(this.gates[gateNumber]);
      }
    }
  },

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
    gate.signOff();
    gate.type = sign;
    return gate;
  },
};

exports.gateController = gateController;
