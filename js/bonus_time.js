class BonusTime extends Phaser.GameObjects.GameObject {
  constructor(time) {
    super(config.scene[0], "bonusTime");

    this.remaining = time;
    this.now = Date.now();
    this.bar = new BonusTimeBar(this);

    this.scene.events.on('update', this.update, this);
  }

  update() {
    if (!this.scene.isPaused && Date.now() >= this.now + 1000) {
      this.now = Date.now();
      this.remaining--;
    }
  }

  get bonus() {
    return this.remaining;
  }

  set bonus(value) {
    this.remaining = value;
    this.now = Date.now();
  }
}
