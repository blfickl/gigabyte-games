class MatchScene extends Phaser.Scene {
  constructor() {
    super({ key: "MatchScene" });
  }

  create() {
    // Ensure matches is initialized as a number
    this.matches = 0;

    // Show a starter message at the top
    const starterText = this.add.text(this.sys.game.config.width/2, 24, "Drag the cards to match them!", {
      font: "20px Arial",
      color: "#222",
      align: "center"
    }).setOrigin(0.5, 0);
    this.starterText = starterText;

    // Card data with custom matched text
    const cards = [
      { left: "Walk", right: "Gentle sway, four-beat rhythm. Back moves side-to-side.", matched: "Walk - Feel the sway. Let your hips follow the rhythm." },
      { left: "Trot", right: "Two-beat diagonal gait. Back springs between steps.", matched: "Trot - Post or sit with breath. Feel the bounce and support." },
      { left: "Canter", right: "Three-beat gait with suspension. Back arches and releases.", matched: "Canter - Match the swing. Stay centered in the lift." },
      { left: "Gallop", right: "Four-beat extended stride. Back stretches and contracts.", matched: "Gallop - Allow freedom. Stay soft in your seat and spine." }
      ];
      


    // Shuffle cards
    const shuffled = Phaser.Utils.Array ? Phaser.Utils.Array.Shuffle([...cards]) : cards.sort(() => Math.random() - 0.5);
    // Responsive layout
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    let leftX, rightX, cardW, rightW, cardH, rightH, spacing;
    if (width < 600) {
      // Mobile: columns closer, cards wider
      leftX = width * 0.15;
      rightX = width * 0.55;
      cardW = width * 0.28;
      rightW = width * 0.38;
      cardH = height * 0.09;
      rightH = height * 0.14;
      spacing = height * 0.18;
    } else {
      // Desktop/tablet: original but improved
      leftX = width * 0.18;
      rightX = width * 0.56;
      cardW = 140;
      rightW = 240;
      cardH = 60;
      rightH = 110;
      spacing = height * 0.13;
    }
    // Store containers for drag logic
    const leftContainers = [];
    const rightContainers = [];
    // Left cards (shuffled)
    shuffled.forEach((item, i) => {
      const y = this.sys.game.config.height * 0.18 + i * spacing;
      const card = this.add.rectangle(0, 0, cardW, cardH, 0xffffff, 1).setStrokeStyle(2, 0x1976d2);
      const text = this.add.text(0, 0, item.left, { font: "20px Arial", color: "#222" }).setOrigin(0.5);
      const container = this.add.container(leftX, y, [card, text]);
      container.setSize(cardW, cardH);
      container.setInteractive({ draggable: true });
      this.input.setDraggable(container);
      container.matchKey = item.right;
      container.matchedText = item.matched;
      leftContainers.push(container);
    });
    // Right cards (shuffled)
    const shuffledRight = Phaser.Utils.Array ? Phaser.Utils.Array.Shuffle([...cards]) : cards.sort(() => Math.random() - 0.5);
    shuffledRight.forEach((item, i) => {
      const y = this.sys.game.config.height * 0.18 + i * spacing;
      const card = this.add.rectangle(0, 0, rightW, rightH, 0xe3eafc, 1).setStrokeStyle(2, 0x1976d2);
      const text = this.add.text(0, 0, item.right, { font: "20px Arial", color: "#222", wordWrap: { width: rightW - 24 } }).setOrigin(0.5);
      const container = this.add.container(rightX, y, [card, text]);
      container.setSize(rightW, rightH);
      container.setInteractive({ dropZone: true });
      container.matchKey = item.right;
      container.matchedText = item.matched;
      rightContainers.push(container);
    });
    // Drag events
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
    // Drop logic
    this.input.on("drop", (pointer, gameObject, dropTarget) => {
      console.log('Drop event fired', gameObject, dropTarget);
      console.log('gameObject.matchKey:', gameObject.matchKey, 'dropTarget.matchKey:', dropTarget.matchKey);
      if (gameObject.matchKey && dropTarget.matchKey && gameObject.matchKey === dropTarget.matchKey) {
        dropTarget.list[0].setFillStyle(0xc8e6c9, 1);
        dropTarget.list[1].setText(gameObject.matchedText);
        gameObject.disableInteractive();
        this.matches++;
        console.log('Current matches:', this.matches);
        if (this.matches === cards.length) {
          // Remove starter message
          if (this.starterText) this.starterText.destroy();
          // Show congratulations text at the top
          const congratsText = this.add.text(this.sys.game.config.width/2, 30, "All Matches Complete.  Congratulations!", {
            font: "24px Arial",
            color: "#1976d2",
            fontStyle: "bold",
            align: "center"
          }).setOrigin(0.5, 0);
          console.log('All matches complete!');
        }
      }
    });

    // Enable input plugin for drag events
    this.input.topOnly = false;
  }
}
window.MatchScene = MatchScene;
