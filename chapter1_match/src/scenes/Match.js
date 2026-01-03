// No import needed; Phaser is global

const gaitData = [
  {
    gait: "Walk",
    back: "Gentle sway, four-beat rhythm. Back moves side-to-side.",
    awareness: "Feel the sway. Let your hips follow the rhythm."
  },
  {
    gait: "Trot",
    back: "Two-beat diagonal gait. Back springs between steps.",
    awareness: "Post or sit with breath. Feel the bounce and support."
  },
  {
    gait: "Canter",
    back: "Three-beat gait with suspension. Back arches and releases.",
    awareness: "Match the swing. Stay centered in the lift."
  },
  {
    gait: "Gallop",
    back: "Four-beat extended stride. Back stretches and contracts.",
    awareness: "Allow freedom. Stay soft in your seat and spine."
  }
];

class MatchScene extends Phaser.Scene {
  constructor() {
    super({ key: "MatchScene" });
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#f0f8ff');

    this.matched = 0;
    this.gaitTexts = [];
    this.backTargets = [];
    this.popup = null;

    // Shuffle gaitData for random placement
    const shuffledGaits = Phaser.Utils.Array.Shuffle([...gaitData]);
    const shuffledBacks = Phaser.Utils.Array.Shuffle([...gaitData]);

// In create()
    shuffledGaits.forEach((item, i) => {
      // Create a container for border and text
      const container = this.add.container(30, 40 + i * 50);
      // Draw border rectangle
      const border = this.add.graphics();
      border.lineStyle(2, 0x222288, 1);
      border.strokeRoundedRect(0, 0, 110, 32, 8);
      // Add text
      const gaitText = this.add.text(8, 2, item.gait, {
        font: "16px Arial",
        color: "#222",
        padding: { x: 6, y: 4 },
        backgroundColor: "rgba(0,0,0,0)"
      })
        .setInteractive({ draggable: true })
        .setData("gait", item.gait);
      container.add([border, gaitText]);
      gaitText.container = container;
      gaitText.gaitIndex = i;
      this.input.setDraggable(gaitText);
      this.gaitTexts.push(gaitText);
    });


    // Display Back Function targets (droppables)
    shuffledBacks.forEach((item, i) => {
      // Draw border for back function
      const backBorder = this.add.graphics();
      backBorder.lineStyle(2, 0x222288, 1);
      backBorder.strokeRoundedRect(160, 50 + i * 90, 240, 48, 12);
      // Add text
      const backText = this.add.text(180, 52 + i * 90, item.back, {
        font: "12px Arial",
        backgroundColor: "rgba(0,0,0,0)",
        color: "#333",
        wordWrap: { width: 220 },
        padding: { x: 2, y: 2 }
      })
        .setData("gait", item.gait)
        .setData("awareness", item.awareness)
        .setData("matched", false)
        .setData("backIndex", i);
      this.backTargets.push(backText);
    });

    // Drag events
this.input.on("dragstart", (pointer, gameObject) => {
  gameObject.setAlpha(0.6);
  if (gameObject.container) {
    gameObject.container.setAlpha(0.6);
    // Store offset between pointer and container position
    gameObject.dragOffsetX = pointer.x - gameObject.container.x;
    gameObject.dragOffsetY = pointer.y - gameObject.container.y;
  }
});
this.input.on("drag", (pointer, gameObject) => {
  if (gameObject.container) {
    // Keep pointer aligned with the box
    gameObject.container.x = pointer.x - gameObject.dragOffsetX;
    gameObject.container.y = pointer.y - gameObject.dragOffsetY;
  } else {
    gameObject.x = pointer.x;
    gameObject.y = pointer.y;
  }
});
this.input.on("dragend", (pointer, gameObject) => {
  gameObject.setAlpha(1);
  if (gameObject.container) gameObject.container.setAlpha(1);
});
this.input.on("drop", (pointer, gameObject, dropTarget) => {
      if (
        dropTarget.getData("gait") === gameObject.getData("gait") &&
        !dropTarget.getData("matched")
      ) {
        dropTarget.setData("matched", true);
        if (gameObject.container) {
          // Place the gait box a bit lower under the matched Back Function
          const backIdx = dropTarget.getData("backIndex");
          gameObject.container.x = 180;
          gameObject.container.y = 40 + backIdx * 90 + 60;
          gameObject.disableInteractive();
          gameObject.container.disableInteractive();
        } else {
          gameObject.x = dropTarget.x - 120;
          gameObject.y = dropTarget.y + 32;
          gameObject.disableInteractive();
        }
        this.showPopup(dropTarget.getData("awareness"));
        this.matched++;
        if (this.matched === gaitData.length) {
          this.time.delayedCall(1200, () => this.showPopup("All matched! Well done!", true));
        }
      } else {
        // Snap back if not matched
        if (gameObject.container) {
          gameObject.container.x = gameObject.container.input.dragStartX;
          gameObject.container.y = gameObject.container.input.dragStartY;
        } else {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
      }
    });

    // Enable drop zones
    this.backTargets.forEach(target => {
      target.setInteractive({ dropZone: true });
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
    // Popup background (smaller, more to left)
    const popup = this.add.rectangle(270, 220, 260, 80, 0x222288, 0.95).setDepth(10);
    // Popup text
    const popupText = this.add.text(270, 220, text, {
      font: "16px Arial",
      color: "#fff",
      align: "center",
      wordWrap: { width: 220 }
    })
      .setOrigin(0.5)
      .setDepth(11);
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