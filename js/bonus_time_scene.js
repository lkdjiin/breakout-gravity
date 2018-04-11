let bonusTimeScene = new Phaser.Scene("BonusTime");

bonusTimeScene.init = function() {
  this.rulesFont = { fontFamily: "Courier", fontSize: "32px", fill: "#ddd",
                     align: "center" };
  this.isNotDone = true;
};

bonusTimeScene.create = function(data) {
  this.rect = new Phaser.Geom.Rectangle(100, 100, config.width - 200, config.height - 200);
  this.graphics = this.add.graphics({ fillStyle: { color: 0x777777 } });
  this.graphics.fillRectShape(this.rect).setAlpha(0.9);

  this.bonusTime = data.time;
  this.bonusPoints = data.points;
  this.total = 0;

  this.now = Date.now();

  this.info = this.add.text(
    config.width / 2,
    config.height / 2,
    "Time: " + this.bonusTime + "\n\nValue: " + this.bonusPoints + "\n\nBonus: 0",
    this.rulesFont
  ).setOrigin(0.5, 0.5);
};

bonusTimeScene.update = function() {
  if (this.bonusTime > 0 && Date.now() >= this.now + 100) {
    this.now = Date.now();
    this.bonusTime--;
    this.total += this.bonusPoints;
    this.info.setText("Time: " + this.bonusTime + "\n\nValue: " + this.bonusPoints + "\n\nBonus: " + this.total);
  }
  else if (this.isNotDone && this.bonusTime <= 0) {
    this.isNotDone = false;
    this.time.delayedCall(3000, () => {
      this.scene.resume("Game");
      this.scene.setVisible(false);
    }, [], this);
  }
};
