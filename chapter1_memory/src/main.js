import Memory from './scenes/Memory.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#f8f8f8',
    scene: [Memory]
};

const game = new Phaser.Game(config);
