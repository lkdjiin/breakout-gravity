class Level01 extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "level01");
    this.title = "Moonlight";
    this.background = "bg01";
    this.gravity = 200;
  }

  createBricksWall() {
    this.scene.staticBricks = this.scene.physics.add.staticGroup({
      key: "brick",
      frameQuantity: 28
    });

    Phaser.Actions.GridAlign(this.scene.staticBricks.getChildren(), {
      width: 7,
      height: 4,
      cellWidth: 80,
      cellHeight: 48,
      x: 68,
      y: 52
    });

    Phaser.Actions.Call(this.scene.staticBricks.getChildren(), function(brick) {
      brick.refreshBody();
      brick.setData("type", "brick");
      brick.setData("points", 10);
      brick.setData("hardness", 1);
    }, this.scene);
  }

}
