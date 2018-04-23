var tutorialState = {
    create: function () {
        game.add.sprite(0,0, "background");

        var homeButton = game.add.button(canvasWidth/2, (0.85 * canvasHeight), "Home", this.goToHome, this);
        homeButton.anchor.setTo(0.5, 0.5);
        //this.game.input.onDown.addOnce(this.restart, this);
    },

    goToHome: function(){
        this.game.state.start('menu');
    }

};
