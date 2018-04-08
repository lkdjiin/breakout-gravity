class StarryBackground extends Phaser.Physics.Arcade.Group {

  constructor() {
    super(config.scene.physics.world, config.scene, [], {
      key: "star",
      frameQuantity: 11
    });

    Phaser.Actions.Call(this.getChildren(), function(star) {
      star.x = parseInt(Math.random() * config.width);
      star.y = parseInt(Math.random() * config.height);
      star.body.allowGravity = false;
      star.alpha = Math.random();
      star.setVelocityY(Math.random() * 10 + 2);
      star.setScale(Math.random());
    }, this);

    this.scene.events.on('update', this.update, this);
  }

  update() {
    Phaser.Actions.Call(this.getChildren(), function(star) {
      if (star.y > config.height) {
        star.x = parseInt(Math.random() * config.width);
        star.y = -5;
        star.alpha = Math.random();
        star.setVelocityY(Math.random() * 10 + 2);
        star.setScale(Math.random());
      }
    }, this);
  }
}
