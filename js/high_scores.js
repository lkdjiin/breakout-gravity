class HighScores extends Phaser.GameObjects.GameObject {
  constructor() {
    super(config.scene[0], "HighScores");

    let scores = localStorage.getItem("highScores");
    if (scores === null) {
      scores = "0,0,0,0,0,0,0,0,0,0";
    }

    this.scores = scores.split(",", 10).map(x => parseInt(x));
  }

  add(candidate) {
    this.scores.push(candidate);
    this.scores.sort((a, b) => { return b - a; });
    this.scores.pop();
    localStorage.setItem("highScores", this.scores.join(","));
  }

  toString() {
    return this.scores.map((x, index) => {
      return "" + (index + 1) + ": " + x.toString().padLeft("000000");
    }).join("\n");
  }
}
