let bonusTimeScene = new Phaser.Scene("BonusTime");

bonusTimeScene.init = function() {
  this.rulesFont = { fontFamily: "Courier", fontSize: "32px", fill: "#eee",
                     align: "center" };
  this.isNotDone = true;
  this.state = 1;
};

bonusTimeScene.preload = function() {
  this.load.image("bg", "assets/images/bg-bonus.png");
};

bonusTimeScene.create = function(data) {
  this.bonusTime = data.time;
  this.bonusPoints = data.points;
  this.total = 0;
  this.now = Date.now();

  this.bg = this.add.group({
    key: "bg",
    frameQuantity: 4
  });
  Phaser.Actions.Call(this.bg.getChildren(), function(item) {
    item.setOrigin(0, 0).setAlpha(0.95);
  }, this);
  this.bg.getChildren()[0].x = 0;
  this.bg.getChildren()[0].y = -620;
  this.bg.getChildren()[1].x = 150;
  this.bg.getChildren()[1].y = 620;
  this.bg.getChildren()[2].x = 300;
  this.bg.getChildren()[2].y = -620;
  this.bg.getChildren()[3].x = 450;
  this.bg.getChildren()[3].y = 620;

  this.info = this.add.text(
    config.width / 2,
    config.height / 2,
    "Time: " + this.bonusTime + "\n\nValue: " + this.bonusPoints + "\n\nBonus: 0",
    this.rulesFont
  ).setOrigin(0.5, 0.5);
};

bonusTimeScene.update = function() {
  if (this.state == 1) {
    this.createBackground();
  }
  else if (this.state == 2) {
    this.computeBonus();
  } else if (this.state == 3) {
    this.removeBackground();
  }
};

bonusTimeScene.createBackground = function() {
  let bgs = this.bg.getChildren();
  let bgSpeed = 20;
  if (bgs[0].y < 0) {
    bgs[0] .y += bgSpeed;
    bgs[1] .y -= bgSpeed;
    bgs[2] .y += bgSpeed;
    bgs[3] .y -= bgSpeed;
    this.now = Date.now();
  } else {
    this.state++;
  }
};

bonusTimeScene.computeBonus = function() {
  if (this.bonusTime > 0 && Date.now() >= this.now + 100) {
    if (typeof gSounds.ballHitBrick != "undefined") {
      gSounds.ballHitBrick.play(0.5);
    }
    this.now = Date.now();
    this.bonusTime--;
    this.total += this.bonusPoints;
    this.info.setText("Time: " + this.bonusTime + "\n\nValue: " + this.bonusPoints + "\n\nBonus: " + this.total);
  } else if (this.bonusTime <= 0 && Date.now() >= this.now + 1500) {
    this.state++;
  }
};

bonusTimeScene.removeBackground = function() {
  let bgs = this.bg.getChildren();
  let bgSpeed = 20;
  if (bgs[0].y > -config.height) {
    bgs[0] .y -= bgSpeed;
    bgs[1] .y += bgSpeed;
    bgs[2] .y -= bgSpeed;
    bgs[3] .y += bgSpeed;
    this.now = Date.now();
  } else {
    this.scene.resume("Game");
    this.scene.setVisible(false);
  }
};

