var tutorialState = {
    create: function () {
        game.add.sprite(0,0, "background");

        var homeButtonFormatting = {font: "bold 48pt Corbel", fill: "#003366"};
        homeButtonFormatting.stroke = "#000000";
        homeButtonFormatting.strokeThickness = 1;

        var aboutButton = this.game.add.text(canvasWidth/2, 0.85 * canvasHeight, "Back To Main Menu", homeButtonFormatting);
        aboutButton.anchor.setTo(0.5, 0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.goToHome, this);
    },

    goToHome: function(){
        this.game.state.start('menu');
    }

};
