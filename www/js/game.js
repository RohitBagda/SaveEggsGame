/**
 * Creates a new game, assigns the width and height of the game window
 */
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameDiv');

// Add states here
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('tutorial', tutorialState);
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
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var scaleRatio = window.devicePixelRatio/1.2;

