var bootState = {
    //The create function is a standard Phaser function, and is automatically called
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.state.start('load');

        //scale the game
          // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          // game.scale.pageAlignHorizontally = true;
          // game.scale.setScreenSize();

          //calling the load state

    }
};
