class BonusTime extends Phaser.GameObjects.GameObject {
  constructor(time) {
    super(config.scene[0], "bonusTime");

    this._remaining = time;
    this._now = Date.now();
    this.bar = new BonusTimeBar(this);

    this.scene.events.on('update', this.update, this);
  }

  update() {
    if (!this.scene.isPaused && Date.now() >= this._now + 1000) {
      this._now = Date.now();
      this._remaining--;
    }
  }

  get bonus() {
    if (this._remaining > 0) {
      return this._remaining;
    } else {
      return 0;
    }
  }

  set bonus(value) {
    this._remaining = value;
    this._now = Date.now();
  }
}
