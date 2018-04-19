# Level Documentation

I think I should document a bit how to create a level, because it's a little
mess.

## Constructor

    constructor() {
      super(config.scene[0], "level01");
      this.title = "Moonlight";
      this.background = "bg01";
      this.gravity = 200;
    }

`title`, `background` and `gravity` are mandatory.

### background

This is the *Phaser key* of a background image, preloaded in the game scene.

    gameScene.preload = function() {
      // ...
      this.load.image("bg01", "assets/images/bg-image-01.jpg");
      // ...
    };

## createBricksWall()

This function creates the wall of bricks. It must populates
`this.scene.staticBricks`, for example:

    this.scene.staticBricks = this.scene.physics.add.staticGroup({
      key: "brick",
      frameQuantity: 28
    });

Each brick must have "type", "points" and "hardness".

      brick.setData("type", "brick");
      brick.setData("points", 10);
      brick.setData("hardness", 1);

- The "type" is the *Phaser key* of an image, preloaded in the game scene.
- The "points" is the number of points to score when the brick is destroyed.
- The "hardness" is the number of time a brick have to be hit to be effectively destroyed.
