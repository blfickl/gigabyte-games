// Sort.js for chapter010_sort
// Sort.js - Drag and drop sorting for horse limb sections
class Sort extends Phaser.Scene {
    constructor() {
        super({ key: 'Sort' });
    }

    preload() {
        // Preload assets if needed
    }

    create() {
        // Two possible section arrays
        const set1 = [
            { region: 'Pastern & Coffin Bone',  function: 'Foundation of impact, proprioception, and breakover.' },
            { region: 'Fetlock Joint',  function: 'Primary shock absorber and elastic spring.' },
            { region: 'Cannon Bone',  function: 'Weight-bearing column that transfers load upward.' },
            { region: 'Carpus (Knee)',  function: 'Complex hinge that manages flexion, stability, and concussion.' },
            { region: 'Scapula (Shoulder Blade)',  function: 'The “floating” joint that determines stride length and freedom.' }
        ];
        const set2 = [
            { region: 'Pastern & Coffin Bone',  function: 'Foundation of shock absorption, proprioception, and stride length.' },
            { region: 'Fetlock Joint',  function: 'Primary weight-bearing column of the lower limb.' },
            { region: 'Hock',  function: 'The power hinge—major lever for propulsion.' },
            { region: 'Stifle',  function: 'The true “knee” of the horse—critical for engagement and straightness.' },
            { region: 'Pelvis',  function: 'The engine room—where thrust, collection, and hindquarter articulation originate.' }
        ];
        // Randomly choose one
        this.sections = Math.random() < 0.5 ? set1 : set2;
        // Shuffle for initial display
        Phaser.Utils.Array.Shuffle(this.sections);

        // Card layout
        this.cardWidth = 340;
        this.cardHeight = 54;
        this.cardMargin = 18;
        this.cards = [];
        this.dropZones = [];
        this.draggingCard = null;
        // Calculate total height needed for all cards, margins, and buffer
        const totalCards = this.sections.length + 1; // +1 for buffer
        const totalHeight = totalCards * this.cardHeight + (totalCards - 1) * this.cardMargin;
        // If cards fit, center vertically, else start at top margin
        const topMargin = 40;
        if (totalHeight + topMargin * 2 < this.scale.height) {
            this.startY = (this.scale.height - totalHeight) / 2;
        } else {
            this.startY = topMargin;
        }
        // Always center horizontally
        this.startX = this.scale.width/2 - this.cardWidth/2;

        // Drop zones (target order + buffer)
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
            card.textObj = this.add.text(card.x, card.y, `${this.sections[i].region}\n${this.sections[i].function}`, { font: '16px Arial', color: '#222', align: 'center', wordWrap: { width: this.cardWidth - 20 } }).setOrigin(0.5);
            this.cards.push(card);
        }

        // Drag events
        this.input.setDraggable(this.cards);
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.locked) return;
            gameObject.setFillStyle(0x00796b, 1);
            gameObject.textObj.setColor('#fff');
            this.draggingCard = gameObject;
        });
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.locked) return;
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.textObj.x = dragX;
            gameObject.textObj.y = dragY;
        });
        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject.locked) return;
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
        // The correct order is whatever array was chosen (ignore buffer zone)
        let order = this.sections.slice().sort((a, b) => {
            // Use the order in the original array (not shuffled)
            const arr = [
                'Pastern & Coffin Bone',
                'Fetlock Joint',
                'Cannon Bone',
                'Carpus (Knee)',
                'Scapula (Shoulder Blade)',
                'Hock',
                'Stifle',
                'Pelvis'
            ];
            return arr.indexOf(a.region) - arr.indexOf(b.region);
        }).slice(0, this.sections.length);

        let correctCount = 0;
        for (let i = 0; i < order.length; i++) {
            let card = this.cards.find(c => c.x === this.dropZones[i].x && c.y === this.dropZones[i].y);
            if (card && card.data.region === order[i].region) {
                card.locked = true;
                card.setFillStyle(0x388e3c, 1);
                card.textObj.setColor('#fff');
                correctCount++;
            } else if (card) {
                card.locked = false;
                card.setFillStyle(0xffffff, 1);
                card.textObj.setColor('#222');
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
            this.feedbackText.setColor('#388e3c').setText('Correct!');
        } else {
            this.feedbackText.setColor('#c62828').setText('Keep sorting...');
        }
    }
}

window.Sort = Sort;
