/**
 * This is a transition state that switches the game from the frenzy state to the play state.
 */

var transitionFromFrenzyState = {

    create: function(){
        gameController.createScoreText();
        gameController.createLifeBuckets();

        var frenzyCompleteText =  gameController.displayFlashingFrenzyText("FRENZY\nCOMPLETE!", 140)
        let totalPts = frenzyState.numberOfEggsCollected * frenzyState.frenzyEggPoints;

        let totalPtsFormat = {
            font: "bold 100px Arial", 
            align: 'center',
            fill: "rgb(0, 0, 0)"
        };
        totalPtsText = game.add.text(game.world.centerX, game.world.centerY + frenzyCompleteText.height*0.7, 
            `+${totalPts} points`, totalPtsFormat);
        totalPtsText.anchor.setTo(0.5, 0.5);

        let eggsCollectedFormat = {
            font: "bold 60px Arial", 
            align: 'center',
            fill: "rgb(124, 2, 103)",
        };
        eggsCollectedText = game.add.text(game.world.centerX, game.world.centerY + frenzyCompleteText.height*1.0, 
            `${frenzyState.numberOfEggsCollected} eggs collected`, eggsCollectedFormat);
        eggsCollectedText.anchor.setTo(0.5, 0.5);

        game.time.events.add(1400, function(){
            this.game.state.start('play');
        }, this);
    },
};