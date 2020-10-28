const { CreateVector2 } = require("./engine.math.vector2");
const { Renderer } = require("./engine.renderer");
const { Time } = require("./engine.time");

const CreateResizingText = () => ({
  position: CreateVector2(0, -0.5),
  size: 0.075,
  resizeFactor: 0.25,
  resizeSpeed: 3,
  charWidth: 0.7,

  draw(content) {
    Renderer.drawString(content, {
      posX: this.position.x,
      posY: this.position.y,
      size:
        this.size +
        this.size *
          (Math.sin(Time.now * this.resizeSpeed) * 0.5 + 0.5) *
          this.resizeFactor,
      charWidth: this.charWidth,
      center: true,
    });
    return this;
  },
});

exports.CreateResizingText = CreateResizingText;

const CreateJumpText = () => ({
  position: CreateVector2(0.025, 0.5),
  size: 0.1,
  charWidth: 0.7,
  _timer: 2,
  drawTime: 2,
  jumpTime: 0.4,
  jumpScale: 2,

  resetTimer() {
    this._timer = 0;
    return this;
  },

  draw(content) {
    if (this._timer >= this.drawTime) {
      return this;
    }

    this._timer += Time.delta;

    let textSize = this.size;
    if (this._timer < this.jumpTime) {
      textSize =
        this.size +
        this.size * (this.jumpScale - 1) * (1 - this._timer / this.jumpTime);
    }

    Renderer.drawString(content, {
      posX: this.position.x,
      posY: this.position.y,
      size: textSize,
      charWidth: this.charWidth,
      center: true,
    });
    return this;
  },
});

exports.CreateJumpText = CreateJumpText;

const CreateSimpleText = ({
  posX = 0,
  posY = 0,
  size = 0.05,
  charWidth = 0.7,
} = {}) => ({
  position: CreateVector2(posX, posY),
  size: size,
  charWidth: charWidth,

  draw(content) {
    Renderer.drawString(content, {
      posX: this.position.x,
      posY: this.position.y,
      size: this.size,
      charWidth: this.charWidth,
    });
    return this;
  },
});

exports.CreateSimpleText = CreateSimpleText;
