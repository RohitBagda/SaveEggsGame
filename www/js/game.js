var game;
var canvasWidth;
var canvasHeight;
var scaleRatio;

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameDiv');

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

        // Sets up some global variables used throughout different states
        canvasWidth = window.innerWidth * window.devicePixelRatio;
        canvasHeight = window.innerHeight * window.devicePixelRatio;
        scaleRatio = window.devicePixelRatio/1.2;
    },
};

app.initialize();