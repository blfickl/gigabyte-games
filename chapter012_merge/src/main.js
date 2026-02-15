const GRID_SIZE = 4;
const CELL_SIZE = 80;
const SHAPE = 'circle';
const COLORS = ['white', 'yellow', 'red', 'blue']; // 0: white, 1: yellow, 2: red, 3: blue

function getNextColor(color) {
    // Custom merge logic: green+green=yellow, yellow+yellow=red, red+red=blue, blue+blue=blue
    switch (color) {
        case 'white': return 'yellow';
        case 'yellow': return 'red';
        case 'red': return 'blue';
        case 'blue': return 'blue'; // blue is the highest, stays blue
        default: return color;
    }
}

class MergeGame extends Phaser.Scene {
    constructor() {
        super('MergeGame');
        this.grid = [];
        this.sprites = [];
    }

    preload() {
        // Load tile images
        this.load.image('white', '../assets/images/white.png');
        this.load.image('yellow', '../assets/images/yellow.png');
        this.load.image('red', '../assets/images/red.png');
        this.load.image('blue', '../assets/images/blue.png');
    }

    create() {
        // On-screen arrow button controls
        if (document.getElementById('arrow-up')) {
            document.getElementById('arrow-up').onclick = () => this.handleMove({ key: 'ArrowUp' });
            document.getElementById('arrow-down').onclick = () => this.handleMove({ key: 'ArrowDown' });
            document.getElementById('arrow-left').onclick = () => this.handleMove({ key: 'ArrowLeft' });
            document.getElementById('arrow-right').onclick = () => this.handleMove({ key: 'ArrowRight' });
        }
        this.grid = [];
        this.sprites = [];
        // Fill grid with nulls (blank spots)
        for (let y = 0; y < GRID_SIZE; y++) {
            this.grid[y] = [];
            this.sprites[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                this.grid[y][x] = null;
                this.sprites[y][x] = null;
            }
        }
        // Place 3 random tiles (like 2048)
        let placed = 0;
        while (placed < 3) {
            let rx = Math.floor(Math.random() * GRID_SIZE);
            let ry = Math.floor(Math.random() * GRID_SIZE);
            if (!this.grid[ry][rx]) {
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.grid[ry][rx] = { shape: SHAPE, color };
                this.sprites[ry][rx] = this.drawShape(rx, ry, SHAPE, color);
                placed++;
            }
        }
        this.input.keyboard.on('keydown', this.handleMove, this);

        // Add swipe gesture support for mobile
        let startX = 0, startY = 0, endX = 0, endY = 0;
        this.input.on('pointerdown', (pointer) => {
            startX = pointer.x;
            startY = pointer.y;
        });
        this.input.on('pointerup', (pointer) => {
            endX = pointer.x;
            endY = pointer.y;
            const dx = endX - startX;
            const dy = endY - startY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
                // Horizontal swipe
                if (dx > 0) {
                    this.handleMove({ key: 'ArrowRight' });
                } else {
                    this.handleMove({ key: 'ArrowLeft' });
                }
            } else if (Math.abs(dy) > 20) {
                // Vertical swipe
                if (dy > 0) {
                    this.handleMove({ key: 'ArrowDown' });
                } else {
                    this.handleMove({ key: 'ArrowUp' });
                }
            }
        });
    }

    drawShape(x, y, shape, color) {
        const px = 40 + x * CELL_SIZE + CELL_SIZE/2;
        const py = 40 + y * CELL_SIZE + CELL_SIZE/2;
        // Remove any previous sprite at this location
        if (this.sprites && this.sprites[y] && this.sprites[y][x]) {
            this.sprites[y][x].destroy();
        }
        // Add a dark circular background
        let bg = this.add.graphics();
        bg.fillStyle(0x222222, 1);
        bg.fillCircle(px, py, 32);
        // Add the image sprite for the color
        let sprite = this.add.image(px, py, color);
        sprite.setDisplaySize(60, 60);
        // Group background and sprite for easy cleanup
        sprite.bg = bg;
        // Return an object with destroy method to clean up both
        return {
            destroy: () => { bg.destroy(); sprite.destroy(); },
        };
    }

    // getColorHex is no longer needed

    handleMove(event) {
        let moved = false;
        if (event.key === 'ArrowLeft') moved = this.move(-1, 0);
        if (event.key === 'ArrowRight') moved = this.move(1, 0);
        if (event.key === 'ArrowUp') moved = this.move(0, -1);
        if (event.key === 'ArrowDown') moved = this.move(0, 1);
        if (moved) {
            this.addRandomGreenShape();
            this.redraw();
            if (this.isGameOver()) {
                this.showGameOverPopup();
            }
        }
    }

    showGameOverPopup() {
        const popupWidth = 320;
        const popupHeight = 180;
        const popupX = this.scale.width / 2;
        const popupY = this.scale.height / 2;
        const popupBg = this.add.rectangle(popupX, popupY, popupWidth, popupHeight, 0xffffff, 0.98).setStrokeStyle(3, 0x388e3c);
        const text = this.add.text(popupX, popupY - 30, 'Game Over!', { font: '28px Arial', color: '#c62828', align: 'center' }).setOrigin(0.5);
        const subtext = this.add.text(popupX, popupY + 10, 'No more moves possible.', { font: '20px Arial', color: '#333', align: 'center' }).setOrigin(0.5);
        const closeBtn = this.add.text(popupX, popupY + popupHeight / 2 - 24, '✕', { font: '28px Arial', color: '#388e3c', backgroundColor: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1000);
        closeBtn.on('pointerup', () => {
            popupBg.destroy();
            text.destroy();
            subtext.destroy();
            closeBtn.destroy();
        });
    }

    isGameOver() {
        // If any cell is empty, not game over
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (!this.grid[y][x]) return false;
            }
        }
        // Check for possible merges
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                let cell = this.grid[y][x];
                if (!cell) continue;
                for (let [dx, dy] of [[1,0],[0,1],[-1,0],[0,-1]]) {
                    let nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                        let neighbor = this.grid[ny][nx];
                        if (neighbor && neighbor.shape === cell.shape && neighbor.color === cell.color && cell.color !== 'blue') {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    addRandomGreenShape() {
        // Find all empty cells
        let empty = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (!this.grid[y][x]) empty.push({x, y});
            }
        }
        if (empty.length === 0) return;
        let idx = Math.floor(Math.random() * empty.length);
        let {x, y} = empty[idx];
        this.grid[y][x] = { shape: SHAPE, color: 'white' };
    }

    move(dx, dy) {
        let moved = false;
        let range = [...Array(GRID_SIZE).keys()];
        if (dx > 0 || dy > 0) range = range.reverse();

        // For each row/column, only allow one merge per move
        for (let i of range) {
            let mergedThisLine = false;
            for (let j of range) {
                let x = dx !== 0 ? j : i;
                let y = dy !== 0 ? j : i;
                let cell = this.grid[y][x];
                if (!cell) continue;
                let nx = x, ny = y;
                while (true) {
                    let tx = nx + dx, ty = ny + dy;
                    if (tx < 0 || tx >= GRID_SIZE || ty < 0 || ty >= GRID_SIZE) break;
                    let target = this.grid[ty][tx];
                    if (!target) {
                        this.grid[ty][tx] = cell;
                        this.grid[ny][nx] = null;
                        nx = tx; ny = ty;
                        moved = true;
                    } else if (
                        !mergedThisLine &&
                        cell.color === target.color &&
                        cell.color !== 'blue'
                    ) {
                        // Merge only once per row/col per move
                        this.grid[ty][tx] = { shape: SHAPE, color: getNextColor(cell.color) };
                        this.grid[ny][nx] = null;
                        mergedThisLine = true;
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        return moved;
    }

    redraw() {
        // Remove all graphics
        for (let row of this.sprites) for (let g of row) if (g) g.destroy();
        this.sprites = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            this.sprites[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                let cell = this.grid[y][x];
                if (cell) {
                    this.sprites[y][x] = this.drawShape(x, y, cell.shape, cell.color);
                } else {
                    this.sprites[y][x] = null;
                }
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    backgroundColor: '#333',
    parent: 'game-container',
    scene: [MergeGame]
};

new Phaser.Game(config);
