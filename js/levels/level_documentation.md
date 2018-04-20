# Level Documentation

I think I should document a bit how to create a level, because it's a little
mess.

## Constructor

    constructor() {
      super(config.scene[0], "level01");
      this.title = "Moonlight";
      this.background = "bg01";
      this.gravity = 200;
      this.bonuses = [ ... ];
      this.maluses = [ ... ];
    }

They are all mandatory.

### background

This is the *Phaser key* of a background image, preloaded in the game scene.

    gameScene.preload = function() {
      // ...
      this.load.image("bg01", "assets/images/bg-image-01.jpg");
      // ...
    };

### bonuses/maluses

**Sum of all bonuses/maluses ratios MUST NOT exceed 1.**

An example:

    this.bonuses = [
      { type: "points", value: 50, ratio: 0.03 },
      { type: "points", value: 100, ratio: 0.02 },
      { type: "lives", value: 1, ratio: 0.15 }
    ];
    this.maluses = [
      { type: "lives", value: 1, ratio: 0.1 }
    ];

Each bonus/malus must have a type, a value and a ratio.

If the following is a bonus: it's a bonus of type "points" (that is you earn
some points when you caught it), it has a value of 50 (so you will earn 50
points) and, with a ratio of 0.0», it has got 3 percent chance to appear when
the ball hit a brick.
      { type: "points", value: 50, ratio: 0.03 }

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
