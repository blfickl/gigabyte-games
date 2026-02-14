// No import needed; Phaser is global

const gaitData = [
  {
    gait: "Walk",
    back: "Gentle sway, four-beat rhythm. Back moves side-to-side.",
    awareness: "Walk - Feel the sway. Let your hips follow the rhythm."
  },
  {
    gait: "Trot",
    back: "Two-beat diagonal gait. Back springs between steps.",
    awareness: "Trot - Post or sit with breath. Feel the bounce and support."
  },
  {
    gait: "Canter",
    back: "Three-beat gait with suspension. Back arches and releases.",
    awareness: "Canter - Match the swing. Stay centered in the lift."
  },
  {
    gait: "Gallop",
    back: "Four-beat extended stride. Back stretches and contracts.",
    awareness: "Gallop - Allow freedom. Stay soft in your seat and spine."
  }
];

class MatchScene extends Phaser.Scene {
  constructor() {
    super({ key: "MatchScene" });
  }

  preload() {}

  create() {
      // this.cameras.main.setBackgroundColor('#f0f8ff'); // Disabled for config test

      this.matched = 0;
      this.gaitTexts = [];
      this.backTargets = [];
      this.popup = null;

      // Shuffle gaitData for random placement
      const shuffledGaits = Phaser.Utils.Array.Shuffle([...gaitData]);
      const shuffledBacks = Phaser.Utils.Array.Shuffle([...gaitData]);

      // Layout variables (auto-calculate for up to 6 items, spaced evenly)
      const maxItems = 6;
      const screenW = this.sys.game.config.width;
      const screenH = this.sys.game.config.height;
      const leftColX = Math.round(screenW * 0.08);
      const rightColX = Math.round(screenW * 0.55);
      const leftColWidth = Math.round(screenW * 0.22);
      const rightColWidth = Math.round(screenW * 0.28);
      const rightColHeight = Math.round(screenH * 0.10);
      // Calculate vertical spacing so all items fit with padding
      const itemCount = Math.max(shuffledGaits.length, shuffledBacks.length, maxItems);
      const topMargin = Math.round(screenH * 0.10);
      const availableHeight = screenH - topMargin * 2;
      const rowSpacing = Math.floor(availableHeight / (maxItems - 1));

      // Draggable gait items (left column)
      shuffledGaits.forEach((item, i) => {
        // Simulated shadow: draw a semi-transparent rectangle behind the card
        const shadow = this.add.rectangle(4, 4, leftColWidth, 48, 0x000000, 0.13)
          .setOrigin(0)
          .setDepth(0);
        // Card background
        const cardBg = this.add.rectangle(0, 0, leftColWidth, 48, 0xffffff, 0.98)
          .setStrokeStyle(2, 0x1976d2)
          .setOrigin(0)
          .setDepth(1)
          .setAlpha(1);
        // Add text (larger font)
        const gaitText = this.add.text(12, 10, item.gait, {
          font: "24px Arial",
          color: "#222",
          fontStyle: "bold",
          padding: { x: 6, y: 4 },
          backgroundColor: "rgba(0,0,0,0)"
        });
        // Container for card (shadow, cardBg, text)
        const container = this.add.container(leftColX, topMargin + i * rowSpacing, [shadow, cardBg, gaitText]);
        gaitText.container = container;
        gaitText.gaitIndex = i;
        // Make the whole card draggable (not just text)
        container.setSize(leftColWidth, 48);
        container.setInteractive({ draggable: true });
        container.gait = item.gait;
        this.input.setDraggable(container);
        this.gaitTexts.push(container);
      });

      // Drop targets (right column)
      shuffledBacks.forEach((item, i) => {
        // Simulated shadow: draw a semi-transparent rectangle behind the drop target
        const shadow = this.add.rectangle(4, 4, rightColWidth, rightColHeight, 0x000000, 0.13)
          .setOrigin(0)
          .setDepth(0);
        // Card background (make more transparent for debugging)
        const dropBg = this.add.rectangle(0, 0, rightColWidth, rightColHeight, 0xe3eafc, 0.25)
          .setStrokeStyle(2, 0x1976d2)
          .setOrigin(0)
          .setDepth(1)
          .setAlpha(0.25);
        // Add text (larger font)
        const backText = this.add.text(10, 16, item.back, {
          font: "20px Arial",
          backgroundColor: "rgba(0,0,0,0)",
          color: "#333",
          wordWrap: { width: rightColWidth - 20 },
          padding: { x: 2, y: 2 }
        })
          .setData("gait", item.gait)
          .setData("awareness", item.awareness)
          .setData("matched", false)
          .setData("backIndex", i);

        // Add a narrow bow (arc) to the bottom right for visual cue
        const bowRadius = 18;
        const bow = this.add.graphics();
        bow.lineStyle(3, 0x1976d2, 1);
        // Draw arc (bow) at bottom right
        bow.beginPath();
        bow.arc(rightColWidth - bowRadius - 8, rightColHeight - bowRadius - 6, bowRadius, Math.PI * 0.15, Math.PI * 0.85, false);
        bow.strokePath();
        bow.closePath();
        bow.setDepth(2);

        // Container for drop target (shadow, dropBg, text, bow)
        const dropContainer = this.add.container(rightColX, topMargin + i * rowSpacing, [shadow, dropBg, backText, bow]);
        backText.dropContainer = dropContainer;
        this.backTargets.push(backText);
      });

    // Drag events
    this.input.on("dragstart", (pointer, gameObject) => {
      // Animate scale up and shadow
      this.tweens.add({
        targets: gameObject,
        scale: 1.08,
        duration: 120,
        ease: "Quad.easeOut"
      });
      gameObject.setAlpha(0.8);
      // Store offset between pointer and container position
      gameObject.dragOffsetX = pointer.x - gameObject.x;
      gameObject.dragOffsetY = pointer.y - gameObject.y;
    });
    this.input.on("drag", (pointer, gameObject) => {
      // Keep pointer aligned with the box
      gameObject.x = pointer.x - gameObject.dragOffsetX;
      gameObject.y = pointer.y - gameObject.dragOffsetY;
    });
    this.input.on("dragend", (pointer, gameObject) => {
      this.tweens.add({
        targets: gameObject,
        scale: 1,
        duration: 120,
        ease: "Quad.easeIn"
      });
      gameObject.setAlpha(1);
    });

    // Highlight drop target on pointerover/out
    this.backTargets.forEach(target => {
      const dropContainer = target.dropContainer;
      dropContainer.setSize(rightColWidth, rightColHeight);
      dropContainer.setInteractive({ dropZone: true });
      dropContainer.on('pointerover', () => {
        dropContainer.first.setFillStyle(0xb6d0f7, 1);
      });
      dropContainer.on('pointerout', () => {
        dropContainer.first.setFillStyle(0xe3eafc, 0.98);
      });
    });

    this.input.on("drop", (pointer, gameObject, dropTarget) => {
      // Accept drop only if correct and not already matched
      let dropData = dropTarget.getData ? dropTarget : (dropTarget.list ? dropTarget.list[1] : null);
      if (!dropData) return;
      if (
        dropData.getData("gait") === gameObject.gait &&
        !dropData.getData("matched")
      ) {
        dropData.setData("matched", true);
        // Find the dropContainer for this dropData
        const dropContainer = dropData.dropContainer;

        // Change background color for feedback (e.g., green)
        if (dropContainer && dropContainer.list && dropContainer.list[1]) {
          dropContainer.list[1].setFillStyle(0xc8e6c9, 1); // light green
        }

        // Find the backText in the dropContainer (should be at index 2)
        const backText = dropContainer.list[2];
        // Remove any previous awarenessText from the container
        dropContainer.iterate(child => {
          if (child.isAwarenessText) dropContainer.remove(child, true);
        });

        // Show awareness as a popup
        this.showPopup(dropData.getData("awareness"), false);

        // Overlay awareness text centered in the right card (darker for visibility)
        const awarenessText = this.add.text(
          rightColWidth / 2,
          rightColHeight / 2,
          dropData.getData("awareness"),
          {
            font: "18px Arial",
            color: "#000",
            fontStyle: "bold",
            align: "center",
            wordWrap: { width: rightColWidth - 32 },
            padding: { x: 4, y: 4 }
          }
        ).setOrigin(0.5);
        awarenessText.isAwarenessText = true;
        this.children.remove(awarenessText);
        dropContainer.add(awarenessText);
        dropContainer.bringToTop(awarenessText);

        // Do NOT add the left card to the right card container
        gameObject.disableInteractive();

        // Expand drop zone to cover more area below the card for easier dropping
        dropContainer.input.hitArea.setTo(0, 0, rightColWidth, rightColHeight * 2);

        this.matched++;
        if (this.matched === gaitData.length) {
          this.time.delayedCall(1200, () => this.showPopup("All matched! Well done!", true));
        }
      } else {
        // Snap back if not matched
        this.tweens.add({
          targets: gameObject,
          x: leftColX,
          y: topMargin + (gameObject.gaitIndex || 0) * rowSpacing,
          scale: 1,
          duration: 180,
          ease: "Back.easeOut"
        });
      }
    });
  }

