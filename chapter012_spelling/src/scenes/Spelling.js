// Spelling.js - Main scene for muscle spelling game
class Spelling extends Phaser.Scene {
    showWordPopup(wordObj) {
        const popupWidth = Math.min(440, this.scale.width-20);
        const popupY = 420;
        const popupBg = this.add.rectangle(this.scale.width/2, popupY, popupWidth, 160, 0xffffff, 0.98).setStrokeStyle(3, 0x00796b);
        const wordText = this.add.text(this.scale.width/2, popupY - 30, wordObj.name, { font: 'bold 22px Arial', color: '#111', align: 'center' }).setOrigin(0.5);
        const answerText = this.add.text(this.scale.width/2, popupY, wordObj.answer, { font: '18px Arial', color: '#222', wordWrap: { width: popupWidth - 40 }, align: 'center' }).setOrigin(0.5);
        let pronTextObj = null;
        if (wordObj.pronunciations && wordObj.pronunciations.length > 0) {
            pronTextObj = this.add.text(this.scale.width/2, popupY + 40, 'Pronunciation: ' + wordObj.pronunciations.join(', '), { font: '16px Arial', color: '#00796b', align: 'center', wordWrap: { width: popupWidth - 40 } }).setOrigin(0.5);
        }
        const closeBtn = this.add.text(this.scale.width/2 + popupWidth/2 - 20, popupY - 70, '✕', { font: '28px Arial', color: '#c62828', backgroundColor: '#fff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(1000);
        closeBtn.on('pointerup', () => {
            popupBg.destroy();
            wordText.destroy();
            answerText.destroy();
            closeBtn.destroy();
            if (pronTextObj) pronTextObj.destroy();
        });
    }
    showEndPopup() {
        const bullets = [
            'Great job exploring horse muscle anatomy!',
            'Each muscle group plays a key role in movement and strength.',
            'Can you spell them all again without hints?',
            'How do these muscles help the horse in daily life?'
        ];
        const bullet = bullets[Math.floor(Math.random() * bullets.length)];
        const popupBg = this.add.rectangle(this.scale.width/2, this.scale.height/2, Math.min(340, this.scale.width-40), 160, 0xffffff, 0.98).setStrokeStyle(3, 0x00796b);
        const bulletText = this.add.text(this.scale.width/2, this.scale.height/2, bullet, { font: '18px Arial', color: '#222', wordWrap: { width: Math.min(320, this.scale.width-60) }, align: 'center' }).setOrigin(0.5);
        const btn = this.add.rectangle(this.scale.width/2, this.scale.height/2 + 60, 100, 36, 0x00796b, 1).setInteractive();
        const btnText = this.add.text(this.scale.width/2, this.scale.height/2 + 60, 'Close', { font: '20px Arial', color: '#fff' }).setOrigin(0.5);
        btn.on('pointerdown', () => {
            popupBg.destroy(); bulletText.destroy(); btn.destroy(); btnText.destroy();
        });
    }
    constructor() {
        super({ key: 'Spelling' });
    }

    preload() {}

    create() {
        // List of muscle word objects (with name, prompt, answer, pronunciations)
        const allWords = [
            {
                name: 'Gluteal muscles',
                prompt: 'Spell the main muscles of the horse’s hindquarters (including biceps femoris, semitendinosus, semimembranosus).',
                answer: 'Gluteal muscles',
                pronunciations: ['GLOO-tee-ul']
            },
            {
                name: 'Quadriceps',
                prompt: 'Spell the large muscle group at the front of the thigh.',
                answer: 'Quadriceps',
                pronunciations: ['KWOD-rih-seps']
            },
            {
                name: 'Serratus ventralis',
                prompt: 'Spell the muscle that helps suspend the trunk between the forelimbs.',
                answer: 'Serratus ventralis',
                pronunciations: ['seh-RAY-tus ven-TRAL-iss']
            },
            {
                name: 'Brachiocephalicus',
                prompt: 'Spell the long muscle running from the head/neck to the upper arm.',
                answer: 'Brachiocephalicus',
                pronunciations: ['bray-kee-oh-sef-AL-ih-kus']
            },
            {
                name: 'Pectoral muscles',
                prompt: 'Spell the group of muscles on the chest that help move the forelimb.',
                answer: 'Pectoral muscles',
                pronunciations: ['PEK-tor-ul']
            }
        ];
        Phaser.Utils.Array.Shuffle(allWords);
        this.muscles = allWords.slice(0, 5);
        this.current = 0;
        this.score = 0;
        this.guessedLetters = [];
        this.maxErrors = 15;
        this.errors = 0;

        this.wordText = this.add.text(this.scale.width/2, 130, this.getMaskedWord(), { font: '32px Arial', color: '#005' }).setOrigin(0.5);
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
        this.add.text(this.scale.width/2, 40, 'Muscle Spelling Game', { font: '28px Arial', color: '#222' }).setOrigin(0.5);
        this.promptText = this.add.text(this.scale.width/2, 180, this.muscles[this.current].prompt, { font: '20px Arial', color: '#333', wordWrap: { width: this.scale.width - 40 } }).setOrigin(0.5);
        this.promptText.setY(180);
        this.feedbackText = this.add.text(this.scale.width/2, 500, '', { font: '24px Arial', color: '#c62828' }).setOrigin(0.5);
        this.stickHorseText = this.add.text(this.scale.width - 20, 40, '', { font: '24px Arial', color: '#c62828', align: 'right' }).setOrigin(1, 0);
    }

    getMaskedWord() {
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

    handleLetterGuess(event) {
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
            if (this.letterButtons && this.letterButtons[letter]) {
                this.letterButtons[letter].btn.setFillStyle(0xcccccc, 1);
                this.letterButtons[letter].txt.setColor('#888');
                this.letterButtons[letter].btn.disabled = true;
            }
        }
    }

    updateGameState() {
        if (this.wordText) {
            this.wordText.setText(this.getMaskedWord());
        }
        if (this.stickHorseText) {
            this.stickHorseText.setText('Errors: ' + this.errors + ' / ' + this.maxErrors);
        }
        const answer = this.muscles[this.current].name;
        const masked = this.getMaskedWord();
        if (masked === answer) {
            this.score++;
            this.feedbackText.setColor('#388e3c').setText('You got it!');
            this.time.delayedCall(600, () => {
                this.showWordPopup(this.muscles[this.current]);
                this.time.delayedCall(2000, () => this.nextWord(), [], this);
            }, [], this);
        } else if (this.errors >= this.maxErrors) {
            this.feedbackText.setColor('#c62828').setText('Out of guesses! The word was: ' + answer);
            this.time.delayedCall(800, () => {
                this.showWordPopup(this.muscles[this.current]);
                this.time.delayedCall(2000, () => this.nextWord(), [], this);
            }, [], this);
        }
    }

    nextWord() {
        this.current++;
        this.guessedLetters = [];
        if (this.letterButtons) {
            for (const letter in this.letterButtons) {
                this.letterButtons[letter].btn.setFillStyle(0xffffff, 1);
                this.letterButtons[letter].txt.setColor('#00796b');
                this.letterButtons[letter].btn.disabled = false;
            }
        }
        this.errors = 0;
        if (this.current < this.muscles.length) {
            if (this.wordText) {
                this.wordText.setText(this.getMaskedWord());
            }
            if (this.promptText) {
                this.promptText.setText(this.muscles[this.current].prompt);
            }
            if (this.feedbackText) {
                this.feedbackText.setText('');
            }
            if (this.stickHorseText) {
                this.stickHorseText.setText('Errors: 0 / ' + this.maxErrors);
            }
        } else {
            if (this.wordText) {
                this.wordText.setText('');
            }
            if (this.promptText) {
                this.promptText.setText('All done! Score: ' + this.score + '/' + this.muscles.length);
            }
            if (this.feedbackText) {
                this.feedbackText.setText('');
            }
            if (this.stickHorseText) {
                this.stickHorseText.setText('');
            }
            this.showEndPopup();
        }
    }
}

window.Spelling = Spelling;
