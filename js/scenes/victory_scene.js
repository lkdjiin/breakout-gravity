let victoryScene = new Phaser.Scene("Victory");

victoryScene.init = function() {
};

victoryScene.create = function() {
  let text = (size, color) => {
    this.add.text(
      config.width / 2,
      config.height / 2,
      "YOU\n\nWIN",
      { fontFamily: "Courier", fontSize: size, fill: color, align: "center" }
    ).setOrigin(0.5, 0.5);
  };

  text("18px", "#777");
  text("24px", "#888");
  text("30px", "#777");
  text("36px", "#999");
  text("42px", "#777");
  text("48px", "#aaa");
  text("54px", "#777");
  text("60px", "#bbb");
  text("66px", "#777");
  text("72px", "#ccc");
  text("78px", "#777");
  text("84px", "#ddd");
  text("90px", "#777");
  text("96px", "#eee");
};
