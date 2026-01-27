// Spelling.js - Main scene for muscle spelling game
class Spelling extends Phaser.Scene {
            showWordPopup(muscle) {
                // Popup background
            // Popup background (wider, moved down)
            const popupWidth = Math.min(440, this.scale.width-20);
            const popupY = 420;
            const popupBg = this.add.rectangle(this.scale.width/2, popupY, popupWidth, 220, 0xffffff, 0.98).setStrokeStyle(3, 0x00796b);
            // Placeholder for image
            const imgBox = this.add.rectangle(this.scale.width/2, popupY - 60, 120, 80, 0xf0f0f0, 1).setStrokeStyle(2, 0xcccccc);
            const imgText = this.add.text(this.scale.width/2, popupY - 60, 'Image\nPlaceholder', { font: '16px Arial', color: '#888', align: 'center' }).setOrigin(0.5);
            // Muscle name in bold at top
            const wordText = this.add.text(this.scale.width/2, popupY - 30, muscle.name, { font: 'bold 22px Arial', color: '#111', align: 'center' }).setOrigin(0.5);
            // Answer text (educational prompt)
            const answerText = this.add.text(this.scale.width/2, popupY, muscle.answer, { font: '18px Arial', color: '#222', wordWrap: { width: popupWidth - 40 }, align: 'center' }).setOrigin(0.5);
            // Pronunciation text (if available)
            let pronTextObj = null;
            if (muscle.pronunciations && muscle.pronunciations.length > 0) {
                pronTextObj = this.add.text(this.scale.width/2, popupY + 50, 'Pronunciation: ' + muscle.pronunciations.join(', '), { font: '16px Arial', color: '#00796b', align: 'center', wordWrap: { width: popupWidth - 40 } }).setOrigin(0.5);
            }
            // Dismiss 'X' button in top right of popup
        const closeBtn = this.add.text(this.scale.width/2 + popupWidth/2 - 20, popupY - 90, '✕', { font: '28px Arial', color: '#c62828', backgroundColor: '#fff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(1000);
        closeBtn.on('pointerup', () => {
                // Only close popup, do not advance word
                popupBg.destroy();
                imgBox.destroy();
                imgText.destroy();
                wordText.destroy();
                answerText.destroy();
                closeBtn.destroy();
                if (pronTextObj) pronTextObj.destroy();
        });
            }
        showEndPopup() {
            // Educational bullets
            const bullets = [
                'A healthy back allows the horse to lift, swing, and carry with ease',
                'Poor saddle fit or incorrect riding can cause pain or conditions like kissing spine',
                'Understanding anatomy helps riders support the horse\'s movement, not block it',
                'Where does your horse\'s movement begin?',
                'Can you feel the swing of the longissimus?'
            ];
            // Pick a random bullet
            const bullet = bullets[Math.floor(Math.random() * bullets.length)];
            // Popup background
            const popupBg = this.add.rectangle(this.scale.width/2, this.scale.height/2, Math.min(340, this.scale.width-40), 260, 0xffffff, 0.98).setStrokeStyle(3, 0x00796b);
            // Placeholder for image
            const imgBox = this.add.rectangle(this.scale.width/2, this.scale.height/2 - 50, 120, 80, 0xf0f0f0, 1).setStrokeStyle(2, 0xcccccc);
            const imgText = this.add.text(this.scale.width/2, this.scale.height/2 - 50, 'Image\nPlaceholder', { font: '16px Arial', color: '#888', align: 'center' }).setOrigin(0.5);
            // Bullet text
            const bulletText = this.add.text(this.scale.width/2, this.scale.height/2 + 30, bullet, { font: '18px Arial', color: '#222', wordWrap: { width: Math.min(320, this.scale.width-60) }, align: 'center' }).setOrigin(0.5);
            // Dismiss button
            const btn = this.add.rectangle(this.scale.width/2, this.scale.height/2 + 100, 100, 36, 0x00796b, 1).setInteractive();
            const btnText = this.add.text(this.scale.width/2, this.scale.height/2 + 100, 'Close', { font: '20px Arial', color: '#fff' }).setOrigin(0.5);
            btn.on('pointerdown', () => {
                popupBg.destroy(); imgBox.destroy(); imgText.destroy(); bulletText.destroy(); btn.destroy(); btnText.destroy();
            });
        }
    constructor() {
        super({ key: 'Spelling' });
    }

    preload() {
        // Preload assets here if needed
    }

    create() {
            // Masked word display (underscores and revealed letters)
            this.wordText = this.add.text(this.scale.width/2, 130, this.getMaskedWord(), { font: '32px Arial', color: '#005' }).setOrigin(0.5);
        // On-screen letter buttons (A-Z) over four lines (7-7-6-6)
        this.letterButtons = {};
        const letterRows = [
            'ABCDEFG',
            'HIJKLMN',
            'OPQRSTU',
            'VWXYZ'
        ];
        const btnSize = 40;
        const btnMargin = 10;
        const totalRows = letterRows.length;
        const gridHeight = totalRows * btnSize + (totalRows - 1) * btnMargin;
        // Move the letter grid lower on the screen (e.g., +80px offset)
        const startY = 330 - gridHeight/2;
        for (let row = 0; row < letterRows.length; row++) {
            const rowStr = letterRows[row];
            const cols = rowStr.length;
            const startX = this.scale.width/2 - ((cols * (btnSize + btnMargin) - btnMargin) / 2) + btnSize/2;
            for (let col = 0; col < cols; col++) {
                const letter = rowStr[col];
                const x = startX + col * (btnSize + btnMargin);
                const y = startY + row * (btnSize + btnMargin);
                const btn = this.add.rectangle(x, y, btnSize, btnSize, 0xffffff, 1).setStrokeStyle(2, 0x00796b).setInteractive();
                const txt = this.add.text(x, y, letter, { font: '22px Arial', color: '#00796b' }).setOrigin(0.5);
                btn.on('pointerdown', () => {
                    if (!btn.disabled) {
                        btn.setFillStyle(0xcccccc, 1);
                        txt.setColor('#888');
                        btn.disabled = true;
                        this.handleLetterGuess({ key: letter });
                    }
                });
                this.letterButtons[letter.toLowerCase()] = { btn, txt };
            }
        }
            // Debug text to show key events
        //    this.debugText = this.add.text(10, this.scale.height - 30, '', { font: '16px Arial', color: '#c62828' }).setOrigin(0, 1);
        this.muscles = [
            { name: 'Longissimus dorsi', prompt: "Primary mover, supports posture and propulsion", answer: "Can you feel the swing of the longissimus? ", pronunciations: ["long-iss-EE-mus DOR-sigh"] },
            { name: 'Multifidus', prompt: "Deep stabilizer, protects spine and aids coordination", answer: "Where does your horse's movement begin?", pronunciations: ["mul-TIF-i-dus"] },
            { name: 'Serratus ventralis', prompt: "Connects spine to shoulder, helps lift the back", answer: "A healthy back allows the horse to lift, swing, and carry with ease", pronunciations: ["ser-RAY-tus VEN-tral-is"] }, 
            { name: 'Iliocostalis', prompt: "Supports lateral movement and rib mobility" , answer: "Poor saddle fit or incorrect riding can cause pain or conditions like kissing spine", pronunciations: ["ill-ee-oh-COS-tal-is"]  },
            { name: 'Spinalis thoracis', prompt: "Assists in spinal extension and posture" , answer: "Understanding anatomy helps riders support the horse's movement, not block i", pronunciations: ["SPY-nal-is thor-ASS-is"] }
        ];
        this.current = 0;
        this.score = 0;
        this.guessedLetters = [];
        this.maxErrors = 15;
        this.errors = 0;

        this.add.text(this.scale.width/2, 40, 'Muscle Spelling Game', { font: '28px Arial', color: '#222' }).setOrigin(0.5);
        // Move prompt higher so it's always visible above the letter grid
        this.promptText = this.add.text(this.scale.width/2, 180, this.muscles[this.current].prompt, { font: '20px Arial', color: '#333', wordWrap: { width: this.scale.width - 40 } }).setOrigin(0.5);
        this.promptText.setY(180); // You can adjust this value (e.g., 160 or 150) if you want it even higher
   
        this.feedbackText = this.add.text(this.scale.width/2, 320, '', { font: '24px Arial', color: '#c62828' }).setOrigin(0.5);

        this.stickHorseText = this.add.text(this.scale.width - 20, 40, '', { font: '24px Arial', color: '#c62828', align: 'right' }).setOrigin(1, 0);

        // Remove keyboard input for mobile/tablet friendliness
    }

    getMaskedWord() {
        // Show guessed letters, keep spaces
        if (!this.muscles || !this.muscles[this.current] || !this.muscles[this.current].name) {
            return '';
        }
        const answer = this.muscles[this.current].name;
        let masked = '';
        for (let i = 0; i < answer.length; i++) {
            const c = answer[i];
            if (c === ' ') {
                masked += ' ';
            } else if (this.guessedLetters.includes(c.toLowerCase())) {
                masked += c;
            } else {
                masked += '_';
            }
        }
        return masked;
    }

    handleKey(event) {
        // (Unused in hangman mode)
    }

    handleLetterGuess(event) {
        // Only process single alphabetic keys
        if (event.key && event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
            const letter = event.key.toLowerCase();
            if (!this.guessedLetters.includes(letter)) {
                this.guessedLetters.push(letter);
                const answer = this.muscles[this.current].name.toLowerCase();
                if (!answer.includes(letter)) {
                    this.errors++;
                    this.feedbackText.setColor('#c62828').setText('Incorrect!');
                } else {
                    this.feedbackText.setColor('#388e3c').setText('Correct!');
                }
                this.updateGameState();
            } else {
                this.feedbackText.setColor('#c62828').setText('Already guessed!');
            }
            // Grey out button if not already
            if (this.letterButtons && this.letterButtons[letter]) {
                this.letterButtons[letter].btn.setFillStyle(0xcccccc, 1);
                this.letterButtons[letter].txt.setColor('#888');
                this.letterButtons[letter].btn.disabled = true;
            }
        }
        // Removed inputDisplay update (no longer shown)
    }

    updateGameState() {
        // Update masked word
        if (this.wordText) {
            this.wordText.setText(this.getMaskedWord());
        }
        // Show guessed letters
        if (this.guessedText) {
            this.guessedText.setText('Guessed: ' + this.guessedLetters.join(', '));
        }
        // Show stick horse (hangman) progress
        if (this.stickHorseText) {
            this.stickHorseText.setText('Errors: ' + this.errors + ' / ' + this.maxErrors);
        }
        // Check win/lose
        const answer = this.muscles[this.current].name;
        const masked = this.getMaskedWord();
        if (masked === answer) {
            this.score++;
            this.feedbackText.setColor('#388e3c').setText('You got it!');
            // Show word popup, then advance
            this.time.delayedCall(600, () => {
                this.showWordPopup(this.muscles[this.current]);
                this.time.delayedCall(2000, () => this.nextWord(), [], this);
            }, [], this);
        } else if (this.errors >= this.maxErrors) {
            this.feedbackText.setColor('#c62828').setText('Out of guesses! The word was: ' + answer);
            // Show word popup, then advance
            this.time.delayedCall(800, () => {
                this.showWordPopup(this.muscles[this.current]);
                this.time.delayedCall(2000, () => this.nextWord(), [], this);
            }, [], this);
        }
    }

    checkSpelling() {
        // (Unused in hangman mode)
    }

    nextWord() {
        this.current++;
        this.guessedLetters = [];
        // Re-enable all letter buttons
        if (this.letterButtons) {
            for (const letter in this.letterButtons) {
                this.letterButtons[letter].btn.setFillStyle(0xffffff, 1);
                this.letterButtons[letter].txt.setColor('#00796b');
                this.letterButtons[letter].btn.disabled = false;
            }
        }
        this.errors = 0;
        if (this.current < this.muscles.length) {
            // Update masked word and prompt for new word
            if (this.wordText) {
                this.wordText.setText(this.getMaskedWord());
            }
            if (this.promptText) {
                this.promptText.setText(this.muscles[this.current].prompt);
            }
            if (this.feedbackText) {
                this.feedbackText.setText('');
            }
            if (this.guessedText) {
                this.guessedText.setText('');
            }
            if (this.stickHorseText) {
                this.stickHorseText.setText('Errors: 0 / ' + this.maxErrors);
            }
        } else {
            // Removed answerText clear for production
            if (this.wordText) {
                this.wordText.setText('');
            }
            if (this.promptText) {
                this.promptText.setText('All done! Score: ' + this.score + '/' + this.muscles.length);
            }
            // inputDisplay was removed; nothing to clear here
            if (this.feedbackText) {
                this.feedbackText.setText('');
            }
            if (this.guessedText) {
                this.guessedText.setText('');
            }
            if (this.stickHorseText) {
                this.stickHorseText.setText('');
            }
            this.showEndPopup();
        }
    }
}
