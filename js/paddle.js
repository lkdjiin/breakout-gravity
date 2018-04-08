class Paddle extends Phaser.Physics.Arcade.Sprite {
  constructor() {
    super(config.scene, config.width / 2, config.height - 64, "paddle");

    this.speed = 1000;
    this.shotLimit = config.height - 100;
    this.isShooting = false;
    this.damageLevel = 0;

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
    if (this.scene.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.scene.cursors.right.isDown) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    if (this.isAboveShotLimit) {
      this.setVelocityY(50);
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
}
