class MazeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MazeScene' });
  }

  preload() {
    // Preload assets here (icons, player, etc.)
  }

  create() {
    this.cameras.main.setBackgroundColor('#f0f8ff');
    this.createMaze();
    this.createPlayer();
    this.createUI();
    this.inputSetup();

    // Show instructions at the start
    this.time.delayedCall(300, () => {
      this.showPopup(
        'Welcome!\n\nCollect all nutrition circles to boost your horse\'s topline score.\n\nAvoid red hazards – they reduce your score!\n\nUse arrow keys or swipe to move.'
      );
    });
  }

  createMaze() {
    // Draw a simple maze grid (6 rows x 6 cols)
    this.mazeRows = 6;
    this.mazeCols = 6;
    this.cellSize = Math.floor(Math.min(this.sys.game.config.width, this.sys.game.config.height) / Math.max(this.mazeRows, this.mazeCols));
    this.mazeOriginX = Math.floor((this.sys.game.config.width - this.cellSize * this.mazeCols) / 2);
    this.mazeOriginY = Math.floor((this.sys.game.config.height - this.cellSize * this.mazeRows) / 2);

    // Simple hardcoded maze: 0 = path, 1 = wall

    // ...existing code for maze, pickups, etc...

    // Define pickup types and their colors
    this.pickupTypes = [
      { key: 'protein', color: 0x4caf50 },
      { key: 'balancer', color: 0xffb300 },
      { key: 'energy', color: 0x1976d2 },
      { key: 'supplement', color: 0xab47bc },
      { key: 'slowfeeder', color: 0x8d6e63 }
    ];

    // Place pickups at fixed open cells (not start)
    this.pickups = [];
    const pickupCells = [
      { row: 0, col: 2, type: 'protein' },
      { row: 2, col: 0, type: 'balancer' },
      { row: 4, col: 3, type: 'energy' },
      { row: 5, col: 5, type: 'supplement' },
      { row: 3, col: 5, type: 'slowfeeder' }
    ];
    for (const cell of pickupCells) {
      const typeObj = this.pickupTypes.find(t => t.key === cell.type);
      const px = this.mazeOriginX + cell.col * this.cellSize + this.cellSize/2;
      const py = this.mazeOriginY + cell.row * this.cellSize + this.cellSize/2;
      const pickup = this.add.circle(px, py, this.cellSize*0.22, typeObj.color).setDepth(3);
      pickup.setData('row', cell.row);
      pickup.setData('col', cell.col);
      pickup.setData('type', cell.type);
      this.pickups.push(pickup);
    }

    // Place hazards at fixed open cells (not start or pickup cells)
    this.hazards = [];
    // Three types: fat token (circle), over-supplement (triangle), underfeeding zone (square)
    const hazardCells = [
      { row: 1, col: 2, type: 'fat' },
      { row: 2, col: 4, type: 'over' },
      { row: 4, col: 0, type: 'under' }
    ];
    for (const cell of hazardCells) {
      if (pickupCells.some(p => p.row === cell.row && p.col === cell.col)) continue;
      const px = this.mazeOriginX + cell.col * this.cellSize + this.cellSize/2;
      const py = this.mazeOriginY + cell.row * this.cellSize + this.cellSize/2;
      let hazard;
      if (cell.type === 'fat') {
        // Fat token: red circle
        hazard = this.add.circle(px, py, this.cellSize*0.22, 0xd32f2f).setDepth(4);
      } else if (cell.type === 'over') {
        // Over-supplement: red triangle
        hazard = this.add.triangle(px, py, 0, this.cellSize*0.3, this.cellSize*0.3, this.cellSize*0.3, this.cellSize*0.15, 0, 0xd32f2f).setDepth(4);
      } else if (cell.type === 'under') {
        // Underfeeding zone: red square
        hazard = this.add.rectangle(px, py, this.cellSize*0.38, this.cellSize*0.38, 0xd32f2f).setDepth(4);
      }
      hazard.setData('row', cell.row);
      hazard.setData('col', cell.col);
      hazard.setData('type', cell.type);
      this.hazards.push(hazard);
    }

    // Add hazard labels directly below each hazard
    for (const cell of hazardCells) {
      if (pickupCells.some(p => p.row === cell.row && p.col === cell.col)) continue;
      const px = this.mazeOriginX + cell.col * this.cellSize + this.cellSize/2;
      const py = this.mazeOriginY + cell.row * this.cellSize + this.cellSize/2;
      let label = '';
      if (cell.type === 'fat') label = 'Fat token';
      else if (cell.type === 'over') label = 'Over-supplement';
      else if (cell.type === 'under') label = 'Underfeeding zone';
      this.add.text(px, py + this.cellSize*0.28, label, { font: '13px Arial', color: '#d32f2f', align: 'center', wordWrap: { width: this.cellSize*1.5 } }).setOrigin(0.5, 0).setDepth(20);
    }
    this.maze = [
      [0, 1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0, 1],
      [0, 0, 0, 1, 0, 0],
      [1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 0, 0]
    ];

    // Draw maze
    for (let row = 0; row < this.mazeRows; row++) {
      for (let col = 0; col < this.mazeCols; col++) {
        const x = this.mazeOriginX + col * this.cellSize;
        const y = this.mazeOriginY + row * this.cellSize;
        if (this.maze[row][col] === 1) {
          // Wall
          this.add.rectangle(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize - 4, this.cellSize - 4, 0x222288).setDepth(1);
        } else {
          // Path (optional: draw faint background)
          this.add.rectangle(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize - 4, this.cellSize - 4, 0xffffff, 0.07).setDepth(0);
        }
      }
    }

    // Define pickup types and their colors
    this.pickupTypes = [
      { key: 'protein', color: 0x4caf50 },
      { key: 'balancer', color: 0xffb300 },
      { key: 'energy', color: 0x1976d2 },
      { key: 'supplement', color: 0xab47bc },
      { key: 'slowfeeder', color: 0x8d6e63 }
    ];

   
  }

  createPlayer() {
    // Add a simple player avatar (circle)
    // Start at top-left open cell (0,0)
    this.playerRow = 0;
    this.playerCol = 0;
    const px = this.mazeOriginX + this.playerCol * this.cellSize + this.cellSize/2;
    const py = this.mazeOriginY + this.playerRow * this.cellSize + this.cellSize/2;
    this.player = this.add.circle(px, py, this.cellSize*0.3, 0x1976d2).setDepth(2);
  }

  createUI() {
    // Add topline score bar
    this.score = 0;
    this.maxScore = 5;
    this.scoreText = this.add.text(this.sys.game.config.width/2, 10, 'Topline Score: 0/5', {
      font: '18px Arial',
      color: '#1976d2',
      fontStyle: 'bold',
      align: 'center',
      backgroundColor: '#fff',
      padding: { left: 10, right: 10, top: 2, bottom: 2 }
    }).setOrigin(0.5, 0).setDepth(10);

    // Popup container (hidden by default)
    this.popupBg = this.add.rectangle(this.sys.game.config.width/2, this.sys.game.config.height/2, Math.min(this.sys.game.config.width*0.8, 320), 120, 0xffffff, 0.98)
      .setStrokeStyle(3, 0x1976d2)
      .setDepth(20)
      .setVisible(false);
    this.popupText = this.add.text(this.sys.game.config.width/2, this.sys.game.config.height/2, '', {
      font: '16px Arial',
      color: '#1976d2',
      align: 'center',
      wordWrap: { width: Math.min(this.sys.game.config.width*0.7, 280) }
    }).setOrigin(0.5).setDepth(21).setVisible(false);
    this.popupActive = false;
  }

  inputSetup() {
    // Add arrow key controls (desktop)
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add swipe controls (mobile)
    this.swipeStart = null;
    this.input.on('pointerdown', pointer => {
      this.swipeStart = { x: pointer.x, y: pointer.y };
    });
    this.input.on('pointerup', pointer => {
      if (!this.swipeStart) return;
      const dx = pointer.x - this.swipeStart.x;
      const dy = pointer.y - this.swipeStart.y;
      const threshold = 30; // minimum swipe distance
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx > 0) this.tryMove(0, 1); // right
        else this.tryMove(0, -1); // left
      } else if (Math.abs(dy) > threshold) {
        if (dy > 0) this.tryMove(1, 0); // down
        else this.tryMove(-1, 0); // up
      }
      this.swipeStart = null;
    });
  }

  tryMove(dRow, dCol) {
    // Check for pickup or hazard at new location before moving
    const targetRow = this.playerRow + dRow;
    const targetCol = this.playerCol + dCol;
    const pickup = this.pickups && this.pickups.find(p => p.active && p.getData('row') === targetRow && p.getData('col') === targetCol);
    const hazard = this.hazards && this.hazards.find(h => h.active !== false && h.getData('row') === targetRow && h.getData('col') === targetCol);
    const newRow = this.playerRow + dRow;
    const newCol = this.playerCol + dCol;
    if (
      newRow >= 0 && newRow < this.mazeRows &&
      newCol >= 0 && newCol < this.mazeCols &&
      this.maze[newRow][newCol] === 0
    ) {
      this.playerRow = newRow;
      this.playerCol = newCol;
      const px = this.mazeOriginX + this.playerCol * this.cellSize + this.cellSize/2;
      const py = this.mazeOriginY + this.playerRow * this.cellSize + this.cellSize/2;
      this.tweens.add({
        targets: this.player,
        x: px,
        y: py,
        duration: 120,
        ease: 'Sine.easeInOut'
      });
      // Collect pickup if present
      if (pickup) {
        pickup.setActive(false).setVisible(false);
        this.score++;
        this.scoreText.setText('Topline Score: ' + this.score + '/' + this.maxScore);
        // Nutrition facts for each pickup type
        const facts = {
          protein: 'Protein (amino acids) is essential for muscle growth and topline development.',
          balancer: 'Ration balancers provide amino acids, vitamins, and minerals without excess calories.',
          energy: 'Horses need enough calories to support work and muscle repair.',
          supplement: 'Use muscle-building supplements wisely—balance is key!',
          slowfeeder: 'Slow feeders mimic natural grazing and reduce stress.'
        };
        const fact = facts[pickup.getData('type')] || '';
        this.showPopup(fact);
      }
      // Trigger hazard if present
      if (hazard) {
        hazard.setActive(false).setVisible(false);
        this.score = Math.max(0, this.score - 1);
        this.scoreText.setText('Topline Score: ' + this.score + '/' + this.maxScore);
        this.showPopup('Hazard! This reduces your topline score. Avoid red hazards!');
      }
    }
  }


  showPopup(text) {
    if (this.popupActive) return;
    this.popupActive = true;
    this.popupBg.setVisible(true);
    this.popupText.setText(text).setVisible(true);
    // Dismiss on tap
    this.input.once('pointerdown', () => {
      this.popupBg.setVisible(false);
      this.popupText.setVisible(false);
      this.popupActive = false;
    });
  }

  update() {
    // Keep score bar and popup centered on resize
    if (this.scoreText) {
      this.scoreText.x = this.sys.game.config.width/2;
    }
    if (this.popupBg && this.popupBg.visible) {
      this.popupBg.x = this.sys.game.config.width/2;
      this.popupBg.y = this.sys.game.config.height/2;
    }
    if (this.popupText && this.popupText.visible) {
      this.popupText.x = this.sys.game.config.width/2;
      this.popupText.y = this.sys.game.config.height/2;
    }
    // Handle player movement (arrow keys)
    if (!this.lastMoveTime) this.lastMoveTime = 0;
    const now = this.time.now;
    const moveDelay = 150;
    if (now - this.lastMoveTime > moveDelay) {
      if (this.cursors.left.isDown) { this.tryMove(0, -1); this.lastMoveTime = now; }
      else if (this.cursors.right.isDown) { this.tryMove(0, 1); this.lastMoveTime = now; }
      else if (this.cursors.up.isDown) { this.tryMove(-1, 0); this.lastMoveTime = now; }
      else if (this.cursors.down.isDown) { this.tryMove(1, 0); this.lastMoveTime = now; }
    }

  }
}

// Attach to window for browser use
window.MazeScene = MazeScene;
