class MatchScene extends Phaser.Scene {
  constructor() {
    super({ key: "MatchScene" });
  }

  create() {
    this.matches = 0;
    const starterText = this.add.text(this.sys.game.config.width/2, 24, "Drag the cards to match them!", {
      font: "24px Arial",
      color: "#5a4a3a",
      align: "center"
    }).setOrigin(0.5, 0);
    this.starterText = starterText;

    // Card data for Halt, Walk, Trot, Canter
    const cards = [
      {
        left: "Halt",
        right: "Stillness, readiness, quiet confidence",
        matched: `• Soft connection to the rider\n• Calmness without anticipation\n• Square, soft halts\n• Halt as communication, not correction\n• Waiting for the next cue`
      },
      {
        left: "Walk",
        right: "Foundation, clarity, beginning of communication",
        matched: `• Natural rhythm and tempo\n• Willingness to stretch into contact\n• Balance on straight lines and corners\n• Emotional steadiness in the ring\n• Clear four-beat rhythm\n• Soft bend on circles`
      },
      {
        left: "Trot",
        right: "Expression, organization, early brilliance",
        matched: `• Balance while moving forward\n• Consistent tempo in a new environment\n• Responsiveness to subtle aids• Steady, metronome-like trot\n• Circles for suppleness and balance`
      },
      {
        left: "Canter",
        right: "Future potential, power waiting to unfold",
        matched: `• Natural balance and coordination\n• Ability to stay organized\n• Emotional readiness for next steps\n• Rhythm over shape\n• Encouraging relaxation and confidence`
      }
    ];

    // Shuffle cards
    const shuffled = Phaser.Utils.Array ? Phaser.Utils.Array.Shuffle([...cards]) : cards.sort(() => Math.random() - 0.5);
    const leftX = this.sys.game.config.width * 0.10;
    const rightX = this.sys.game.config.width * 0.60;
    const cardW = 120, cardH = 80;
    const rightW = 240;
    const minRightH = 90;
    const spacing = 20;
    const leftContainers = [];
    const rightContainers = [];
    const minLeftH = 60;
    let leftY = this.sys.game.config.height * 0.18;
    shuffled.forEach((item, i) => {
      const tempText = this.add.text(0, 0, item.left, { font: "16px Arial", color: "#5a4a3a" }).setOrigin(0.5);
      const textHeight = tempText.height;
      const leftH = Math.max(minLeftH, textHeight + 24);
      tempText.destroy();
      const card = this.add.rectangle(0, 0, cardW, leftH, 0xfff6e5, 1).setStrokeStyle(2, 0x5a4a3a);
      const text = this.add.text(0, 0, item.left, { font: "16px Arial", color: "#5a4a3a" }).setOrigin(0.5);
      const container = this.add.container(leftX, leftY, [card, text]);
      container.setSize(cardW, leftH);
      container.setInteractive({ draggable: true });
      this.input.setDraggable(container);
      container.matchKey = item.right;
      container.matchedText = item.matched;
      leftContainers.push(container);
      leftY += leftH + spacing;
    });
    // Right cards (shuffled)
    const shuffledRight = Phaser.Utils.Array ? Phaser.Utils.Array.Shuffle([...cards]) : cards.sort(() => Math.random() - 0.5);
    let rightY = this.sys.game.config.height * 0.18;
    shuffledRight.forEach((item, i) => {
      const tempText = this.add.text(0, 0, item.right, { font: "12px Arial", color: "#5a4a3a", wordWrap: { width: rightW - 24 } }).setOrigin(0.5);
      const textHeight = tempText.height;
      const rightH = Math.max(minRightH, textHeight + 32);
      tempText.destroy();
      const card = this.add.rectangle(0, 0, rightW, rightH, 0xfff6e5, 1).setStrokeStyle(2, 0x5a4a3a);
      const text = this.add.text(0, 0, item.right, { font: "12px Arial", color: "#5a4a3a", wordWrap: { width: rightW - 24 } }).setOrigin(0.5);
      const container = this.add.container(rightX, rightY, [card, text]);
      container.setSize(rightW, rightH);
      container.setInteractive({ dropZone: true });
      container.matchKey = item.right;
      container.matchedText = item.matched;
      rightContainers.push(container);
      rightY += rightH + spacing;
    });
    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setAlpha(0.7);
    });
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.setAlpha(1);
    });
    this.input.on("drop", (pointer, gameObject, dropTarget) => {
      if (gameObject.matchKey && dropTarget.matchKey && gameObject.matchKey === dropTarget.matchKey) {
        dropTarget.list[0].setFillStyle(0xd0e6c3, 1);
        dropTarget.list[1].setText(gameObject.matchedText);
        gameObject.disableInteractive();
        this.matches++;
        if (this.matches === cards.length) {
          if (this.starterText) this.starterText.destroy();
          const congratsText = this.add.text(this.sys.game.config.width/2, 30, "All Matches Complete.  Congratulations!", {
            font: "20px Arial",
            color: "#5a4a3a",
            fontStyle: "bold",
            align: "center"
          }).setOrigin(0.5, 0);
        }
      }
    });
    this.input.topOnly = false;
  }
}

window.MatchScene = MatchScene;
