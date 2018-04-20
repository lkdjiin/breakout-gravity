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
        // FIXME Stop doing this shit and use only one data:
        // the stringified json.
        brick.setData("bonus", true);
        brick.setData("bonusType", bonuses[i].type);
        brick.setData("bonusValue", bonuses[i].value);
        if (bonuses[i].ttl) {
          brick.setData("bonusTTL", bonuses[i].ttl);
        }
        return;
      } else {
        threshold += bonuses[i].ratio;
      }
    }

    let maluses = this.scene.levelManager.level.maluses;

    for (let i = 0; i < maluses.length; i++) {
      if (rnd < threshold + maluses[i].ratio) {
        brick.setTint(0xff0000);
        brick.setData("malus", true);
        brick.setData("malusType", maluses[i].type);
        brick.setData("malusValue", maluses[i].value);
        if (maluses[i].ttl) {
          brick.setData("malusTTL", maluses[i].ttl);
        }
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
    if (item.getData("bonusType") == "points") {
      // FIXME score should be an object on its own, like Lives or Paddle.
      this.scene.score += item.getData("bonusValue");
      this.scene.updateScore();  
    } else if (item.getData("bonusType") == "lives") {
      this.scene.lives.add(item.getData("bonusValue"));
    }
  }

  _malus(item) {
    if (item.getData("malusType") == "lives") {
      // FIXME One should be able to lost several lives.
      this.scene.lives.lost();
    } else if (item.getData("malusType") == "slippy") {
      this.scene.paddle.changeSlippyValue(item.getData("malusValue"), item.getData("malusTTL"));
    }
  }
}
