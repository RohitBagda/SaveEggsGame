var menuState = {

    create : function(){
        game.add.sprite(0,0, "background");
        var nameLabel = game.add.sprite(canvasWidth/2,canvasHeight/5, "gametitle");
        nameLabel.anchor.setTo(0.5,0.5);

        var playButton = game.add.button(canvasWidth/2, canvasHeight/2,"play",this.start, this);
        playButton.anchor.setTo(0.5, 0.5);
        playButton.inputEnabled = true;

        var verticalSpaceBetweenButtons = 140;

        var aboutButtonFormatting = {font: "bold 56pt Corbel", fill: "#003366"};
        aboutButtonFormatting.stroke = "#000000";
        aboutButtonFormatting.strokeThickness = 1;

        var aboutButton = this.game.add.text(canvasWidth/2, canvasHeight/2 + verticalSpaceBetweenButtons, "How To Play", aboutButtonFormatting);
        aboutButton.anchor.setTo(0.5, 0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.goToAboutPage, this);


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
    }

};
