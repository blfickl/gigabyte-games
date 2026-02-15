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
      { left: "Halt", right: "Connection to the rider through stillness.", matched: "Halt -  Emotional neutrality before entering the ring. Ability to stay soft while adrenaline rises. Square stance showing balance and preparedness." },
      { left: "Walk", right: "Ability to decompress between warm-up efforts.", matched: "Walk - suppleness through the topline and shoulders. Willingness to stay connected without tension. Emotional recovery after big efforts" },
      { left: "Trot", right: "Willingness to stretch into contact.", matched: " Trot - Suppleness through the ribcage and shoulders. Evenness of rhythm before jumping. Emotional readiness for more power." },
        { left: "Canter", right: "Power, lift, the gateway to flight.", matched: " Canter - Balance and adjustability before fences. Ability to lengthen and shorten without tension. Emotional confidence approaching fences. Precision in lead changes and turns" }
      ];




    // Shuffle cards
    const shuffled = Phaser.Utils.Array ? Phaser.Utils.Array.Shuffle([...cards]) : cards.sort(() => Math.random() - 0.5);
    // Layout
    const leftX = this.sys.game.config.width * 0.10;
    const rightX = this.sys.game.config.width * 0.60;
    const cardW = 120, cardH = 80;
    const rightW = 240;
    const minRightH = 90; // minimum height for right cards
    const spacing = 20; // fixed spacing between right cards
    // Store containers for drag logic
    const leftContainers = [];
    const rightContainers = [];
    // Left cards (shuffled)
    const minLeftH = 60;
    let leftY = this.sys.game.config.height * 0.18;
    shuffled.forEach((item, i) => {
      // Create text first to measure height
      const tempText = this.add.text(0, 0, item.left, { font: "16px Arial", color: "#5a4a3a" }).setOrigin(0.5);
      const textHeight = tempText.height;
      const leftH = Math.max(minLeftH, textHeight + 24); // 24px padding
      tempText.destroy();

      // Now create the card and text for real
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
      // Create text first to measure height
      const tempText = this.add.text(0, 0, item.right, { font: "12px Arial", color: "#5a4a3a", wordWrap: { width: rightW - 24 } }).setOrigin(0.5);
      // Phaser's text.height is accurate after creation
      const textHeight = tempText.height;
      const rightH = Math.max(minRightH, textHeight + 32); // 32px padding
      tempText.destroy(); // We'll recreate it below

      // Now create the card and text for real
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
            font: "20px Arial",
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
