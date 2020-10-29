const { Vector3 } = require("./engine.math.vector3");
const { Vector4 } = require("./engine.math.vector4");
const { gateController } = require("./game.gateController");

const level0Controller = {
  init() {
    const g0 = gateController.spawnGate("T");
    g0.signOn();
    const g1 = gateController.spawnGate("R");
    const g2 = gateController.spawnGate("T");
    const g3 = gateController.spawnGate("B");
    const g4 = gateController.spawnGate("R");
    const g5 = gateController.spawnGate("L");
    const g6 = gateController.spawnGate("R");
    const g7 = gateController.spawnGate("L");
    const g8 = gateController.spawnGate("B");
    const g9 = gateController.spawnGate("T");

    gateController.reset();
    gateController.setGates([g0, g1, g2, g3, g4, g5, g6, g7, g8, g9]);

    g0.reset().translate(new Vector3(0, 10, -100));
    g1.reset().translate(new Vector3(0, 10, -200));
    g2.reset().translate(new Vector3(0, 10, -300));
    g3.reset().translate(new Vector3(0, 10, -400));
    g4.reset().translate(new Vector3(0, 10, -500));
    g5.reset().translate(new Vector3(0, 10, -600));
    g6.reset().translate(new Vector3(0, 10, -700));
    g7.reset().translate(new Vector3(0, 10, -800));
    g8.reset().translate(new Vector3(0, 10, -900));
    g9.reset().translate(new Vector3(0, 10, -1000));

    g0.addScoreCollider("GATE_0");
    g1.addScoreCollider("GATE_1");
    g2.addScoreCollider("GATE_2");
    g3.addScoreCollider("GATE_3");
    g4.addScoreCollider("GATE_4");
    g5.addScoreCollider("GATE_5");
    g6.addScoreCollider("GATE_6");
    g7.addScoreCollider("GATE_7");
    g8.addScoreCollider("GATE_8");
    g9.addScoreCollider("GATE_9");

    g0.addGateCollider("C_0");
    g1.addGateCollider("C_1");
    g2.addGateCollider("C_2");
    g3.addGateCollider("C_3");
    g4.addGateCollider("C_4");
    g5.addGateCollider("C_5");
    g6.addGateCollider("C_6");
    g7.addGateCollider("C_7");
    g8.addGateCollider("C_8");
    g9.addGateCollider("C_9");

  },
};

exports.level0Controller = level0Controller;
