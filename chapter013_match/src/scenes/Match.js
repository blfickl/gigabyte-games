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

    // Card data for gaits and symbolism, what it reveals, and training focus
    const cards = [
      {
        left: "Halt",
        right: "Pause, reset, the start and end of every pattern.",
        matched: `•Squares up, waits, and listens for the next cue\n•Ability to shift from motion to stillness without tension\n• Early understanding that “stop” is a thinking moment, not a punishment\n• Teaching that stillness is part of the pattern`
      },
      {
        left: "Walk",
        right: "Slow motion shape, the first rhythm they can really feel.",
        matched: `• Find the line of the circle and stays on it\n• Ability to maintain a four-beat rhythm on a curve\n• Early balance: do they lean, fall in, or stay upright?\n• Large circles to introduce bend through the ribcage\n• Using walk transitions (walk–halt–walk) to organize speed`
      },
      {
        left: "Trot",
        right: "Cadence, expression, the first real test of organization.",
        matched: `• Locks into a metronome trot, ready to refine\n• Bounces between “too slow” and “too fast” in three strides\n• How well they can keep rhythm while turning\n• Whether speed replaces balance when they get excited\n• Trot circles that prioritize rhythm over size\n• Using trot–walk–trot transitions as “cadence checks”\n• Rewarding every time they accidentally find an even tempo\n• Asking for small variations in stride length without losing rhythm`
      },
      {
        left: "Canter",
        right: "Organized chaos, power learning to stay in a lane.",
        matched: `•Ability to keep a three-beat rhythm without rushing\n• How they handle speed: do they lean, fall apart, or rebalance?\n• Big, forgiving canter circles to support balance\n• Canter–trot–canter transitions to teach speed control`
      },
      {
        left: "Gallop",
        right: "Raw energy, the scribble before it becomes a line.",
        matched: `• Natural speed and enthusiasm\n• How quickly they lose or regain rhythm at higher speeds\n• Emotional state: playful, anxious, or over-thrilled\n• Early hints of who might love future gallops in open fields\n`
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
