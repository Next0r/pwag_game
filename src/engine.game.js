const { Time } = require("./engine.time");

class Game {
  static update = () => {};
  static awake = () => {};

  static loop(now) {
    Time.now = now * 0.001;
    Time.delta = Time.now - Time.then;
    Time.then = Time.now;
    if (typeof Game.update === "function") {
      Game.update();
    }
    requestAnimationFrame(Game.loop);
  }

  /**
   * Calls awake function and starts game loop
   */
  static start() {
    Game.awake();
    requestAnimationFrame(Game.loop);
  }
}

exports.Game = Game;
