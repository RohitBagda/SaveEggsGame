var transitionToComboState = {
    create: function(){
        this.currentTime = 0;

        game.add.sprite(0,0, "background");

        this.showComboModeAnimation();
        // this.game.state.start('combo');

        game.time.events.loop(300, function(){
            // Console.log(this.currentTime);
            if (this.currentTime >= 1.5){
                // game.time.events.stop();
                this.game.state.start('combo');
            } else{
                this.currentTime ++;
            }
        }, this);

    },

    showComboModeAnimation: function(){

        //var textSize = canvasWidth + "px";
        var comboTextFormat = {font: "bold 200px Times", fill: "#00FF00"};
        comboTextFormat.stroke = "#000000";
        comboTextFormat.strokeThickness = 5;
        var comboText = "COMBO";

        this.comboTextDisplay = this.game.add.text(canvasWidth/2, canvasHeight/2, comboText, comboTextFormat);
        this.comboTextDisplay.anchor.setTo(0.5, 0.5);
        this.comboTextDisplay.align = 'center';
        this.game.add.tween(this.comboTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 500)
            .onComplete.add(function () {
                console.log("This is called when the tween is done.");
            }, this
        );

    }
};