// Memory.js - Main scene for horse limb memory game
class Memory extends Phaser.Scene {
    constructor() {
        super({ key: 'Memory' });
    }

    preload() {
        // Preload card images here (placeholder colors for now)
    }

    create() {
        // Card names for limb anatomy
        this.cardNames = ['Scapula', 'Hock', 'Stifle', 'Fetlock', 'Carpus', 'Pastern'];
        // Duplicate and shuffle for pairs
        let cards = [...this.cardNames, ...this.cardNames];
        Phaser.Utils.Array.Shuffle(cards);

        // Layout grid: 3 rows, 4 columns
        this.cardWidth = 72;
        this.cardHeight = 60;
        this.cardMargin = 10;
        this.cols = 4;
        this.rows = 3;
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.startTime = this.time.now;
        // Center grid horizontally, move to top with margin
        let gridWidth = this.cols * this.cardWidth + (this.cols - 1) * this.cardMargin;
        let gridHeight = this.rows * this.cardHeight + (this.rows - 1) * this.cardMargin;
        let startX = this.scale.width/2 - gridWidth/2 + this.cardWidth/2;
        let startY = 40 + this.cardHeight/2;

        // Create cards
        for (let i = 0; i < cards.length; i++) {
            let col = i % this.cols;
            let row = Math.floor(i / this.cols);
            let x = startX + col * (this.cardWidth + this.cardMargin);
            let y = startY + row * (this.cardHeight + this.cardMargin);
            let card = this.add.rectangle(x, y, this.cardWidth, this.cardHeight, 0xcccccc, 1).setStrokeStyle(3, 0x00796b).setInteractive();
            card.cardName = cards[i];
            card.faceUp = false;
            card.index = i;
            card.on('pointerdown', () => this.flipCard(card));
            this.cards.push(card);
        }
    }

    flipCard(card) {
        if (card.faceUp || this.flipped.length === 2 || this.matched.includes(card.index)) return;
        card.faceUp = true;
        this.flipped.push(card);
        card.setFillStyle(0x00796b, 1);
        // Show card name (for now)
        if (!card.textObj) {
            card.textObj = this.add.text(card.x, card.y, card.cardName, { font: '14px Arial', color: '#fff' }).setOrigin(0.5);
        } else {
            card.textObj.setVisible(true);
        }
        if (this.flipped.length === 2) {
            this.moves++;
            this.time.delayedCall(800, () => this.checkMatch(), [], this);
        }
    }

    checkMatch() {
        let [card1, card2] = this.flipped;
        if (card1.cardName === card2.cardName) {
            this.matched.push(card1.index, card2.index);
        } else {
            card1.faceUp = false;
            card2.faceUp = false;
            card1.setFillStyle(0xcccccc, 1);
            card2.setFillStyle(0xcccccc, 1);
            if (card1.textObj) card1.textObj.setVisible(false);
            if (card2.textObj) card2.textObj.setVisible(false);
        }
        this.flipped = [];
        if (this.matched.length === this.cards.length) {
            this.showCongratsPopup();
        }
    }

    showCongratsPopup() {
        // Popup background
        const popupWidth = 440;
        const popupHeight = 320;
        const popupX = this.scale.width / 2;
        const popupY = this.scale.height / 2;
        const popupBg = this.add.rectangle(popupX, popupY, popupWidth, popupHeight, 0xffffff, 0.98).setStrokeStyle(3, 0x00796b);
        // Congratulation text
        const congratsText = this.add.text(popupX, popupY - 110, 'Congratulations! You matched all pairs!', { font: '24px Arial', color: '#388e3c', align: 'center', wordWrap: { width: popupWidth - 40 } }).setOrigin(0.5);
        // Bullet points
        const bullets = [
            'Pastern: This is where the hoof meets the world.',
            'Hock: A complex joint with huge influence on propulsion.',
            'Fetlock: The fetlock is the spring of the limb',
            'Stifle: The stifle is the hinge that controls engagement.',
            'Scapula: Shoulder - the front-end equivalent of the pelvis',
            'Carpus: A complex, multi-bone hinge that stabilizes the limb.',
            'Pelvis: The pelvis ties the whole system together. Gluteal and hamstring power, ability to sit, coil, and lift and connection to the spine and core'
        ];
        let bulletY = popupY - 60;
        for (let i = 0; i < bullets.length; i++) {
            this.add.text(popupX - popupWidth / 2 + 40, bulletY + i * 36, '• ' + bullets[i], { font: '14px Arial', color: '#222', wordWrap: { width: popupWidth - 80 } }).setOrigin(0, 0.5);
        }
        // Close button
        const closeBtn = this.add.text(popupX, popupY + popupHeight / 2 - 30, ' ', { font: '28px Arial', color: '#c62828', backgroundColor: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1000);
        closeBtn.on('pointerup', () => {
            popupBg.destroy();
            congratsText.destroy();
            closeBtn.destroy();
        });
    }

    update() {
        // No timer/moves display for now
    }
}

window.Memory = Memory;
