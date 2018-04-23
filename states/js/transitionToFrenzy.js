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


    calculateOffSet: function(text){

        return 100 * 1/2;

    },

    showFrenzyModeAnimation: function(){

        //var textSize = canvasWidth + "px";
        var frenzyTextFormat = {font: "bold 200px Times", fill: "#000000"};
        frenzyTextFormat.stroke = "#FF5500";
        frenzyTextFormat.strokeThickness = 5;
        var frenzyText = "Frenzy";

        var horizontalOffSet = this.calculateOffSet(frenzyText);
        var verticalOffset = 70;
        console.log("screenwidth: " + canvasWidth);
        console.log("screen center: " + game.world.centerX);
        console.log("horizontal offSet: " + horizontalOffSet);
        console.log("text Position: " + (game.world.centerX - horizontalOffSet));


        this.frenzyTextDisplay = this.game.add.text(canvasWidth/2, canvasHeight/2, frenzyText, frenzyTextFormat);
        this.frenzyTextDisplay.anchor.setTo(0.5, 0.5);
        this.frenzyTextDisplay.align = 'center';
        this.game.add.tween(this.frenzyTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 500)
            .onComplete.add(function () {
                console.log("This is called when the tween is done.");
            }, this
        );

    }
};