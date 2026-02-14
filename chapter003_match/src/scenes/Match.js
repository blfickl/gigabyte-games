class MatchScene extends Phaser.Scene {
  constructor() {
    super({ key: "MatchScene" });
  }

  create() {
    // Ensure matches is initialized as a number
    this.matches = 0;

    // Show a starter message at the top
    const starterText = this.add.text(this.sys.game.config.width/2, 24, "Drag the cards to match them!", {
      font: "24px Arial",
      color: "#5a4a3a",
      align: "center"
    }).setOrigin(0.5, 0);
    this.starterText = starterText;

    // Card data with custom matched text
    const cards = [
      { left: "Halt", right: "Patience, presence and readiness.", matched: "Halt - Curiosity is revealed when the foal leans forward, sniffs, shifts weight to investigate." },
      { left: "Walk", right: "Foal follows rythmn and connection.", matched: "Walk - Ears flicking, exploring objects along the path. Watch for drifting into handler space." },
      { left: "Trot", right: "Energy, expression, honesty.", matched: "Trot - Foal is comfortable with the handler when they stay connected even when excited." },
        { left: "Canter", right: "Joy, freedom and instint when loose.", matched: "Canter - Curiosity is demonstrated with playful movements and exploration. Watch for kicking out and crowding during play." }
      ];


    // Shuffle cards
    const shuffled = Phaser.Utils.Array ? Phaser.Utils.Array.Shuffle([...cards]) : cards.sort(() => Math.random() - 0.5);
    // Layout
    const leftX = this.sys.game.config.width * 0.10;
    const rightX = this.sys.game.config.width * 0.60;
    const cardW = 120, cardH = 80;
    const rightW = 220, rightH = 140;
    const spacing = this.sys.game.config.height * 0.13;
    // Store containers for drag logic
    const leftContainers = [];
    const rightContainers = [];
    // Left cards (shuffled)
    shuffled.forEach((item, i) => {
      const y = this.sys.game.config.height * 0.18 + i * spacing;
      // #fff6e5 (creamy white) for before dropped
      const card = this.add.rectangle(0, 0, cardW, cardH, 0xfff6e5, 1).setStrokeStyle(2, 0x1976d2);
      const text = this.add.text(0, 0, item.left, { font: "20px Arial", color: "#5a4a3a" }).setOrigin(0.5);
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
      // #fff6e5 (creamy white) for before dropped
      const card = this.add.rectangle(0, 0, rightW, rightH, 0xfff6e5, 1).setStrokeStyle(2, 0x5a4a3a);
      const text = this.add.text(0, 0, item.right, { font: "18px Arial", color: "#5a4a3a", wordWrap: { width: rightW - 24 } }).setOrigin(0.5);
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
    //  console.log('Drop event fired', gameObject, dropTarget);
    //  console.log('gameObject.matchKey:', gameObject.matchKey, 'dropTarget.matchKey:', dropTarget.matchKey);
      if (gameObject.matchKey && dropTarget.matchKey && gameObject.matchKey === dropTarget.matchKey) {
        // #d0e6c3 (light muted green) for after dropped
        dropTarget.list[0].setFillStyle(0xd0e6c3, 1);
        dropTarget.list[1].setText(gameObject.matchedText);
        gameObject.disableInteractive();
        this.matches++;
    //    console.log('Current matches:', this.matches);
        if (this.matches === cards.length) {
          // Remove starter message
          if (this.starterText) this.starterText.destroy();
          // Show congratulations text at the top
          const congratsText = this.add.text(this.sys.game.config.width/2, 30, "All Matches Complete.  Congratulations!", {
            font: "22px Arial",
            color: "#5a4a3a",
            fontStyle: "bold",
            align: "center"
          }).setOrigin(0.5, 0);
       //   console.log('All matches complete!');
        }
      }
    });

    // Enable input plugin for drag events
    this.input.topOnly = false;
  }
}
window.MatchScene = MatchScene;
