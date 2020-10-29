const { Game } = require("./engine.game");
const { Input } = require("./engine.input");
const { Renderer } = require("./engine.renderer");
const { CreateSimpleText, CreateResizingText } = require("./game.guiText");
const { initEndScreen } = require("./game.initEndScreen");

const handleEndScreen = ({ score = 0, success = 0 } = {}) => {
//   initEndScreen();

  Input.keyboard.onRelease["Space"] = () => {
    Input.keyboard.onRelease = [];
    Game.stop();
    require("./game.handleStartMenu").handleStartMenu();
  };

  let t1 = "You've crashed!";
  success && (t1 = "Congratulations!");

  const mainText = CreateSimpleText({ posY: 0.5, center: true, size: 0.1 });
  const pointsText = CreateSimpleText({ center: true });
  const resizeText = CreateResizingText();

  Game.update = () => {
    Renderer.clear;
    Renderer.enableAlphaBlend();
    mainText.draw(t1);
    pointsText.draw(`Your score: ${score}`);
    resizeText.draw("Press [Space] to continue");
    Renderer.disableAlphaBlend();
  };

  Game.start();
};

exports.handleEndScreen = handleEndScreen;
