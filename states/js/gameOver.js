var gameOverState = {
    create: function () {
        var scoreLabel = this.game.add.text(canvasWidth/3.5, canvasHeight/3, "Your score is " + score,
            {fontSize: '24px', fill: "#ffffff"});

        var highestScoreLabel = this.game.add.text(canvasWidth/3.5, canvasHeight/3 + 30, "Your Highest Score is " + highestScore,
            {fontSize: '24px', fill: "#ffffff"});

        var playButton = game.add.button(canvasWidth/2, canvasHeight/2,"play",this.restart, this);
        playButton.anchor.setTo(0.5, 0.5);

        score = 0;
        this.game.input.onDown.addOnce(this.restart, this);
    },

    restart: function(){
        game.state.start('menu');
    }
}
