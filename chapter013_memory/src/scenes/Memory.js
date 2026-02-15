// Memory.js - Main scene for horse hoof anatomy memory game
class Memory extends Phaser.Scene {
    constructor() {
        super({ key: 'Memory' });
    }

    preload() {
        // Preload card images here (placeholder colors for now)
    }

    create() {
        // Card names for hoof anatomy
        this.cardNames = [
            'Hoof wall',
            'Sole',
            'Frog',
            'Navicular bone',
            'Laminae',
            'Cartilages'
        ];
        // Duplicate and shuffle for pairs
        let cards = [...this.cardNames, ...this.cardNames];
        Phaser.Utils.Array.Shuffle(cards);

        // Layout grid: 4 rows, 4 columns (to allow word wrapping)
        this.cardWidth = 90;
        this.cardHeight = 60;
        this.cardMargin = 10;
        this.cols = 4;
        this.rows = 4;
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
        // Show card name (with word wrap)
        if (!card.textObj) {
            card.textObj = this.add.text(card.x, card.y, card.cardName, { font: '14px Arial', color: '#fff', wordWrap: { width: this.cardWidth - 10 } }).setOrigin(0.5);
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
        const popupHeight = 440;
        const popupX = this.scale.width / 2;
        const popupY = this.scale.height / 2;
        const popupBg = this.add.rectangle(popupX, popupY, popupWidth, popupHeight, 0xffffff, 0.98).setStrokeStyle(3, 0x00796b);
        // Congratulation text
        const congratsText = this.add.text(popupX, popupY - 120, 'Congratulations! You matched all pairs!', { font: '24px Arial', color: '#388e3c', align: 'center', wordWrap: { width: popupWidth - 40 } }).setOrigin(0.5);
        // Bullet points (with content)
        const bullets = [
            'Hoof wall: The tough, outer covering of the hoof that bears most of the horse’s weight and protects the inner structures.',
            'Sole: The slightly concave, bottom surface of the hoof that helps support and protect the internal foot.',
            'Frog: The V-shaped, rubbery structure in the center of the hoof that aids in shock absorption and traction.',
            'Digital cushion: A spongy, fibrous pad above the frog that cushions impact and helps pump blood through the hoof.',
            'Navicular bone: A small bone behind the coffin bone that acts as a fulcrum for the deep digital flexor tendon, aiding movement and shock absorption.',
            'Laminae: Delicate, leaf-like tissues that attach the hoof wall to the coffin bone, supporting the horse’s weight and allowing hoof growth.',
            'Cartilages: Flexible structures on either side of the hoof that provide shock absorption and help the hoof expand with each step.'
        ];
        let bulletY = popupY - 60;
        for (let i = 0; i < bullets.length; i++) {
            this.add.text(popupX - popupWidth / 2 + 40, bulletY + i * 52, '• ' + bullets[i], { font: '15px Arial', color: '#222', wordWrap: { width: popupWidth - 80 } }).setOrigin(0, 0.5);
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
