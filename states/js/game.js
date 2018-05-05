//Create a new game and assign the width and height of the
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gameDiv');

// Add States here
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('tutorial', tutorialState);
game.state.add('frenzy', frenzyState);
game.state.add('play', playState);
game.state.add('combo', comboState);
// game.state.add('gameData', gameData);
game.state.add('transitionToCombo', transitionToComboState);
game.state.add('transitionToFrenzy', transitionToFrenzyState);
game.state.add('gameOver', gameOverState);
game.state.add('attract', attractState);
// game.state.add('lifeSymbol', life);

// game.state.add('frenzy', frenzyState);
// game.state.add('gameOver', gameOverState);

// Start the game
game.state.start('boot');


var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var scaleRatio = window.devicePixelRatio/1.2;

