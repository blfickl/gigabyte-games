// Phaser game config and boot for spelling game
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#f0f8ff',
    scene: [Spelling]
};

window.addEventListener('load', () => {
    new Phaser.Game(config);
});
