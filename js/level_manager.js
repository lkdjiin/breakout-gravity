class LevelManager extends Phaser.GameObjects.GameObject {
  constructor(list) {
    super(config.scene[0], "levelManager");

    this.list = list;
    this.index = 0;
    // Any image will do the job here. This is only to create a reference.
    this.background = this.scene.add.image(config.width / 2, config.height / 2, "ball");
    this._load();
  }

  levelUp() {
    this.index++;
    if (this.index == this.list.length) {
      return true;
    } else {
      this._load();
      return false;
    }
  }

  _load() {
    this.level = new this.list[this.index]();
    this.background.setTexture(this.level.background);
    this.scene.physics.world.gravity.y = this.level.gravity;
    this.level.createBricksWall();
  }
} 
