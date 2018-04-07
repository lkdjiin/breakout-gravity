class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.width / 2, 240, "ball");
    this.bottomLimit = config.height - 40;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setVelocity(0, 300);
    this.setBounce(0.99);
    this.setCollideWorldBounds(true);
    this.scene.events.on('update', this.update, this);
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
  }

  isLeavingScreen() {
    return this.y > this.bottomLimit;
  }
}
