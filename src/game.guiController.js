const { CreateVector2 } = require("./engine.math.vector2");
const { Renderer } = require("./engine.renderer");
const { Time } = require("./engine.time");

const guiController = {
  _charWidth: 0.55,
  _pointsTimer: 2,
  pointsDrawTime: 2,
  pointsJumpInTime: 0.4,
  pointsJumpInScale: 2,
  pointsTextSize: 0.1,
  pointsPosition: CreateVector2(0.025, 0.5),
  altitudeTextPosition: CreateVector2(-0.95, -0.9),
  altitudeTextSize: 0.05,
  speedTextPosition: CreateVector2(-0.95, -0.8),
  speedTextSize: 0.05,
  scoreTextPosition: CreateVector2(-0.95, 0.9),
  scoreTextSize: 0.05,

  resetDrawPointsTimer() {
    this._pointsTimer = 0;
    return this;
  },

  drawPoints(points = "100") {
    if (this._pointsTimer >= this.pointsDrawTime) {
      return this;
    }

    this._pointsTimer += Time.delta;

    let textSize = this.pointsTextSize;
    if (this._pointsTimer < this.pointsJumpInTime) {
      textSize =
        this.pointsTextSize +
        this.pointsTextSize *
          (this.pointsJumpInScale - 1) *
          (1 - this._pointsTimer / this.pointsJumpInTime);
    }

    Renderer.drawString(points, {
      posX: this.pointsPosition.x,
      posY: this.pointsPosition.y,
      size: textSize,
      charWidth: this._charWidth,
      center: true,
    });

    return this;
  },

  drawAltitude(altitude = "50") {
    Renderer.drawString(`Alt: ${altitude}m`, {
      posX: this.altitudeTextPosition.x,
      posY: this.altitudeTextPosition.y,
      size: this.altitudeTextSize,
      charWidth: this._charWidth,
    });
  },

  drawScore(score = "50") {
    Renderer.drawString(`Score: ${score}`, {
      posX: this.scoreTextPosition.x,
      posY: this.scoreTextPosition.y,
      size: this.scoreTextSize,
      charWidth: this._charWidth,
    });
  },

  drawSpeed(speed = "50") {
    Renderer.drawString(`Spd: ${speed} kmh`, {
      posX: this.speedTextPosition.x,
      posY: this.speedTextPosition.y,
      size: this.speedTextSize,
      charWidth: this._charWidth,
    });
  },

};

exports.guiController = guiController;
