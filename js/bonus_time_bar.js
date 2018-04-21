class BonusTimeBar extends Phaser.GameObjects.Graphics {
  constructor(bonus) {
    super(config.scene[0], { lineStyle: { width: 4, color: 0xaa00aa } });

    this.bonusTime = bonus;
    this.zoom = 3;

    this.scene.add.existing(this);

    this.line = new Phaser.Geom.Line(1, this._y(), 1, config.height);
    this._drawLine();

    this.scene.events.on('update', this.update, this);
  }

  update() {
    if (this.bonusTime.bonus > 0) {
      this._drawLine();
    }
  }

  _y() {
    return config.height - this.bonusTime.bonus * this.zoom;
  }

  _drawLine() {
    this.clear();
    this.line = this.line.setTo(1, this._y(), 1, config.height);
    this.strokeLineShape(this.line);
  }
}
