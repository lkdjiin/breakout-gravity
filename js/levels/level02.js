class Level02 extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "level02");
    this.title = "Earthlight";
    this.background = "bg02";
    this.gravity = 35; 
    this.bonuses = [
      { type: "points", value: 50, ratio: 0.03 },
      { type: "points", value: 100, ratio: 0.02 },
      { type: "lives", value: 1, ratio: 0.15 }
    ];
    this.maluses = [
      { type: "lives", value: 1, ratio: 0.1 }
    ];
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
      brick.setData("type", "brick");
      brick.setData("points", 10);
      brick.setData("hardness", 1);
      brick.refreshBody();
    }, this.scene);

    let children = this.scene.staticBricks.getChildren();
    // Remove some bricks for a nice disposition.
    for (let index of [8, 9, 10, 12, 13, 14]) {
      children[index].destroy();
    }
    // Bottom row is harder.
    for (let index of [15, 16, 17, 18, 19, 20, 21]) {
      children[index].setData("type", "brick2");
      children[index].setData("hardness", 4);
      children[index].setData("points", 50);
      children[index].setTexture("brick2");
      children[index].refreshBody();
    }
  }
}
