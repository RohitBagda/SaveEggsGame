/**
 * This is a transition state that switches the game from the play state to the combo state.
 */

var transitionFromComboState = {

    create: function(){
        // gameController.addBackground();
        gameController.createScoreText();
        gameController.createLifeBuckets();
        gameController.createPause();

        gameController.createBasket();

        var textObject =  gameController.displayFlashingComboText("COMBO\nCOMPLETE!", 140);

        let format = {
            font: "bold 80px Arial", 
            align: 'center',
            fill: "rgb(0, 0, 0)",
        };
        scoreTextObject = game.add.text(game.world.centerX, game.world.centerY + textObject.height*0.7, 
            "Points earned: " + comboState.totalScore, format);
        scoreTextObject.anchor.setTo(0.5, 0.5);

        game.time.events.add(2500, function(){
            this.game.state.start('play');
        }, this);
    },
};