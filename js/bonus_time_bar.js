class BonusTimeBar extends Phaser.GameObjects.Graphics {
  constructor(bonus) {
    super(config.scene, { lineStyle: { width: 4, color: 0xaa00aa } });

    this.bonus = bonus;
    this.zoom = 3;

    this.scene.add.existing(this);

    this.line = new Phaser.Geom.Line(1, config.height - this.bonus.remaining * this.zoom, 1, config.height);
    this.strokeLineShape(this.line);

    this.scene.events.on('update', this.update, this);
  }

  update() {
    if (this.bonus.remaining <= 0) {
      return;
    }

    this.clear();
    this.line = this.line.setTo(1, config.height - this.bonus.remaining * this.zoom, 1, config.height);
    this.strokeLineShape(this.line);
  }
}
