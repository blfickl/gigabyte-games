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
  const container = this.add.container(60, 100 + i * 70);
  // Draw border rectangle
  const border = this.add.graphics();
  border.lineStyle(3, 0x222288, 1);
  border.strokeRoundedRect(0, 0, 140, 44, 10);
  // Add text
  const gaitText = this.add.text(10, 5, item.gait, {
    font: "24px Arial",
    color: "#222",
    padding: { x: 10, y: 8 },
    backgroundColor: "rgba(0,0,0,0)"
  })
    .setInteractive({ draggable: true })
    .setData("gait", item.gait);
  container.add([border, gaitText]);
  gaitText.container = container;
  this.input.setDraggable(gaitText);
  this.gaitTexts.push(gaitText);
});


    // Display Back Function targets (droppables)
    shuffledBacks.forEach((item, i) => {
      const backText = this.add.text(400, 60 + i * 100, item.back, {
        font: "20px Arial",
        backgroundColor: "#fffbe0",
        color: "#333",
        wordWrap: { width: 320 },
        padding: { x: 10, y: 8 },
        borderRadius: 8
      })
        .setData("gait", item.gait)
        .setData("awareness", item.awareness)
        .setData("matched", false);
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
      gameObject.container.x = dropTarget.x - 120;
      gameObject.container.y = dropTarget.y + 10;
      gameObject.disableInteractive();
      gameObject.container.disableInteractive();
    } else {
      gameObject.x = dropTarget.x - 120;
      gameObject.y = dropTarget.y + 10;
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
      const congratsText = this.add.text(400, 40, "All matched! Well done!", {
        font: "36px Arial",
        color: "#ffd700",
        fontStyle: "bold",
        align: "center",
        stroke: "#fff",
        strokeThickness: 4
      }).setOrigin(0.5).setDepth(20);
      // Sparkles
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const x = 400 + Math.cos(angle) * 120;
        const y = 40 + Math.sin(angle) * 32;
        const sparkle = this.add.star(x, y, 5, 4, 10, 0xfff700).setDepth(21);
        this.tweens.add({
          targets: sparkle,
          alpha: { from: 1, to: 0 },
          scale: { from: 1, to: 2 },
          duration: 900,
          delay: i * 60,
          onComplete: () => sparkle.destroy()
        });
      }
      this.time.delayedCall(1800, () => {
        congratsText.destroy();
        this.scene.restart();
      });
      return;
    }
    // Popup background
    const popup = this.add.rectangle(400, 300, 420, 120, 0x222288, 0.95).setDepth(10);
    // Popup text
    const popupText = this.add.text(400, 300, text, {
      font: "22px Arial",
      color: "#fff",
      align: "center",
      wordWrap: { width: 380 }
    })
      .setOrigin(0.5)
      .setDepth(11);
    // Horseshoe icon (placeholder) at bottom left
    const horseshoe = this.add.graphics({ x: 210, y: 355 });
    horseshoe.lineStyle(6, 0xffd700, 1);
    horseshoe.beginPath();
    horseshoe.arc(0, 0, 24, Phaser.Math.DegToRad(45), Phaser.Math.DegToRad(315), false);
    horseshoe.strokePath();
    // Horseshoe ends
    horseshoe.lineStyle(6, 0xffd700, 1);
    horseshoe.beginPath();
    horseshoe.moveTo(16, 16);
    horseshoe.lineTo(24, 8);
    horseshoe.moveTo(-16, 16);
    horseshoe.lineTo(-24, 8);
    horseshoe.strokePath();
    horseshoe.setDepth(12);
    // Animate horseshoe (rotate 3 times)
    this.tweens.add({
      targets: horseshoe,
      angle: 360 * 3,
      duration: 1800,
      repeat: 0
    });
    this.tweens.add({
      targets: [popup, popupText, horseshoe],
      scale: { from: 0.7, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 350,
      ease: "Back.Out"
    });
    this.popup = popup;
    this.popupText = popupText;
    this.popupIcon = horseshoe;
    this.input.once("pointerdown", () => {
      popup.destroy();
      popupText.destroy();
      horseshoe.destroy();
    });
  }
}

// Attach to window for browser use
window.MatchScene = MatchScene;