  showPopup(text, isFinal = false) {
    if (this.popup) this.popup.destroy();
    if (this.popupIcon) this.popupIcon.destroy();
    // If final, show golden message at top with sparkles, not in popup
    if (isFinal) {
      // Blue message text at the top
      const topMargin = 24;
      const congratsText = this.add.text(30, topMargin, "All matched! Well done!", {
        font: "18px Arial",
        color: "#1976d2",
        fontStyle: "bold",
        align: "left"
      }).setOrigin(0, 0).setDepth(1000);

      // Add sparkles effect (blue, above all, at top)
      const sparkleCount = 16;
      const sparkleRadius = 60;
      const baseX = 30 + congratsText.width / 2;
      const baseY = topMargin + congratsText.height / 2;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = (2 * Math.PI * i) / sparkleCount;
        const sx = baseX + Math.cos(angle) * sparkleRadius;
        const sy = baseY + Math.sin(angle) * sparkleRadius;
        const sparkle = this.add.star(sx, sy, 5, 2, 6, 0x1976d2, 1).setDepth(1000);
        sparkle.setAlpha(0.7);
        sparkle.setScale(0.7 + Math.random() * 0.5);
        // Animate sparkle alpha for twinkle effect
        this.tweens.add({
          targets: sparkle,
          alpha: { from: 0.7, to: 0.2 + Math.random() * 0.5 },
          duration: 600 + Math.random() * 800,
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 400
        });
        // Remove sparkles with the text
        this.time.delayedCall(1800, () => sparkle.destroy());
      }

      this.time.delayedCall(1800, () => {
        congratsText.destroy();
        this.scene.restart();
      });
      return;
    }
    // Always show popup for awareness
    const popup = this.add.rectangle(this.sys.game.config.width/2, this.sys.game.config.height/2, 320, 100, 0x222288, 0.95).setDepth(1000);
    const popupText = this.add.text(this.sys.game.config.width/2, this.sys.game.config.height/2, text, {
      font: "18px Arial",
      color: "#fff",
      align: "center",
      wordWrap: { width: 280 }
    }).setOrigin(0.5).setDepth(1001);
    this.tweens.add({
      targets: [popup, popupText],
      scale: { from: 0.7, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 350,
      ease: "Back.Out"
    });
    this.popup = popup;
    this.popupText = popupText;
    this.input.once("pointerdown", () => {
      popup.destroy();
      popupText.destroy();
    });
  }
}

// Attach to window for browser use
window.MatchScene = MatchScene;