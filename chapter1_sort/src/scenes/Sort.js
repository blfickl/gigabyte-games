// Sort.js - Drag and drop sorting for horse spinal sections
class Sort extends Phaser.Scene {
    constructor() {
        super({ key: 'Sort' });
    }

    preload() {
        // Preload assets if needed
    }

    create() {
        // Spinal sections data
        this.sections = [
            { region: 'Cervical', vertebrae: '7', function: 'Flexible, supports head movement' },
            { region: 'Thoracic', vertebrae: '18', function: 'Rigid, supports ribcage and saddle area' },
            { region: 'Lumbar', vertebrae: '6', function: 'Limited mobility, connects to hindquarters' },
            { region: 'Sacral', vertebrae: '5 (fused)', function: 'Transfers power from hind legs' },
            { region: 'Coccygeal', vertebrae: '15–25', function: 'Balance and communication' }
        ];
        // Shuffle for initial display
        Phaser.Utils.Array.Shuffle(this.sections);

        // Card layout
        this.cardWidth = 260;
        this.cardHeight = 70;
        this.cardMargin = 18;
        this.cards = [];
        this.dropZones = [];
        this.draggingCard = null;
        // Move cards higher and fit grid better vertically
        // Always start grid near the top
        this.startY = 8;
        this.startX = this.scale.width/2 - this.cardWidth/2;

        // Drop zones (target order: Cervical, Thoracic, Lumbar, Sacral, Coccygeal) + buffer
        for (let i = 0; i < this.sections.length + 1; i++) {
            let zoneY = this.startY + i * (this.cardHeight + this.cardMargin);
            let color = i < this.sections.length ? 0xf0f0f0 : 0xf5f5f5;
            let stroke = i < this.sections.length ? 0x00796b : 0xcccccc;
            let zone = this.add.rectangle(this.startX + this.cardWidth/2, zoneY, this.cardWidth, this.cardHeight, color, 0.7).setStrokeStyle(2, stroke);
            this.dropZones.push(zone);
            if (i === this.sections.length) {
                this.add.text(this.startX + this.cardWidth/2, zoneY, 'Buffer', { font: '18px Arial', color: '#888', align: 'center' }).setOrigin(0.5);
            }
        }

        // Draggable cards
        for (let i = 0; i < this.sections.length; i++) {
            let cardY = this.startY + i * (this.cardHeight + this.cardMargin);
            let card = this.add.rectangle(this.startX + this.cardWidth/2, cardY, this.cardWidth, this.cardHeight, 0xffffff, 1).setStrokeStyle(3, 0x388e3c).setInteractive({ draggable: true });
            card.data = this.sections[i];
            card.originalY = cardY;
            card.textObj = this.add.text(card.x, card.y, `${this.sections[i].region}\n${this.sections[i].vertebrae} vertebrae\n${this.sections[i].function}`, { font: '16px Arial', color: '#222', align: 'center', wordWrap: { width: this.cardWidth - 20 } }).setOrigin(0.5);
            this.cards.push(card);
        }

        // Drag events
        this.input.setDraggable(this.cards);
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.locked) return; // Prevent dragging locked cards
            gameObject.setFillStyle(0x00796b, 1);
            gameObject.textObj.setColor('#fff');
            this.draggingCard = gameObject;
        });
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.locked) return; // Prevent dragging locked cards
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.textObj.x = dragX;
            gameObject.textObj.y = dragY;
        });
        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject.locked) return; // Prevent dragging locked cards
            let dropped = false;
            for (let i = 0; i < this.dropZones.length; i++) {
                let zone = this.dropZones[i];
                if (Phaser.Geom.Rectangle.Contains(zone.getBounds(), gameObject.x, gameObject.y)) {
                    // Snap to zone
                    gameObject.x = zone.x;
                    gameObject.y = zone.y;
                    gameObject.textObj.x = zone.x;
                    gameObject.textObj.y = zone.y;
                    dropped = true;
                    break;
                }
            }
            if (!dropped) {
                // Return to original position
                gameObject.x = this.startX + this.cardWidth/2;
                gameObject.y = gameObject.originalY;
                gameObject.textObj.x = gameObject.x;
                gameObject.textObj.y = gameObject.y;
            }
            this.draggingCard = null;
            this.checkOrder();
        });

        // Feedback text
        this.feedbackText = this.add.text(this.scale.width/2, this.startY + this.sections.length * (this.cardHeight + this.cardMargin) + 18, '', { font: '20px Arial', color: '#c62828' }).setOrigin(0.5);
    }

    checkOrder() {
        // Check if cards are sorted correctly (ignore buffer zone)
        let order = [
            { region: 'Cervical', english: 'Neck' },
            { region: 'Thoracic', english: 'Withers to mid-back' },
            { region: 'Lumbar', english: 'Lower back' },
            { region: 'Sacral', english: 'Pelvis' },
            { region: 'Coccygeal', english: 'Tail' }
        ];
        let correctCount = 0;
        for (let i = 0; i < order.length; i++) {
            let card = this.cards.find(c => c.x === this.dropZones[i].x && c.y === this.dropZones[i].y);
            if (card && card.data.region === order[i].region) {
                // Lock card, change color, add English name if not already
                card.locked = true;
                card.setFillStyle(0x388e3c, 1);
                card.textObj.setColor('#fff');
                if (!card.englishAdded) {
                    card.textObj.setText(`${card.data.region} (${order[i].english})\n${card.data.vertebrae} vertebrae\n${card.data.function}`);
                    card.englishAdded = true;
                }
                correctCount++;
            } else if (card) {
                card.locked = false;
                card.setFillStyle(0xffffff, 1);
                card.textObj.setColor('#222');
                if (card.englishAdded) {
                    card.textObj.setText(`${card.data.region}\n${card.data.vertebrae} vertebrae\n${card.data.function}`);
                    card.englishAdded = false;
                }
            }
        }
        // Cards in buffer zone are always unlocked and normal color
        let bufferZone = this.dropZones[this.dropZones.length - 1];
        this.cards.forEach(card => {
            if (card.x === bufferZone.x && card.y === bufferZone.y) {
                card.locked = false;
                card.setFillStyle(0xf5f5f5, 1);
                card.textObj.setColor('#888');
            }
        });
        if (correctCount === order.length) {
            this.feedbackText.setColor('#388e3c').setText('Correct! Head to tail order complete!');
        } else {
            this.feedbackText.setColor('#c62828').setText('Keep sorting from head to tail...');
        }
    }
}

export default Sort;
