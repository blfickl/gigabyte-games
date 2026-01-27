// Phaser 3 Scene: Match Game with Video Intro and Drag-and-Drop
window.Match = class Match extends Phaser.Scene {
    constructor() {
        super('MatchScene');
    }

    preload() {
        // Replace with your Azure Blob video URL and horse image URL
        // Video temporarily disabled due to CORS issues
        this.load.image('horse', 'https://gigabytecontent.blob.core.windows.net/quests/quest1.jpg');
        // Add error handling for image load
        this.load.on('loaderror', (file) => {
            if (file.key === 'horse') {
                alert('Failed to load horse image. Please check the URL or CORS settings.');
            }
        });
        // No need to load images for draggable items; will use text
    }

    create() {
        // Show horse and draggables immediately (video disabled)
        this.showHorseAndDraggables();
    }

    showHorseAndDraggables() {
        // Draw a visible white grid overlay (100x100 squares) below the image


        // Show horse image
        const horse = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'horse').setOrigin(0.5);
        // Draggable text items
        const labels = [
            { name: 'croup', x: 100, y: 500 },
            { name: 'poll', x: 200, y: 500 },
            { name: 'withers', x: 300, y: 500 }
        ];
        labels.forEach(label => {
            const text = this.add.text(label.x, label.y, label.name, {
                font: '24px Arial',
                color: '#333',
                backgroundColor: '#f0f0f0',
                padding: { left: 8, right: 8, top: 4, bottom: 4 }
            }).setInteractive({ draggable: true });
            text.name = label.name;
            text.defaultBg = '#f0f0f0';
            this.input.setDraggable(text);
        });
        // Drop zones (hidden places)
        const dropZones = [
            { name: 'ears', x: horse.x - 50, y: horse.y - 120 },
            { name: 'poll', x: horse.x, y: horse.y - 100 },
            // Withers: center, 1/4 from top
            { name: 'withers', x: this.cameras.main.centerX, y: this.cameras.main.height * 0.25 }
        ];
        dropZones.forEach(zone => {
            const dz = this.add.zone(zone.x, zone.y, 80, 40).setRectangleDropZone(80, 40);
            dz.name = zone.name;
        });
        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setAlpha(0.5);
        });
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setAlpha(1);
            if (!dropped) {
                // Optionally snap back to original position if not dropped on a zone
            }
        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (gameObject.name === dropZone.name) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.setAlpha(1);
                // Change background to light brown on correct snap
                gameObject.setStyle({ backgroundColor: '#e6c29c' });
            } else {
                // Incorrect placement feedback
                gameObject.setStyle({ backgroundColor: gameObject.defaultBg });
            }
        });
    }
};
