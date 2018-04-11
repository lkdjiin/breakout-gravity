class StarryBackground extends Phaser.Physics.Arcade.Group {

  constructor() {
    super(config.scene[0].physics.world, config.scene[0], [], {
      key: "star",
      frameQuantity: 11
    });

    Phaser.Actions.Call(this.getChildren(), function(star) {
      star.x = parseInt(Math.random() * config.width);
      star.y = parseInt(Math.random() * config.height);
      star.body.allowGravity = false;
      star.alpha = Math.random();
      star.setVelocityY(this.velocity);
      star.setScale(this.scale);
    }, this);

    this.scene.events.on('update', this.update, this);
  }

  update() {
    Phaser.Actions.Call(this.getChildren(), function(star) {
      if (star.y > config.height) {
        star.x = parseInt(Math.random() * config.width);
        star.y = -5;
        star.alpha = Math.random();
        star.setVelocityY(this.velocity);
        star.setScale(this.scale);
      }
    }, this);
  }

  get scale() {
    return Math.random() * 0.5;
  }

  get velocity() {
    return Math.random() * 12;
  }
}
