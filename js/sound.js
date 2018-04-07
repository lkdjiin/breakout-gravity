var gSounds = {};
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

function Sound(audioContext, buffer) {
  this.ctx = audioContext;
  this.buffer = buffer;
  this.play = function(gain = 1) {
    let source = this.ctx.createBufferSource();
    let gainNode = this.ctx.createGain();
    source.buffer = this.buffer;
    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    gainNode.gain.value = gain;
    source.start(0);
  };
}

var bufferLoader = new BufferLoader(
    audioContext,
    [
      "assets/sounds/new_game.wav",
      "assets/sounds/applause.wav",
      "assets/sounds/game_over.wav",
      "assets/sounds/lost_live.wav",
      "assets/sounds/error04.wav",
      "assets/sounds/blip04.wav",
      "assets/sounds/blip02.wav"
    ],
    finished
    );

function finished(list) {
  gSounds.newGame = new Sound(audioContext, list[0]);
  gSounds.levelUp = new Sound(audioContext, list[1]);
  gSounds.gameOver = new Sound(audioContext, list[2]);
  gSounds.lostLive = new Sound(audioContext, list[3]);
  gSounds.brickHitPaddle = new Sound(audioContext, list[4]);
  gSounds.ballHitBrick = new Sound(audioContext, list[5]);
  gSounds.bounce = new Sound(audioContext, list[6]);
}

bufferLoader.load();
