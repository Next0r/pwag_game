const { Time } = require("./engine.time");

class Game {
  static mainFunction = () => {};

  static loop(now) {
    Time.now = now * 0.001;
    Time.delta = Time.now - Time.then;
    Time.then = Time.now;
    if (typeof Game.mainFunction === "function") {
      Game.mainFunction();
    }
    requestAnimationFrame(Game.loop);
  }

  static startLoop() {
    requestAnimationFrame(Game.loop);
  }
}

exports.Game = Game;
