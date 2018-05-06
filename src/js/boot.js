/**
 * This state is used to start the Phaser physics engine and launches the load state.
 */
var bootState = {
    //The create function is a standard Phaser function, and is automatically called
    create: function() {

        //Start the game physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
};
