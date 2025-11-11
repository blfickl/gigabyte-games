export class Start extends Phaser.Scene {
  constructor() {
    super({ key: 'Start' });
  }

  preload() {
    this.load.image('item', 'assets/spaceship.png');
    this.load.image('target', 'assets/target.png');
  }

  create() {
    const item = this.add.image(100, 100, 'item').setInteractive();
    this.input.setDraggable(item);

    const target = this.add.image(400, 600, 'target');

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject) => {
      const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, target.x, target.y);
      if (distance < 50) {
        gameObject.x = target.x;
        gameObject.y = target.y;
        console.log('Matched!');
      } else {
        gameObject.x = 100;
        gameObject.y = 100;
        console.log('Try again');
      }
    });
  }
}