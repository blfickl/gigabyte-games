const config = {
	type: Phaser.AUTO,
	width: 400,
	height: 600,
	backgroundColor: '#f8f8f8',
	parent: 'game-container',
	scene: [window.Memory]
};

const game = new Phaser.Game(config);
