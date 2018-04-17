var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gameDiv');

// Add States here
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('frenzy', frenzyState);
game.state.add('play', playState);
game.state.add('gameData', gameData);
game.state.add('transitionToFrenzy', transitionToFrenzyState);
game.state.add('gameOver', gameOverState);
game.state.add('attract', attractState);

// game.state.add('frenzy', frenzyState);
// game.state.add('gameOver', gameOverState);

// Start the game
game.state.start('boot');

var score=0;
var highestScore=0;
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var scaleRatio = window.devicePixelRatio/1.2;
var currentTime = 0;
var lives = 3;