class Level0101 extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "level0101");
    this.title = "On Earth";
    this.background = "bg01";
    this.gravity = 200;
    this.bonusTime = 120;
    this.bonusPoints = 100;
    this.bonuses = [
      { type: "points", value: 25, ratio: 0.1 },
      { type: "points", value: 50, ratio: 0.04 },
      { type: "points", value: 75, ratio: 0.03 },
      { type: "points", value: 100, ratio: 0.02 },
      { type: "lives", value: 1, ratio: 0.02 },
      { type: "indestructible", ratio: 0.04, ttl: 15 },
      { type: "ball", ratio: 0.1 },
    ];
    this.maluses = [
      { type: "lives", value: 1, ratio: 0.07 },
      { type: "slow", value: 0.25, ratio: 0.07, ttl: 10 },
      { type: "slippy", value: 0.9, ratio: 0.07, ttl: 10 },
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

    for (let index of [9, 10, 11, 16, 18, 23, 24, 25]) {
      children[index].setData("hardness", 2);
      children[index].setData("points", 25);
      children[index].setTexture("brick2");
      children[index].setData("type", "brick2");
    }

    children[17].setData("hardness", 4);
    children[17].setData("points", 500);
    children[17].setTexture("brick4");
    children[17].setData("type", "brick4");
  }
}
