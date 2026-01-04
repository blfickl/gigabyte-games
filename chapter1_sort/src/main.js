import Sort from './scenes/Sort.js';

const config = {
    type: Phaser.AUTO,
    width: Math.min(window.innerWidth, 400),
    height: window.innerHeight,
    backgroundColor: '#f8f8f8',
    scene: [Sort]
};

const game = new Phaser.Game(config);
