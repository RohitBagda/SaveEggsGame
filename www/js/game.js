var game;

var canvasWidth = 1000;
var canvasHeight = 1750;
var scaleRatio = 2.2;
var deviceName = '';

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'gameDiv', null, true);

        // Add states here
        game.state.add('boot', bootState);
        game.state.add('load', loadState);
        game.state.add('menu', menuState);
        game.state.add('frenzy', frenzyState);
        game.state.add('play', playState);
        game.state.add('combo', comboState);
        game.state.add('transitionToCombo', transitionToComboState);
        game.state.add('transitionFromCombo', transitionFromComboState);
        game.state.add('transitionToFrenzy', transitionToFrenzyState);
        game.state.add('transitionFromFrenzy', transitionFromFrenzyState);
        game.state.add('gameOver', gameOverState);

        // This records the device name for analytics. It is reported at the end of play state.
        deviceName = device.model;

        // Start the game
        game.state.start('boot');
    },
};

app.initialize();