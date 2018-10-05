/**
 * This is a transition state that switches the game from the play state to the combo state.
 */

var transitionToComboState = {
    TOTAL_TRANSITION_LENGTH: 2000,

    create: function(){
        gameController.addBackground();
        gameController.createScoreText();
        gameController.createLifeBuckets();
        gameController.createPause();

        gameController.createBasket();

        gameController.displayFlashingComboText("COMBO", 200);

        let transitionStartTime = game.time.time;

        game.time.events.loop(80, function(){
            let tweenLength = 400;

            //Don't make an egg if will be onscreen when we switch to combo state
            if(game.time.time - transitionStartTime < this.TOTAL_TRANSITION_LENGTH - tweenLength) {
                var egg = game.add.sprite(gameController.player.centerX, gameController.player.centerY, gameController.COMBO_EGG);
                egg.anchor.setTo(0.5);
                egg.scale.setTo(scaleRatio, scaleRatio);

                game.add.tween(egg).to({centerY: (0 - egg.height/2), centerX: Math.random() * canvasWidth}, 
                    tweenLength, Phaser.Easing.Linear.None, true);

                gameController.player.bringToTop();
            }
        }, this);

        // This loop allows the switch into the combo state
        game.time.events.add(this.TOTAL_TRANSITION_LENGTH, function(){
            game.state.start('combo');
        }, this);

    },
};