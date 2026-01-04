import Sort from './scenes/Sort.js';

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: '#f8f8f8',
    scene: [Sort]
};

const game = new Phaser.Game(config);
