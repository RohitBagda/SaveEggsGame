var gameOverState = {
    create: function () {
        game.add.sprite(0,0, "background");
        var scoreLabel = this.game.add.text(canvasWidth/3.5, canvasHeight/3, "Your score is " + score,
            {fontSize: '50px', fill: "#ff0000"});

        var highestScoreLabel = this.game.add.text(canvasWidth/3.5, canvasHeight/3 + 100, "Your Highest Score is " + highestScore,
            {fontSize: '48px', fill: "#ff00ff"});

        var playButton = game.add.button(canvasWidth/2, canvasHeight/2,"play",this.restart, this);
        playButton.anchor.setTo(0.5, 0.5);

        score = 0;
        //this.game.input.onDown.addOnce(this.restart, this);
    },

    restart: function(){
        this.reset();
        this.game.state.start('play');
    },
    
    reset: function () {
        currentTime=0;
        lives = 3;
    }
};
