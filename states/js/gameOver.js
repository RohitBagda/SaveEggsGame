var gameOverState = {
    create: function () {
        var scoreLabel = this.game.add.text(window.innerWidth/2 - 10, window.innerHeight/2 - 10, "Your score is " + score,
            {fontSize: '24px', fill: "#ffffff"});

        var highestScoreLabel = this.game.add.text(window.innerWidth/2 - 10, window.innerHeight/2+30, "Your Highest Score is " + highestScore,
            {fontSize: '24px', fill: "#ffffff"});

        this.game.input.onDown.addOnce(this.restart, this);
    },

    restart: function(){
        game.state.start('menu');
    }
}
