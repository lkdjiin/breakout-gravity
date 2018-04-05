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
  version: "0.1.0 «Starter»"
};

let game = new Phaser.Game(config);

gameScene.init = function() {
  this.inPaddleShot = false;
  this.score = 0;
  this.scoreText;
  this.lives = 7;
  this.livesText;
  this.digitFont = { fontFamily: "Courier", fontSize: "28px", fill: "#ddd" };
  this.rulesFont = { fontFamily: "Courier", fontSize: "40px", fill: "#ddd", fontStyle: "italic" };
  this.pause = true;
  this.startText;
  this.paddleVelocity = 1000;
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

  this.paddle = this.physics.add.sprite(config.width / 2, config.height - 64, "paddle");
  this.paddle.setSize(152, 64, false);
  this.paddle.body.setVelocity(0, 20).setBounce(0.2).setCollideWorldBounds(true);

  this.createAnimations();

  this.ball = this.physics.add.sprite(config.width / 2, 240, "ball");
  this.ball.body.setVelocity(0, 300).setBounce(0.99).setCollideWorldBounds(true);

  this.createBricksWall();

  this.dynamicBricks = this.physics.add.group();

  this.cursors = this.input.keyboard.createCursorKeys();
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  this.scoreText = this.add.text(40, config.height - 30, "000000", this.digitFont);
  this.livesText = this.add.text(config.width - 48, config.height - 30, "7", this.digitFont);

  this.physics.pause();
  this.startText = this.add.text(96, 340, "Press space and\nfeel the gravity…", this.rulesFont);
  this.gameOverText = this.add.text(200, 340, "", this.rulesFont);

  this.add.image(config.width - 64, config.height - 18, "heart").setScale(0.6);
  this.add.image(24, config.height - 18, "coin").setScale(0.7);
};

gameScene.update = function() {
  this.physics.add.collider(this.ball, this.paddle, () => {
    if (this.inPaddleShot) {
      this.inPaddleShot = false;
      this.ball.body.setVelocity(-3 * (this.paddle.x - this.ball.x), this.getShotStrength(this.paddle.y));
    }
  });

  this.physics.add.collider(this.ball, this.staticBricks, (ball, brick) => {
    let x = brick.x;
    let y = brick.y;

    brick.destroy();
    this.dynamicBricks.create(x, y, "brick").setGravityY(50);
    this.score += 10;
    this.scoreText.setText(this.score.toString().padLeft("000000"));

    if (this.staticBricks.countActive(true) === 0) {
      this.levelUp();
    }
  });

  this.physics.add.collider(this.paddle, this.dynamicBricks, () => {
    this.dynamicBricks.getChildren().forEach((brick) => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.paddle.getBounds(), brick.getBounds())) {
        this.cameras.main.flash(500);
        brick.destroy();
        this.paddle.anims.play("hitByBrick", true);
      }
    });
  });

  if (this.cursors.left.isDown) {
    this.paddle.setVelocityX(-this.paddleVelocity);
  } else if (this.cursors.right.isDown) {
    this.paddle.setVelocityX(this.paddleVelocity);
  } else {
    this.paddle.setVelocityX(0);
  }

  if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.paddle.y > config.height - 100) {
    if (this.pause) {
      this.startText.setText("");
      this.physics.resume();
      this.pause = false;
    }
    this.paddle.setVelocityY(-500);
    this.inPaddleShot = true;
    this.time.delayedCall(200, () => { this.inPaddleShot = false; }, [], this);
    this.paddle.anims.play("shot", true);
  }
  if (this.paddle.y < config.height - 100) {
    this.paddle.setVelocityY(50);
  }

  this.updatelives();
};

gameScene.updatelives = function() {
  let ballReset = () => {
    this.ball.x = config.width / 2;
    this.ball.y = 208;
    this.ball.body.setVelocity(0, 100);
  };

  let isBallLeaveScreen = () => { return this.ball.y > 580 };

  let decrementLives = () => {
    this.cameras.main.flash(500);
    this.lives--;
    this.livesText.setText(this.lives);
  };

  if (isBallLeaveScreen()) {
    decrementLives();
    if (this.lives === 0) {
      this.gameOver();
    }
    ballReset();
  }
};

gameScene.gameOver = function() {
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
  this.createBricksWall();
  this.paddle.x = config.width / 2;
  this.paddle.y = config.height - 64;
  this.paddle.body.setVelocity(0, 20);
  this.ball.x = config.width / 2;
  this.ball.y = 240;
  this.ball.body.setVelocity(0, 300);
  this.startText.setText("Level up, press start");
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

gameScene.getShotStrength = function(paddleY) {
  // Paddle Y coordinate can be between 576 and 518 (that is a range of 58).
  // At Y=576 we want the weaker shot strength (ball will get Y velocity = -450).
  // At Y=518 we want the stronger shot strength (ball will get Y velocity = -650).

  let delta = 576 - paddleY;
  let ratio = delta / 58.0;
  return -(ratio * 200 + 450);
};

function displayVersion() {
  document.querySelector(".game-version").innerHTML = "v" + game.config.gameVersion;
}
