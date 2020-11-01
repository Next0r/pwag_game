class DataBase {
  constructor() {
    this._data = {};
  }

  add(id, sceneElement) {
    this._data[id] = sceneElement;
    return this;
  }

  get(id) {
    const data = this._data[id];
    if (data === undefined) {
      console.warn(`Cannot find element with id: ${id}.`);
    }
    return data;
  }

  delete(id) {
    this._data[id] = undefined;
    return this;
  }

  static instance = undefined;
}

exports.DataBase = DataBase;
