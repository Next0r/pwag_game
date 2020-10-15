const { Vector4 } = require("./engine.math.vector4");

class EngineInfo {
  constructor() {
    if (EngineInfo.instance) {
      return EngineInfo.instance;
    }

    this._data = init();

    EngineInfo.instance = this;
  }

  static instance = undefined;

  set(id, property) {
    this._data[id] = property;
  }

  get(id) {
    return this._data[id];
  }

  delete(id) {
    this._data[id] = undefined;
  }
}

const init = () => {
  return {
    canvasID: "game_window",
    clearColor: new Vector4(0, 0, 0, 1),
  };
};

exports.EngineInfo = EngineInfo;
