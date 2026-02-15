const config = {
	type: Phaser.AUTO,
	width: 400,
	height: 600,
	backgroundColor: '#f8f8f8',
	parent: 'game-container',
	scene: [window.Sort]
};

const game = new Phaser.Game(config);
