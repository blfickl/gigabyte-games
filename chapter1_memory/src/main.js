import Memory from './scenes/Memory.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: Math.min(window.innerWidth * 0.95, 400),
    height: Math.min(window.innerHeight * 0.65, 600),
    backgroundColor: '#f8f8f8',
    scene: [Memory]
};

const game = new Phaser.Game(config);
