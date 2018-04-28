class Balls extends Phaser.GameObjects.GameObject {

  constructor() {
    super(config.scene[0], "balls");

    this.BALLS = Object.freeze({
      inactive: false,
    });
    this.balls = [new Ball(), new Ball(), new Ball()];

    // Setup the index of each balls. So we can easily tell if 2 balls
    // are the same.
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].index = i;
    }

    this.reset();
    this.scene.events.on('update', this.update, this);
  }

  update() {
    if (this._countActive() == 1) {
      for (let i = 0; i < this.balls.length; i++) {
        if (this.balls[i].isActivated() && this.balls[i].isLeavingScreen()) {
          this.scene.events.emit("ballleavesscreen");
          break;
        }
      }
    } else {
      for (let i = 0; i < this.balls.length; i++) {
        if (this.balls[i].isActivated() && this.balls[i].isLeavingScreen()) {
          this.balls[i].deactivate();
          break;
        }
      }
    }
  }

  _countActive() {
    return this.balls.filter(x => x.isActivated()).length;
  }

  reset() {
    this.balls[0].activate();
    this.balls[1].deactivate();
    this.balls[2].deactivate();
  }

  getChildren() {
    return this.balls;
  }

  addBall() {
    for (let i = 0; i < this.balls.length; i++) {
      if (!this.balls[i].isActivated()) {
        this.balls[i].activate();
        break;
      }
    }
  }

  changeSpeed(value, timeToLive) {
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].changeSpeed(value, timeToLive);
    }
  }
}
