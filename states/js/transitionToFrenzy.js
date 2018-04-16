var transitionToFrenzyState = {
    create: function(){
        this.currentTime = 0;

        game.add.sprite(0,0, "background");

        this.showFrenzyModeAnimation();
        // this.game.state.start('frenzy');

        game.time.events.loop(300, function(){
            // Console.log(this.currentTime);
            if (this.currentTime >= 1){
                // game.time.events.stop();
                this.game.state.start('frenzy');
            } else{
                this.currentTime ++;
            }
        }, this);

    },

    showFrenzyModeAnimation: function(){
        var frenzyTextFormat = {font: "bold 100pt Arial", fill: "#fff"};
        frenzyTextFormat.stroke = "#A4CED9";
        frenzyTextFormat.strokeThickness = 5;
        var frenzyText = "Frenzy";


        this.frenzyTextDisplay = this.game.add.text(game.world.centerX - 133.33333333333334, game.world.centerY - 133.33333333333334, frenzyText, frenzyTextFormat);
        this.game.add.tween(this.frenzyTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 500)
            .onComplete.add(function () {
                console.log("This is called when the tween is done.");
            }, this
        );

    }
};