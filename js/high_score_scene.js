let highScoreScene = new Phaser.Scene("HighScore");

highScoreScene.init = function() {
  this.rulesFont = { fontFamily: "Courier", fontSize: "32px", fill: "#eee",
                     align: "center" };
  this.state = 1;
};

highScoreScene.preload = function() {
  this.load.image("bg", "assets/images/bg-bonus.png");
};

highScoreScene.create = function(data) {
  this.score = data.score;
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
};

highScoreScene.update = function() {
  if (this.state == 1) {
    this.cameras.main.fade(2500);
    this.state = 2;
    this.time.delayedCall(2800, () => {
      this.state = 3;
    });
  } else if (this.state == 3) {
    this.createBackground();
    this.displayHighScore();
    this.cameras.main.resetFX();
    this.state = 4;
  } else if (this.state == 4 && Phaser.Input.Keyboard.JustDown(this.spacebar)) {
    this.scene.stop("Game");
    this.scene.start("Game");
    this.scene.setVisible(false);
  }
};

highScoreScene.createBackground = function() {
  this.bg = this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(4, 1).setAlpha(0.95);
};

highScoreScene.displayHighScore = function() {
  this.info = this.add.text(
    config.width / 2,
    config.height / 2,
    "HIGH SCORES\n(soon)\n\nYour score: " + this.score + "\n\n\n(press space)",
    this.rulesFont
  ).setOrigin(0.5, 0.5);
};