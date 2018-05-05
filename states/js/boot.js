/**
 * This state is used to start the Phaser physics engine and loads the load state.
 * @type {{create: bootState.create}}
 */
var bootState = {
    //The create function is a standard Phaser function, and is automatically called
    create: function() {

        //Start the game physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
};
