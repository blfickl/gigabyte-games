const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 700,
    backgroundColor: '#e0f2f1',
    parent: 'game-container',
    scene: [Spelling]
};

window.addEventListener('DOMContentLoaded', () => {
    window.game = new Phaser.Game(config);
    // For mobile input
    const hiddenInput = document.getElementById('mobile-input');
    window.addEventListener('keydown', e => {
        if (window.game && window.game.scene && window.game.scene.keys && window.game.scene.keys['Spelling']) {
            window.game.scene.keys['Spelling'].handleLetterGuess(e);
        }
    });
    hiddenInput.addEventListener('input', e => {
        const val = hiddenInput.value;
        if (val && /^[a-zA-Z]$/.test(val)) {
            const event = { key: val };
            if (window.game && window.game.scene && window.game.scene.keys && window.game.scene.keys['Spelling']) {
                window.game.scene.keys['Spelling'].handleLetterGuess(event);
            }
        }
        hiddenInput.value = '';
    });
    document.body.addEventListener('touchstart', () => {
        hiddenInput.focus();
    });
});
