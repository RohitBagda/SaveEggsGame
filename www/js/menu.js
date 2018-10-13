/**
 * This state is responsible for the layout of the menu page of the game
 */

var menuState = {
    verticalSpaceBetweenButtons: 140,    // Spacing between "Play" and "How to Play" buttons
    create : function(){
        this.addBackground();
        this.addLogo();
        this.addPlayButton();

    },

    addBackground: function(){
        gameController.addBackground();
    },

    addPlayButton: function(){
        var playButtonFormat = gameController.createFormatting("bold 70pt Corbel", "#003366");
        var playButton = this.game.add.text(canvasWidth/2, canvasHeight/2 + this.verticalSpaceBetweenButtons,
            "Play", playButtonFormat);
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.start, this);
    },


    addLogo: function(){
        let nameLabel = game.add.sprite(canvasWidth/2, 0.3*canvasHeight, "gametitle");
        nameLabel.scale.setTo(0.2*scaleRatio, 0.2*scaleRatio);
        nameLabel.anchor.setTo(0.5,0.5);
    },

    //Start function calls the play state
    start : function(){
        gameController.resetGameComponents();
        game.state.start('play');
    },

};
