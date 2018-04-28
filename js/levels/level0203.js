class Level0203 extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "level0203");
    this.title = "From Apollo 15";
    this.background = "bg06";
    this.gravity = 50;
    this.bonusTime = 120;
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
      frameQuantity: 56
    });

    Phaser.Actions.GridAlign(this.scene.staticBricks.getChildren(), {
      width: 7,
      height: 8,
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

    for (let index of [31]) {
      children[index].destroy();
    }

    for (let index of [24, 30, 31]) {
      children[index].setData("hardness", 4);
      children[index].setData("points", 500);
      children[index].setTexture("brick3");
      children[index].setData("type", "brick3");
    }

    children[17].setData("hardness", 2);
    children[17].setData("points", 250);
    children[17].setTexture("brick2");
    children[17].setData("type", "brick2");
  }
}



