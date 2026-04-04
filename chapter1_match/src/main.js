

console.log('window.MatchScene:', window.MatchScene);


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
    backgroundColor: "#e6d3b3",
 // backgroundColor: "#da7f91",
  parent: 'game-container',
  scene: [window.MatchScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
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
