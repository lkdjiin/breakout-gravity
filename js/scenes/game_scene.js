let gameScene = new Phaser.Scene("Game");

gameScene.init = function() {
  this.score = 0;
  this.scoreText;
  this.digitFont = { fontFamily: "Courier", fontSize: "28px", color: "#ddd" };
  this.rulesFont = { fontFamily: "Courier", fontSize: "40px", color: "#ddd",
                     fontStyle: "italic", align: "center" };
  this.isPaused = true;
  this.info;
  this.gameWon = false;
};

gameScene.preload = function() {
  this.load.image("ball", "assets/images/ball.png");
  this.load.spritesheet("paddle", "assets/images/paddle_anim.png",
                        { frameWidth: 152, frameHeight: 48 });
  this.load.image("brick", "assets/images/brick.png");
  this.load.image("brick2", "assets/images/brick2.png");
  this.load.image("brick3", "assets/images/brick3.png");
  this.load.image("brick4", "assets/images/brick4.png");
  this.load.image("heart", "assets/images/heart.png");
  this.load.image("coin", "assets/images/coin.png");
  this.load.image("star", "assets/images/bg-star.png");
  this.load.image("bg01", "assets/images/bg01-06.jpg");
  this.load.image("bg02", "assets/images/bg01-04.jpg");
  this.load.image("bg03", "assets/images/bg01-02.jpg");
  this.load.image("bonus", "assets/images/bonus.png");
  this.load.image("malus", "assets/images/malus.png");
};

gameScene.create = function() {
  displayVersion();

  let levels = [Level0101, Level0102, Level0103];
  this.levelManager = new LevelManager(levels);

  this.backgroundStars = new StarryBackground();
  this.cursors = this.input.keyboard.createCursorKeys();
  this.paddle = new Paddle();
  this.balls = new Balls();
  this.lives = new Lives();

  this.createAnimations();
  this.dynamicBricks = this.physics.add.group();
  this.bonusMalus = new BonusMalus(this.dynamicBricks);

  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

  this.scoreText = this.add.text(40, config.height - 30, "000000", this.digitFont);

  this.physics.pause();

  this.info = this.add.text(
    config.width / 2,
    config.height / 2,
    "Press space and\nbeat the gravity",
    this.rulesFont
  ).setOrigin(0.5, 0.5);
  this.info.setStroke('#959', 8);
  this.info.setShadow(2, 2, "#222", 2, false, true);

  this.add.image(config.width - 64, config.height - 18, "heart").setScale(0.6);
  this.add.image(24, config.height - 18, "coin").setScale(0.7);

  // Without a delay, gSounds is not yet created. Anyway the delay is
  // useful to blend the «game over» sound and this one.
  this.time.delayedCall(1500, () => { gSounds.newGame.play(); }, [], this);

  this.events.on("gameover", this.gameOver, this);
  this.events.on("ballreset", () => { this.balls.reset(); }, this);

  this.bonusTime = new BonusTime(this.levelManager.level.bonusTime);
};

gameScene.update = function() {
  this.physics.add.collider(this.balls.getChildren(), this.paddle, (a, b) => {
    this.ballHitPaddle(a, b);
  });

  this.physics.add.collider(this.balls.getChildren(), this.staticBricks, (_, brick) => {
    this.ballHitBrick(brick);
  });

  this.physics.add.collider(this.paddle, this.dynamicBricks, (_, brick) => {
    this.brickHitPaddle(brick);
  });

  if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.paddle.canShot) {
    if (this.isPaused) {
      this.resume();
    }
    this.paddle.shoot();
  }

  if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
    if (!this.isPaused) {
      this.pause();
    } else {
      this.resume();
    }
  }
};

gameScene.pause = function() {
  this.isPaused = true;
  this.physics.pause();
  this.info.setText("Game paused\n\nPress P to resume");
};

gameScene.resume = function() {
  this.info.setText("");
  this.physics.resume();
  this.isPaused = false;
};

gameScene.ballHitBrick = function(brick) {
  gSounds.ballHitBrick.play();

  let hardness = brick.getData("hardness");

  if (hardness == 1) {
    this.bonusMalus.createFrom(brick);
    this.score += brick.getData("points");
    brick.destroy();
    this.updateScore();
    if (this.staticBricks.countActive(true) === 0) {
      this.dynamicBricks.clear();
      this.levelUp();
    }
  } else {
    brick.setData("hardness", hardness - 1);
  }
};

gameScene.updateScore = function() {
  this.scoreText.setText(this.score.toString().padLeft("000000"));
};

gameScene.brickHitPaddle = function(item) {
  if (item.getData("bonus") || item.getData("malus")) {
    this.events.emit("bonusmalushit", item);
  } else {
    this.events.emit("brickhitpaddle");
    gSounds.brickHitPaddle.play(0.2);
    this.cameras.main.flash(500);
  }

  item.destroy();
};

gameScene.ballHitPaddle = function(ball, paddle) {
  if (this.paddle.isShooting) {
    gSounds.bounce.play(0.5);
    this.events.emit("ballhitpaddle",
                     ball.x, paddle.x, paddle.shotStrength, ball.index);
  }
};

gameScene.gameOver = function() {
  gSounds.gameOver.play();
  this.info.setText("Game Over");
  this.staticBricks.clear();
  this.physics.pause();
  this.scene.pause();
  this.scene.launch("HighScore", {score: this.score});
};

gameScene.levelUp = function() {
  gSounds.levelUp.play(0.5);
  this.gameWon = this.levelManager.levelUp();
  this.paddle.reset();
  this.balls.reset();
  this.isPaused = true;
  this.physics.pause();
  this.manageBonusTime();
  this.updateScore();
  this.info.setText("Level up,\npress space");
};

gameScene.createAnimations = function() {
  this.anims.create({
    key: 'shot',
    frames: this.anims.generateFrameNumbers('paddle', { frames: [1, 2, 1, 0, 3, 0] }),
    frameRate: 20
  });

  this.anims.create({
    key: 'hitByBrick',
    frames: this.anims.generateFrameNumbers('paddle', { frames: [3, 4, 3, 0, 1, 0] }),
    frameRate: 20
  });
};

gameScene.manageBonusTime = function() {
  let bonus = this.bonusTime.bonus * 100;
  this.score += bonus;

  this.scene.pause();
  this.scene.launch("BonusTime", {
    time: this.bonusTime.bonus,
    points: 100,
    gameWon: this.gameWon
  });
  this.bonusTime.bonus = this.levelManager.level.bonusTime;
};

gameScene.addBall = function() {
  this.balls.addBall();
};
