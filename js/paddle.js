class Paddle extends Phaser.Physics.Arcade.Sprite {
  constructor() {
    super(config.scene[0], config.width / 2, config.height - 64, "paddle");

    this.PADDLE = Object.freeze({
      normalSize: "normalSize",
      smallSize: "smallSize",
      slippyValue: 0.6,
      speed: 1000
    });

    this.speed = this.PADDLE.speed;
    this.shotLimit = config.height - 100;
    this.isShooting = false;
    this.damageLevel = 0;
    this.key = this.scene.cursors;
    this.state = { size: this.PADDLE.normalSize };
    this.sizeChangedTime = Date.now();
    this.slippyValue = this.PADDLE.slippyValue;
    this.indestructible = false;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.setSize(152, 64, false);
    this.body.setVelocity(0, 20);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);

    this.scene.events.on('update', this.update, this);
    this.scene.events.on("ballhitpaddle", this.ballHitPaddleEvent, this);
    this.scene.events.on("brickhitpaddle", this.brickHitPaddleEvent, this);
  }

  update() {
    this.updateVelocity();
    this.updateSize();
  }

  updateVelocity() {
    if (this.key.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.key.right.isDown) {
      this.setVelocityX(this.speed);
    } else {
      this.body.velocity.x *= this.slippyValue;
      if (this.body.velocity.x < 10 && this.body.velocity.x > -10) {
        this.setVelocityX(0);
      }
    }

    if (this.isAboveShotLimit) {
      this.setVelocityY(50);
    }
  }

  updateSize() {
    if (this.key.down.isDown && Date.now() > this.sizeChangedTime + 500) {
      this.sizeChangedTime = Date.now();
      if (this.state.size == this.PADDLE.normalSize) {
        this.state.size = this.PADDLE.smallSize;
        this.setScale(0.5, 1);
      } else if (this.state.size == this.PADDLE.smallSize) {
        this.state.size = this.PADDLE.normalSize;
        this.setScale(1);
      }
    }
  }

  get canShot() {
    return this.y > this.shotLimit;
  }

  get isAboveShotLimit() {
    return this.y < this.shotLimit;
  }

  shoot() {
    this.setVelocityY(-500);
    this.isShooting = true;
    this.scene.time.delayedCall(200, () => { this.isShooting = false; }, [], this);
    this.anims.play("shot", true);
  }

  reset() {
    this.x = config.width / 2;
    this.y = config.height - 64;
    this.body.setVelocity(0, 20);
  }

  ballHitPaddleEvent() {
    this.isShooting = false;
  }

  brickHitPaddleEvent() {
    this.anims.play("hitByBrick", true);

    if (this.indestructible) {
      return;
    }

    this.damageLevel++;
    if (this.damageLevel === 4) {
      this.scene.events.emit("brokenpaddle");
      this.damageLevel = 0;
    }
    switch (this.damageLevel) {
      case 0:
        this.clearTint();
        break;
      case 1:
        this.setTint(0xffaaaa);
        break;
      case 2:
        this.setTint(0xff6666);
        break;
      case 3:
        this.setTint(0xff0000);
        break;
    }
  }

  get shotStrength() {
    // Paddle Y coordinate can be between 576 and 518 (that is a range of 58).
    // At Y=576 we want the weaker shot strength (ball will get Y velocity = -450).
    // At Y=518 we want the stronger shot strength (ball will get Y velocity = -650).

    let delta = 576 - this.y;
    let ratio = delta / 58.0;
    return -(ratio * 200 + 450);
  }

  changeSlippyValue(value, timeToLive) {
    this.slippyValue = value;
    this.scene.time.delayedCall(timeToLive * 1000, () => {
      this.slippyValue = this.PADDLE.slippyValue;
    });
  }

  changeSpeed(multiplier, timeToLive) {
    this.speed *= multiplier;
    this.scene.time.delayedCall(timeToLive * 1000, () => {
      this.speed = this.PADDLE.speed;
    });
  }

  setIndestructible(timeToLive) {
    this.indestructible = true;
    this.scene.time.delayedCall(timeToLive * 1000, () => {
      this.indestructible = false;
    });
  }

  changeSize(timeToLive) {
    this.setScale(0.6, 1);
    this.scene.time.delayedCall(timeToLive * 1000, () => {
      this.setScale(1);
    });
  }
}
