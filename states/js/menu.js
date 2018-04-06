var menuState = {

    create : function(){
        var nameLabel = game.add.sprite(window.innerWidth/2,window.innerHeight/5, "gametitle");
        nameLabel.anchor.setTo(0.5,0.5);

        var playButton = game.add.button(window.innerWidth/2, window.innerHeight/2,"play",this.start, this);
        playButton.anchor.setTo(0.5, 0.5);
        // var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        //
        // wkey.onDown.addOnce(this.start, this);
          // var nameLabel = game.add.sprite(160,160,'basket');
          // nameLabel.anchor.setTo(0.5,0.5);
          //
          // var playButton = game.add.button(160, 320, game.world.height-80, 'basket', this.start, this);
          // playButton.anchor.setTo(0.5, 0.5);
    },

    //Start function calls the play state
    start : function(){
        game.state.start('play');
    },
};
