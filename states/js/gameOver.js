var gameOverState = {
    create: function () {
        game.add.sprite(0,0, "background");
        var scoreLabel = this.game.add.text(canvasWidth/2, 0.3*canvasHeight, "Final score: " + score,
            {font: 'bold 70px Corbel', fill: "#003366"});
        scoreLabel.anchor.setTo(0.5, 0.5);

        var highestScoreLabel = this.game.add.text(canvasWidth/2, 0.4*canvasHeight, "High score: " + highestScore,
            {font: 'bold 70px Corbel', fill: "#003366"});
        highestScoreLabel.anchor.setTo(0.5, 0.5);

        var playAgainButtonFormatting = {font: "bold 50pt Corbel", fill: "#003366"};
        playAgainButtonFormatting.stroke = "#000000";
        playAgainButtonFormatting.strokeThickness = 1;

        var playAgainButton = this.game.add.text(canvasWidth/2, 0.65*canvasHeight, "Play Again", playAgainButtonFormatting);
        playAgainButton.anchor.setTo(0.5, 0.5);
        playAgainButton.inputEnabled = true;
        playAgainButton.events.onInputDown.add(this.restart, this);

        //this.game.input.onDown.addOnce(this.restart, this);
    },

    restart: function(){
        this.reset();
        this.game.state.start('play');
        backgroundMusic.play();
    },
    
    reset: function () {
        currentTime=0;
        lives = 3;
        regularEggProb = 1;
        bombProb = 0;
        scoreBoostProb = 0;
        frenzyProb = 0;
        comboProb = 0;
        oneUpProb = 0;
        score = 0;
    }
};
