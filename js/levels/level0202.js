class Level0202 extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "level0202");
    this.title = "From Apollo 8";
    this.background = "bg05";
    this.gravity = 50;
    this.bonusTime = 150;
    this.bonusPoints = 200;
    this.bonuses = [
      { type: "points", value: 50, ratio: 0.02 },
      { type: "points", value: 75, ratio: 0.05 },
      { type: "points", value: 100, ratio: 0.02 },
      { type: "points", value: 250, ratio: 0.01 },
      { type: "lives", value: 1, ratio: 0.1 },
      { type: "indestructible", ratio: 0.05, ttl: 15 },
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
      key: "brick",
      frameQuantity: 42
    });

    Phaser.Actions.GridAlign(this.scene.staticBricks.getChildren(), {
      width: 7,
      height: 6,
      cellWidth: 80,
      cellHeight: 48,
      x: 68,
      y: 52
    });

    Phaser.Actions.Call(this.scene.staticBricks.getChildren(), function(brick) {
      brick.refreshBody();
      brick.setData("type", "brick");
      brick.setData("points", 25);
      brick.setData("hardness", 1);
    }, this.scene);

    let children = this.scene.staticBricks.getChildren();

    for (let index of [31, 37]) {
      children[index].destroy();
    }

    for (let index of [24, 28, 29, 30, 31, 32, 33]) {
      children[index].setData("hardness", 4);
      children[index].setData("points", 100);
      children[index].setTexture("brick3");
      children[index].setData("type", "brick3");
    }
  }
}


