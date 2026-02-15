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
        matched: `Symbolism: Pause, reset, the start and end of every pattern\n\nWhat it reveals:\n• Mudslide: Squares up, waits, and listens for the next cue\n• Gigabyte: Wiggles, looks around, forgets he’s supposed to be standing\n• Ability to shift from motion to stillness without tension\n• Early understanding that “stop” is a thinking moment, not a punishment\n\nTraining focus:\n• Halt as a rhythm break: move → think → move\n• Rewarding soft, organized stops from walk and trot\n• Using halt to prevent rushing through circles\n• Teaching both colts that stillness is part of the pattern`
      },
      {
        left: "Walk",
        right: "Slow motion shape, the first rhythm they can really feel.",
        matched: `Symbolism: Slow motion shape, the first rhythm they can really feel\n\nWhat it reveals:\n• Mudslide: Finds the line of the circle and stays on it\n• Gigabyte: Drifts, cuts in, and redraws the circle every lap\n• Ability to maintain a four-beat rhythm on a curve\n• Early balance: do they lean, fall in, or stay upright?\n\nTraining focus:\n• Large circles to introduce bend through the ribcage\n• Using walk transitions (walk–halt–walk) to organize speed\n• Helping Gigabyte “find” the circle without over-correcting\n• Giving Mudslide small challenges: smaller circles, clearer bend`
      },
      {
        left: "Trot",
        right: "Cadence, expression, the first real test of organization.",
        matched: `Symbolism: Cadence, expression, the first real test of organization\n\nWhat it reveals:\n• Mudslide: Locks into a metronome trot, ready to refine\n• Gigabyte: Bounces between “too slow” and “too fast” in three strides\n• How well they can keep rhythm while turning\n• Whether speed replaces balance when they get excited\n\nTraining focus:\n• Trot circles that prioritize rhythm over size\n• Using trot–walk–trot transitions as “cadence checks”\n• Rewarding Gigabyte every time he accidentally finds an even tempo\n• Asking Mudslide for small variations in stride length without losing rhythm`
      },
      {
        left: "Canter",
        right: "Organized chaos, power learning to stay in a lane.",
        matched: `Symbolism: Organized chaos, power learning to stay in a lane\n\nWhat it reveals:\n• Mudslide: Tries to hold the circle like a compass\n• Gigabyte: Turns the circle into a creative polygon\n• Ability to keep a three-beat rhythm without rushing\n• How they handle speed: do they lean, fall apart, or rebalance?\n\nTraining focus:\n• Big, forgiving canter circles to support balance\n• Canter–trot–canter transitions to teach speed control\n• Helping Gigabyte learn that “faster” is not the only answer\n• Giving Mudslide moments to stretch and play, not just hold form`
      },
      {
        left: "Gallop",
        right: "Raw energy, the scribble before it becomes a line.",
        matched: `Symbolism: Raw energy, the scribble before it becomes a line\n\nWhat it reveals:\n• Natural speed and enthusiasm\n• How quickly they lose or regain rhythm at higher speeds\n• Emotional state: playful, anxious, or over-thrilled\n• Early hints of who might love future gallops in open fields\n\nTraining focus:\n• Mostly observation at this stage\n• Short, straight lines rather than circles\n• Using downward transitions to bring speed back into shape\n• Teaching that even chaos can end in a soft, organized trot or walk`
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
