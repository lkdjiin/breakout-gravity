class Level0102 extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "level0102");
    this.title = "Earth & Space";
    this.background = "bg02";
    this.gravity = 200;
    this.bonusTime = 100;
    this.bonuses = [
      { type: "points", value: 25, ratio: 0.05 },
      { type: "points", value: 50, ratio: 0.02 },
      { type: "points", value: 75, ratio: 0.02 },
      { type: "points", value: 100, ratio: 0.01 },
      { type: "lives", value: 1, ratio: 0.05 },
      { type: "indestructible", ratio: 0.05, ttl: 15 },
    ];
    this.maluses = [
      { type: "lives", value: 1, ratio: 0.02 },
      { type: "slow", value: 0.25, ratio: 0.05, ttl: 10 },
      { type: "slippy", value: 0.9, ratio: 0.05, ttl: 10 },
      { type: "fastBall", value: 1.7, ratio: 0.15, ttl: 10 },
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
      brick.refreshBody();
      brick.setData("type", "brick");
      brick.setData("points", 10);
      brick.setData("hardness", 1);
    }, this.scene);

    let children = this.scene.staticBricks.getChildren();

    for (let index of [7, 8, 9, 11, 12, 13, 14, 16, 18, 20, 21, 22, 23, 25, 26, 27]) {
      children[index].setData("hardness", 2);
      children[index].setData("points", 25);
      children[index].setTexture("brick2");
      children[index].setData("type", "brick2");
    }

    for (let index of [15, 19]) {
      children[index].setData("hardness", 4);
      children[index].setData("points", 500);
      children[index].setTexture("brick4");
      children[index].setData("type", "brick4");
    }
  }
}
