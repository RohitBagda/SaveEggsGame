var menuState = {
    verticalSpaceBetweenButtons: 140,
    create : function(){
        //Spacing between "play" and "how to play button"
        this.addBackground();
        this.addLogo();
        this.addPlayButton();
        this.addAboutButton();
        this.addExitButton();

    },

    addBackground: function(){
        gameData.addBackground();
    },

    addPlayButton: function(){
        var playButtonFormat = gameData.createFormatting("bold 70pt Corbel", "#003366");
        var playButton = this.game.add.text(canvasWidth/2, canvasHeight/2 + this.verticalSpaceBetweenButtons,
            "Play", playButtonFormat);
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.start, this);
    },

    addAboutButton: function(){
        var buttonFormat = gameData.createFormatting("bold 56pt Corbel", "#003366");
        var aboutButton = this.game.add.text(canvasWidth/2, canvasHeight/1.6 + this.verticalSpaceBetweenButtons,
            "How To Play", buttonFormat);
        aboutButton.anchor.setTo(0.5, 0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.goToTutorialPage, this);
    },

    addExitButton: function(){
        var buttonFormat = gameData.createFormatting("bold 56pt Corbel", "#003366");
        var exitButton = this.game.add.text(canvasWidth/2, canvasHeight/1.35 + this.verticalSpaceBetweenButtons,
            "Quit", buttonFormat);
        exitButton.anchor.setTo(0.5, 0.5);
        exitButton.inputEnabled = true;
        exitButton.events.onInputDown.add(this.shutGame, this);
    },

    addLogo: function(){
        let nameLabel = game.add.sprite(canvasWidth/2, 0.3*canvasHeight, "gametitle");
        nameLabel.scale.setTo(0.2*scaleRatio, 0.2*scaleRatio);
        nameLabel.anchor.setTo(0.5,0.5);
    },

    goToTutorialPage: function(){
        game.state.start('tutorial');
    },

    //Start function calls the play state
    start : function(){
        game.state.start('play');
    },

    shutGame: function(){
        this.game.destroy();
    }

};
