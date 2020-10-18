class DataBase {
  constructor() {
    this._data = {};
  }

  add(id, sceneElement) {
    this._data[id] = sceneElement;
    return this;
  }

  get(id) {
    return this._data[id];
  }

  delete(id) {
    this._data[id] = undefined;
    return this;
  }

  static instance = undefined;
}

exports.DataBase = DataBase;
