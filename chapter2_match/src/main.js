// Use global Phaser and Match
// Define Match scene here or ensure it's loaded before this script
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1000,
    scene: [window.Match],
    parent: 'game-container',
    backgroundColor: '#ffffff'
};

const game = new Phaser.Game(config);
