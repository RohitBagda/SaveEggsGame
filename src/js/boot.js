/**
 * This state is used to start the Phaser physics engine and launches the load state.
 */
var bootState = {
    preload: function() {
        game.time.advancedTiming = true;

        //For some reason phaser's default behavior is to reset all input whenever it 
        //switches to a new state, which means if the player holds their thumb down
        //in between states phaser will pretend like they stopped when the state switched.
        //Setting resetLocked to true disables this behavior.
        game.input.resetLocked = true;
    },

    //The create function is a standard Phaser function, and is automatically called
    create: function() {

        //Start the game physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
};
