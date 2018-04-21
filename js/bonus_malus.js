class BonusMalus extends Phaser.GameObjects.GameObject {

  // pool - A Phaser.Physics.Arcade.Group
  constructor(pool) {
    super(config.scene[0], "bonusMalus");
    this.pool = pool;

    this.scene.events.on("bonusmalushit", this.bonusMalus, this);
  }

  createFrom(staticBrick) {
    let brick = this.pool
      .create(staticBrick.x, staticBrick.y, staticBrick.getData("type"))
      .setGravityY(50);

    let rnd = Math.random();

    brick.setData("bonus", false);
    brick.setData("malus", false);

    let threshold = 0.0;

    let bonuses = this.scene.levelManager.level.bonuses;

    for (let i = 0; i < bonuses.length; i++) {
      if (rnd < threshold + bonuses[i].ratio) {
        brick.setData("bonus", JSON.stringify(bonuses[i]));
        brick.setTexture("bonus");
        return;
      } else {
        threshold += bonuses[i].ratio;
      }
    }

    let maluses = this.scene.levelManager.level.maluses;

    for (let i = 0; i < maluses.length; i++) {
      if (rnd < threshold + maluses[i].ratio) {
        brick.setData("malus", JSON.stringify(maluses[i]));
        brick.setTexture("malus");
        return;
      } else {
        threshold += maluses[i].ratio;
      }
    }
  }

  bonusMalus(item) {
    if (item.getData("bonus")) {
      this._bonus(item);
    } else {
      this._malus(item);
    }
  }

  _bonus(item) {
    let fields = JSON.parse(item.getData("bonus"));

    switch (fields.type) {
      case "points":
        // FIXME score should be an object on its own, like Lives or Paddle.
        this.scene.score += fields.value;
        this.scene.updateScore();
        break;
      case "lives":
        this.scene.lives.add(fields.value);
        break;
      case "indestructible":
        this.scene.paddle.setIndestructible(fields.ttl);
        break;
    }
  }

  _malus(item) {
    let fields = JSON.parse(item.getData("malus"));

    switch (fields.type) {
      case "lives":
        // FIXME One should be able to lost several lives.
        this.scene.lives.lost();
        break;
      case "slippy":
        this.scene.paddle.changeSlippyValue(fields.value, fields.ttl);
        break;
      case "slow":
        this.scene.paddle.changeSpeed(fields.value, fields.ttl);
        break;
    }
  }
}
