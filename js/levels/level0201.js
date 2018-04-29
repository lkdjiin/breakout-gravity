class Level0201 extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "level0201");
    this.title = "Bloodmoon";
    this.background = "bg04";
    this.gravity = 50;
    this.bonusTime = 120;
    this.bonuses = [
      { type: "points", value: 50, ratio: 0.1 },
      { type: "points", value: 75, ratio: 0.05 },
      { type: "points", value: 100, ratio: 0.02 },
      { type: "points", value: 250, ratio: 0.01 },
      { type: "lives", value: 1, ratio: 0.02 },
      { type: "indestructible", ratio: 0.04, ttl: 15 },
      { type: "ball", ratio: 0.1 },
    ];
    this.maluses = [
      { type: "lives", value: 1, ratio: 0.05 },
      { type: "slow", value: 0.25, ratio: 0.1, ttl: 10 },
      { type: "slippy", value: 0.9, ratio: 0.05, ttl: 10 },
    ];
  }

  createBricksWall() {
    this.scene.staticBricks = this.scene.physics.add.staticGroup({
      key: "brick2",
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
      brick.setData("type", "brick2");
      brick.setData("points", 25);
      brick.setData("hardness", 2);
    }, this.scene);

    let children = this.scene.staticBricks.getChildren();

    for (let index of [0, 0, 0, 1, 1, 1, 1, 1, 4, 4, 4, 9]) {
      children[index].destroy();
    }

    for (let index of [1, 2, 3]) {
      children[index].setData("hardness", 4);
      children[index].setData("points", 50);
      children[index].setTexture("brick3");
      children[index].setData("type", "brick3");
    }

    children[0].setData("hardness", 6);
    children[0].setData("points", 1000);
    children[0].setTexture("brick4");
    children[0].setData("type", "brick4");
  }
}

