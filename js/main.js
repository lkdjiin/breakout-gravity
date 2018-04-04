let gameScene = new Phaser.Scene("Game");

let config = {
  type: Phaser.AUTO,
  width: 464,
  height: 504,
  backgroundColor: "#444444",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: gameScene
};

let game = new Phaser.Game(config);

gameScene.init = function() {
  this.inPaddleShot = false;
  this.score = 0;
  this.scoreText;
};

gameScene.preload = function() {
  this.load.image("ball", "assets/images/ball.png");
  this.load.image("paddle", "assets/images/paddle.png");
  this.load.image("brick", "assets/images/brick.png");
};

gameScene.create = function() {
  this.paddle = this.physics.add.sprite(config.width / 2, config.height - 64, "paddle")
  this.paddle.setSize(152, 64, false);
  this.paddle.body.setVelocity(0, 20).setBounce(0.2).setCollideWorldBounds(true);

  this.ball = this.physics.add.sprite(config.width / 2, 208, "ball");
  this.ball.body.setVelocity(0, 300).setBounce(0.99).setCollideWorldBounds(true);

  this.staticBricks = this.physics.add.staticGroup({
    key: "brick",
    frameQuantity: 15
  });

  Phaser.Actions.GridAlign(this.staticBricks.getChildren(), {
    width: 5,
    height: 3,
    cellWidth: 88,
    cellHeight: 56,
    x: 68,
    y: 52
  });

  Phaser.Actions.Call(this.staticBricks.getChildren(), function(brick) {
    brick.refreshBody();
  }, this);

  this.dynamicBricks = this.physics.add.group();

  this.cursors = this.input.keyboard.createCursorKeys();
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  this.scoreText = this.add.text(16, config.height - 28, "000000", { fontFamily: "Courier", fontSize: "24px", fill: "#ddd" });
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
    this.dynamicBricks.create(x, y, "brick");
    this.score += 11;
    this.scoreText.setText(this.score.toString().padLeft("000000"));

    if (this.staticBricks.countActive(true) === 0) {
      location.reload();
    }
  });

  this.physics.add.collider(this.paddle, this.dynamicBricks, () => {
    // I don't know exactly what will happen if there is more than one
    // dynamic brick touching the paddle.
    this.dynamicBricks.getChildren().forEach((brick) => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.paddle.getBounds(), brick.getBounds())) {
        this.cameras.main.flash(500);
        brick.destroy();
      }
    });
  });

  if (this.cursors.left.isDown) {
    this.paddle.setVelocityX(-250);
  } else if (this.cursors.right.isDown) {
    this.paddle.setVelocityX(250);
  } else {
    this.paddle.setVelocityX(0);
  }

  if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.paddle.y > config.height - 100) {
    this.paddle.setVelocityY(-500);
    this.inPaddleShot = true;
    this.time.delayedCall(200, () => { this.inPaddleShot = false; }, [], this);
  }
  if (this.paddle.y < config.height - 100) {
    this.paddle.setVelocityY(50);
  }

  if (this.ball.y > 480) {
    this.cameras.main.flash(500);
    // Ball reset.
    this.ball.x = config.width / 2;
    this.ball.y = 208;
    this.ball.body.setVelocity(0, 100);
  }

};

gameScene.getShotStrength = function(paddleY) {
  // Paddle Y coordinate can be between 456 and 398 (that is a range of 58).
  // At Y=456 we want the weaker shot strength (ball will get Y velocity = -250).
  // At Y=398 we want the stronger shot strength (ball will get Y velocity = -600).

  let delta = 456 - paddleY;
  let ratio = delta / 58.0;
  return -(ratio * 350 + 250);
};
