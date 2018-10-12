/**
 * This is the screen that summarizes the game results when the user loses and the game ends
 */

var gameOverState = {
    create: function () {
        // gameController.addBackground();
        var xPos = canvasWidth/2;
        var yPos = 0.3*canvasHeight;

        // Displays the user's final score for the most recent session
        var scoreLabelFormat = gameController.createFormatting("bold 70px Corbel", "#003366");
        var scoreLabel = this.game.add.text(xPos, yPos, "Final score: " + gameController.score, scoreLabelFormat);
        scoreLabel.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);

        yPos+=canvasHeight*0.1;

        // Displays the highest score achieved during the current game session (since the app was opened)
        var highScoreLabelFormat = gameController.createFormatting("bold 70px Corbel", "#003366");
        var highestScoreLabel = this.game.add.text(xPos, yPos, "High score: " + gameController.highestScore,
            highScoreLabelFormat);
        highestScoreLabel.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);

        yPos+=canvasHeight*0.1;

        // Displays the button that allows the user to play the game again
        var playAgainButtonFormat = gameController.createFormatting("bold 50pt Corbel", "#003366");
        var playAgainButton = this.game.add.text(xPos, yPos, "Play Again", playAgainButtonFormat);
        playAgainButton.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);
        playAgainButton.inputEnabled = true;
        playAgainButton.events.onInputDown.add(this.restart, this);

        yPos+=canvasHeight*0.1;

        // Displays the button that allows the user to return to the main menu
        homeButtonFormat = gameController.createFormatting("bold 70px Corbel", "#003366");
        var homeButton = this.game.add.text(xPos, yPos, "Home", homeButtonFormat);
        homeButton.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);
        homeButton.inputEnabled = true;
        homeButton.events.onInputDown.add(this.goToHome, this);
    },

    restart: function(){
        gameController.resetGameComponents();
        this.game.state.start('play');
        backgroundMusic.play();
    },

    goToHome: function(){
        gameController.resetGameComponents();
        this.game.state.start('menu');
        backgroundMusic.play();
    }

};
