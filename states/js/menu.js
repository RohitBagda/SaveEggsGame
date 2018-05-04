var menuState = {

    create : function(){
        game.add.sprite(0,0, "background");
        var nameLabel = game.add.sprite(canvasWidth/2, 0.3*canvasHeight, "gametitle");
        nameLabel.scale.setTo(0.2*scaleRatio, 0.2*scaleRatio);
        nameLabel.anchor.setTo(0.5,0.5);

        var verticalSpaceBetweenButtons = 140;

        var playButtonFormatting = {font: "bold 70pt Corbel", fill: "#003366"};
        playButtonFormatting.stroke = "#000000";
        playButtonFormatting.strokeThickness = 1;

        var playButton = this.game.add.text(canvasWidth/2, canvasHeight/2 + verticalSpaceBetweenButtons, "Play", playButtonFormatting);
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.start, this);

        var aboutButtonFormatting = {font: "bold 56pt Corbel", fill: "#003366"};
        aboutButtonFormatting.stroke = "#000000";
        aboutButtonFormatting.strokeThickness = 1;

        var aboutButton = this.game.add.text(canvasWidth/2, canvasHeight/1.8 + verticalSpaceBetweenButtons, "How To Play", aboutButtonFormatting);
        aboutButton.anchor.setTo(0.5, 0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.goToAboutPage, this);

        var exitButton = this.game.add.text(canvasWidth/2, canvasHeight/1.6 + verticalSpaceBetweenButtons, "Quit", aboutButtonFormatting);
        exitButton.anchor.setTo(0.5, 0.5);
        exitButton.inputEnabled = true;
        exitButton.events.onInputDown.add(this.shutGame, this);


        // var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        //
        // wkey.onDown.addOnce(this.start, this);
          // var nameLabel = game.add.sprite(160,160,'basket');
          // nameLabel.anchor.setTo(0.5,0.5);
          //
          // var playButton = game.add.button(160, 320, game.world.height-80, 'basket', this.start, this);
          // playButton.anchor.setTo(0.5, 0.5);
    },

    goToAboutPage: function(){
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
