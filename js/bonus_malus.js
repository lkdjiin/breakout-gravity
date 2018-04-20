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
        brick.setTint(0x00ff00);
        brick.setData("bonus", JSON.stringify(bonuses[i]));
        return;
      } else {
        threshold += bonuses[i].ratio;
      }
    }

    let maluses = this.scene.levelManager.level.maluses;

    for (let i = 0; i < maluses.length; i++) {
      if (rnd < threshold + maluses[i].ratio) {
        brick.setTint(0xff0000);
        brick.setData("malus", JSON.stringify(maluses[i]));
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
    if (fields.type == "points") {
      // FIXME score should be an object on its own, like Lives or Paddle.
      this.scene.score += fields.value;
      this.scene.updateScore();  
    } else if (fields.type == "lives") {
      this.scene.lives.add(fields.value);
    }
  }

  _malus(item) {
    let fields = JSON.parse(item.getData("malus"));
    if (fields.type == "lives") {
      // FIXME One should be able to lost several lives.
      this.scene.lives.lost();
    } else if (fields.type == "slippy") {
      this.scene.paddle.changeSlippyValue(fields.value, fields.ttl);
    }
  }
}
