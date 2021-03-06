class Lives extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "lives");

    this.worldWidth = config.width;
    this.worldHeight = config.height;

    this.remaining = 7;
    this.text = this.scene.add.text(config.width - 48, config.height - 30,
                                    this.remaining, this.scene.digitFont);

    this.scene.events.on("ballleavesscreen", this.ballLeaveScreenEvent, this);
    this.scene.events.on("brokenpaddle", this.lost, this);
  }

  decrement() {
    gSounds.lostLive.play();
    this.scene.cameras.main.flash(500);
    this.remaining--;
    this.text.setText(this.remaining);
  }

  add(number) {
    for (let i = 0; i < number; i++) {
      this.addOne();
    }
  }

  addOne() {
    this.remaining++;
    this.text.setText(this.remaining);
  }

  get isZero() {
    return this.remaining === 0;
  }

  ballLeaveScreenEvent() {
    this.lost();
    this.scene.events.emit("ballreset");
  }

  lost() {
    this.decrement();
    if (this.isZero) {
      this.scene.events.emit("gameover");
    }
  }
}
