class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor() {
    super(config.scene[0], config.width / 2, 240, "ball");

    this.BALL = Object.freeze({
      speed: 1,
    });

    this.speed = this.BALL.speed;
    this.bottomLimit = config.height - 40;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setVelocity(0, 300);
    this.setBounce(0.99);
    this.setCollideWorldBounds(true);
    this.scene.events.on('update', this.update, this);
    this.scene.events.on("ballhitpaddle", this.ballHitPaddleEvent, this);
  }

  update() {
    if (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up) {
      gSounds.bounce.play(0.25);
    }
  }

  reset() {
    this.x = config.width / 2;
    this.y = 240;
    this.body.setVelocity(0, 100);
    this.speed = this.BALL.speed;
  }

  isLeavingScreen() {
    return this.y > this.bottomLimit;
  }

  ballHitPaddleEvent(ballX, paddleX, strength) {
    this.body.setVelocity(-3 * (paddleX - ballX), strength * this.speed);
  }

  changeSpeed(value, timeToLive) {
    this.speed = value;
    this.scene.time.delayedCall(timeToLive * 1000, () => {
      this.speed = this.BALL.speed;
    });
  }
}
