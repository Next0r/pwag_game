const { Time } = require("./engine.time");

/**
 * Represents game that runs on engine, allows to define
 * update loop, start and stop game
 */
class Game {
  /**
   * Handler to next frame request, changing this value
   * will make game unstoppable (performance issues)
   * @type {number} 
   */
  static _requestHandle = undefined;

  /**
   * Assign your update loop here (it's good place to put rendering 
   * routines, game logic etc.)
   * @type {function}
   */
  static update = () => {};

  /**
   * This is internal method that is fired every frame, allows time 
   * measurement and handles update function, do NOT put any game
   * logic or rendering here, use update method instead
   * @param {number} now current time
   */
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
   * Starts the game loop, call this method if you have just
   * created new game or stopped previous one
   */
  static start() {
    Game._requestHandle = requestAnimationFrame(Game.loop);
  }

  /**
   * Stops the game loop, call this method before you start next scene
   * or previous handler will be lost and old scene will still be running
   * in background affecting performance heavily
   */
  static stop() {
    Game._requestHandle && cancelAnimationFrame(Game._requestHandle);
  }
}

exports.Game = Game;
