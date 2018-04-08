let gameScene = new Phaser.Scene("Game");

let config = {
  type: Phaser.AUTO,
  width: 600,
  height: 620,
  parent: "js-game",
  backgroundColor: "#444444",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: gameScene,
  title: "Breakout {Gravity}",
  version: "0.2.0 «Spring»"
};

let game = new Phaser.Game(config);

gameScene.init = function() {
  this.score = 0;
  this.scoreText;
  this.digitFont = { fontFamily: "Courier", fontSize: "28px", fill: "#ddd" };
  this.rulesFont = { fontFamily: "Courier", fontSize: "40px", fill: "#ddd", fontStyle: "italic" };
  this.pause = true;
  this.startText;
  this.levelUpText;
  this.gameOverText;
};

gameScene.preload = function() {
  this.load.image("ball", "assets/images/ball.png");
  this.load.spritesheet("paddle", "assets/images/paddle_anim.png",
                        { frameWidth: 152, frameHeight: 48 });
  this.load.image("brick", "assets/images/brick.png");
  this.load.image("heart", "assets/images/heart.png");
  this.load.image("coin", "assets/images/coin.png");
};

gameScene.create = function() {
  displayVersion();

  this.cursors = this.input.keyboard.createCursorKeys();

  this.paddle = new Paddle();
  this.ball = new Ball();
  this.lives = new Lives();

  this.createAnimations();

  this.createBricksWall();

  this.dynamicBricks = this.physics.add.group();

  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  this.scoreText = this.add.text(40, config.height - 30, "000000", this.digitFont);

  this.physics.pause();
  this.startText = this.add.text(96, 340, "Press space and\nfeel the gravity…", this.rulesFont);
  this.gameOverText = this.add.text(200, 340, "", this.rulesFont);
  this.levelUpText = this.add.text(50, 340, "", this.rulesFont);

  this.add.image(config.width - 64, config.height - 18, "heart").setScale(0.6);
  this.add.image(24, config.height - 18, "coin").setScale(0.7);

  // Without a delay, gSounds is not yet created. Anyway the delay is
  // useful to blend the «game over» sound and this one.
  this.time.delayedCall(1500, () => { gSounds.newGame.play(); }, [], this);

  this.events.on("gameover", this.gameOver, this);
  this.events.on("ballreset", () => { this.ball.reset(); }, this);
};

gameScene.update = function() {
  this.physics.add.collider(this.ball, this.paddle, () => {
    this.ballHitPaddle.call(this);
  });

  this.physics.add.collider(this.ball, this.staticBricks, (_, brick) => {
    this.ballHitBrick(brick);
  });

  this.physics.add.collider(this.paddle, this.dynamicBricks, (_, brick) => {
    this.brickHitPaddle(brick);
  });

  if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.paddle.canShot) {
    if (this.pause) {
      this.startText.setText("");
      this.physics.resume();
      this.pause = false;
    }
    this.paddle.shoot();
  }

  if (this.ball.isLeavingScreen()) {
    this.events.emit("ballleavesscreen");
  }
};

gameScene.ballHitBrick = function(brick) {
  gSounds.ballHitBrick.play();
  this.dynamicBricks.create(brick.x, brick.y, "brick").setGravityY(50);
  brick.destroy();
  this.score += 10;
  this.scoreText.setText(this.score.toString().padLeft("000000"));

  if (this.staticBricks.countActive(true) === 0) {
    this.levelUp();
  }
};

gameScene.brickHitPaddle = function(brick) {
  gSounds.brickHitPaddle.play(0.2);
  this.events.emit("brickhitpaddle");
  this.cameras.main.flash(500);
  brick.destroy();
};

gameScene.ballHitPaddle = function() {
  if (this.paddle.isShooting) {
    gSounds.bounce.play(0.5);
    this.events.emit("ballhitpaddle", this.ball.x, this.paddle.x, this.paddle.shotStrength);
  }
};

gameScene.gameOver = function() {
  gSounds.gameOver.play();
  this.gameOverText.setText("Game Over");
  this.physics.pause();
  this.cameras.main.fade(2500);
  this.time.delayedCall(3000, () => {
    this.cameras.main.resetFX();
    this.scene.start("Game");
  });
};

gameScene.createBricksWall = function() {
  this.staticBricks = this.physics.add.staticGroup({
    key: "brick",
    frameQuantity: 28
  });

  Phaser.Actions.GridAlign(this.staticBricks.getChildren(), {
    width: 7,
    height: 4,
    cellWidth: 80,
    cellHeight: 48,
    x: 68,
    y: 52
  });

  Phaser.Actions.Call(this.staticBricks.getChildren(), function(brick) {
    brick.refreshBody();
  }, this);
};

gameScene.levelUp = function() {
  gSounds.levelUp.play(0.5);
  this.createBricksWall();
  this.paddle.reset();
  this.ball.reset();
  this.levelUpText.setText("Level up, press start");
  this.pause = true;
  this.physics.pause();
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

function displayVersion() {
  document.querySelector(".game-version").innerHTML = "v" + game.config.gameVersion;
}
