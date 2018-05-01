var gameOverState = {
    create: function () {
        game.add.sprite(0,0, "background");
        var scoreLabel = this.game.add.text(canvasWidth/3.5, canvasHeight/3, "Your score is " + score,
            {font: 'bold 50px Corbel', fill: "#ff0000"});

        var highestScoreLabel = this.game.add.text(canvasWidth/3.5, canvasHeight/3 + 100, "Your Highest Score is " + highestScore,
            {font: 'bold 48px Corbel', fill: "#ff00ff"});

        var playAgainButtonFormatting = {font: "bold 70pt Corbel", fill: "#003366"};
        playAgainButtonFormatting.stroke = "#000000";
        playAgainButtonFormatting.strokeThickness = 1;

        var verticalSpaceBetweenButtons = 140;

        var playAgainButton = this.game.add.text(canvasWidth/2, canvasHeight/2 + verticalSpaceBetweenButtons, "Play Again", playAgainButtonFormatting);
        playAgainButton.anchor.setTo(0.5, 0.5);
        playAgainButton.inputEnabled = true;
        playAgainButton.events.onInputDown.add(this.restart, this);

        score = 0;
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
    }
};
