

console.log('window.MatchScene:', window.MatchScene);


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#f0f8ff",
  parent: 'game-container',
  scene: [window.MatchScene]
};

let game;
window.onload = function () {
  game = new Phaser.Game(config);
};

window.addEventListener('resize', () => {
  if (game && game.scale) {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
});
