const { Time } = require("./engine.time");

class Game {
  static _requestHandle = undefined;

  static update = () => {};
  // static awake = () => {};

  static loop(now) {
    Time.now = now * 0.001;
    Time.delta = Time.now - Time.then;
    Time.then = Time.now;
    if (typeof Game.update === "function") {
      Game.update();
    }
    Game._requestHandle = requestAnimationFrame(Game.loop);
  }

  /**
   * Calls awake function and starts game loop
   */
  static start() {
    // Game.awake();
    Game._requestHandle = requestAnimationFrame(Game.loop);
  }

  static stop() {
    Game._requestHandle && cancelAnimationFrame(Game._requestHandle);
  }
}

exports.Game = Game;
