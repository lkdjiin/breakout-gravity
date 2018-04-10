class BonusTime extends Phaser.GameObjects.GameObject {
  constructor(time) {
    super(config.scene, "bonusTime");

    this.remaining = time;
    this.now = Date.now();
    this.bar = new BonusTimeBar(this);

    this.scene.events.on('update', this.update, this);
  }

  update() {
    if (!this.scene.pause && Date.now() >= this.now + 1000) {
      this.now = Date.now();
      this.remaining--;
    }
  }

  get bonus() {
    return this.remaining;
  }
}
