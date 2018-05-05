var gameOverState = {
    create: function () {
        game.add.sprite(0,0, "background");
        var xPos = canvasWidth/2;
        var yPos = 0.3*canvasHeight;

        var scoreLabelFormat = gameController.createFormatting("bold 70px Corbel", "#003366");
        var scoreLabel = this.game.add.text(xPos, yPos, "Final score: " + gameController.score,
           scoreLabelFormat);
        scoreLabel.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);

        yPos+=canvasHeight*0.1;
        var highScoreLabelFormat = gameController.createFormatting("bold 70px Corbel", "#003366");
        var highestScoreLabel = this.game.add.text(xPos, yPos, "High score: " + gameController.highestScore, highScoreLabelFormat);
        highestScoreLabel.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);

        yPos+=canvasHeight*0.1;
        var playAgainButtonFormat = gameController.createFormatting("bold 50pt Corbel", "#003366");
        var playAgainButton = this.game.add.text(xPos, yPos, "Play Again", playAgainButtonFormat);
        playAgainButton.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);
        playAgainButton.inputEnabled = true;
        playAgainButton.events.onInputDown.add(this.restart, this);

        yPos+=canvasHeight*0.1;
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
