var game;

var canvasWidth = 1000;//window.innerWidth;
var canvasHeight = 1605;//window.innerHeight;
var scaleRatio = 2.2;//window.devicePixelRatio/1.2;

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
        game.state.add('gameOver', gameOverState);

        // Start the game
        game.state.start('boot');
    },
};

app.initialize();