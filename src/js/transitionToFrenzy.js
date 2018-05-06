/**
 * This is a transition state that switches the game from the play state to the frenzy state.
 */

var transitionToFrenzyState = {

    create: function(){
        this.frenzyTweenDuration = 0;

        gameController.addBackground();

        this.showFrenzyModeAnimation();

        // This loop allows the switch into the frenzy state after 1.5 seconds, during which the frenzy text notification pops up
        game.time.events.loop(300, function(){
            // Console.log(this.frenzyTweenDuration);
            if (this.frenzyTweenDuration >= 1.5){
                // game.time.events.stop();
                this.game.state.start('frenzy');
            } else{
                this.frenzyTweenDuration ++;
            }
        }, this);

    },

    // The frenzy text notification
    showFrenzyModeAnimation: function(){

        var frenzyTextFormat = gameController.createFormatting("bold 200px Times",  "#FF5500");
        var frenzyText = "FRENZY";
        gameController.createTweenAnimation(canvasWidth/2, canvasHeight/2, frenzyText, frenzyTextFormat, 500);
    }

};