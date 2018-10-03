/**
 * This is a transition state that switches the game from the play state to the combo state.
 */

var transitionToComboState = {
    create: function(){
        this.comboTweenDuration = 0;

        gameController.addBackground();

        this.showComboModeAnimation();

        // This loop allows the switch into the combo state after 1.5 seconds, during which the combo text notification pops up
        game.time.events.loop(300, function(){
            if (this.comboTweenDuration >= 1.5){
                this.game.state.start('combo');
            } else{
                this.comboTweenDuration ++;
            }
        }, this);

    },

    // The combo text notification
    showComboModeAnimation: function(){
        var comboTextFormat = gameController.createFormatting("bold 200px Times", "#00FF00");
        var comboText = "COMBO";
        gameController.displayFadingText(canvasWidth/2, canvasHeight/2, comboText, comboTextFormat, 500);
    }
};