var transitionToFrenzyState = {
    create: function(){
        this.currentTime = 0;

        game.add.sprite(0,0, "background");

        this.showFrenzyModeAnimation();
        // this.game.state.start('frenzy');

        game.time.events.loop(300, function(){
            // Console.log(this.currentTime);
            if (this.currentTime >= 1.5){
                // game.time.events.stop();
                this.game.state.start('frenzy');
            } else{
                this.currentTime ++;
            }
        }, this);

    },

    showFrenzyModeAnimation: function(){

        //var textSize = canvasWidth + "px";
        var frenzyTextFormat = {font: "bold 200px Times", fill: "#FF5500"};
        var frenzyText = "Frenzy";

        this.frenzyTextDisplay = this.game.add.text(canvasWidth/2, canvasHeight/2, frenzyText, frenzyTextFormat);
        this.frenzyTextDisplay.anchor.setTo(0.5, 0.5);
        this.frenzyTextDisplay.align = 'center';
        this.game.add.tween(this.frenzyTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 500);
    }

};