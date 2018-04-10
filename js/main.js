let config = {
  type: Phaser.AUTO,
  width: 600,
  height: 620,
  parent: "js-game",
  backgroundColor: "#444444",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: gameScene,
  title: "Breakout {Gravity}",
  version: "0.2.0 «Spring»"
};

let game = new Phaser.Game(config);

function displayVersion() {
  document.querySelector(".game-version").innerHTML = "v" + game.config.gameVersion;
}
