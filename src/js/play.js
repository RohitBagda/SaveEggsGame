/**
 * This is the play state. It is the core of the gameplay.
 */

var playState = {

    bombDisplayTexts: ["bruh", ":'(", "-_-", "Oops"],    // list of words that can pop up when the user catches a bomb
    timeStages: [5, 15, 20, 30, 60],                     // array of time points that determines the probabilities of different eggs falling based on seconds passed

    /**
     * This function controls the basic setup of the state once it opens.
     */
    create: function(){
        this.setupGame();
        gameController.setupSounds();
        this.setupPlayer();

        this.eggs = game.add.group();
        gameController.createScoreText();
        gameController.createHeart();
        gameController.createPause();

        game.time.events.loop(500, this.dropEgg, this);    // drops an egg every 500 milliseconds

        /**
         * increases current time of game by 1 second every 1000 milliseconds
         */
        game.time.events.loop(1000, function(){
            gameController.currentTime++;
            let changeTime = gameController.currentTime;
            if(this.timeStages.includes(changeTime)){
                this.calculateEggProbability(changeTime);
            }
        }, this);
    },

    render: function(){
        game.debug.text(game.time.fps || '--', 10, 200, "#00ff00", '100px Courier');
    },

    /**
     * This calculates the probability of each egg falling depending on the current time
     * @param time - current time in the game
     */
    calculateEggProbability: function(time){
        if(time<this.timeStages[0]){
            gameController.setEggProbabilities(1,0,0,0,0,0);
        } else if(gameController.currentTime <this.timeStages[1]){
            gameController.setEggProbabilities(0.8,1,0,0,0,0);
        } else if(time < this.timeStages[2]){
            gameController.setEggProbabilities(0.6,0.9,1,0,0,0);
        } else if(time<this.timeStages[3]){
            gameController.setEggProbabilities(0.5,0.9,0.98,1,0,0);
        } else if(time <this.timeStages[4]){
            if(gameController.lives<gameController.maxLives){
                this.calculateEggProbWithOneUP();
            } else {
                this.calculateEggProbWithoutOneUP();
            }
        } 
    },

    /**
     * When there is a one-up (when the user has < 3 lives), the probabilities of the eggs falling are readjusted
     */
    calculateEggProbWithOneUP: function(){
        gameController.setEggProbabilities(0.45,0.9,0.95,0.97,0.99,1);
        // gameController.setEggProbabilities(0.45,0.5,0.6,0.61,0.9,1);
    },

    /**
     * When there cannot be a one-up (when the user has 3 lives), the probabilities of the eggs falling are readjusted
     */
    calculateEggProbWithoutOneUP: function(){
        gameController.setEggProbabilities(0.45,0.9,0.95,0.97,1,0);
    },

    /**
     * This function handles the aspects of the game that need to be dynamically updated
     */
    update: function(){
        for(var i in this.eggs.children){
            var egg = this.eggs.children[i];
            egg.body.velocity.y= gameController.eggVelocity;    // set initial vertical (y) velocity

            // This checks for collisions between the egg and basket, and otherwise cracks the egg if it has fallen past the basket
            if(egg.y <= gameController.player.y - egg.height){
                game.physics.arcade.collide(gameController.player, egg, this.collectEgg, null, this);
            } else if(egg.y > gameController.player.y+gameController.player.height-egg.height){
                this.crackEggs(egg);
            }

        }
    },

    changeToGameOverState: function () {
        // After 100 milliseconds, the game switches to the game over state
        window.setTimeout(function () {
            backgroundMusic.stop();
            game.state.start("gameOver");
        }, 100);
    },

    /**
     * This cracks the egg and plays the according animation and sound depending on type of egg
     * @param egg
     */
    crackEggs: function(egg){
        if(egg.key === "egg"){
            gameController.tweenEgg("crackedEgg", egg);
            gameController.eggCrack.play();
        } else if(egg.key === "bomb") {
            gameController.tweenEgg("bombCloud", egg);
            gameController.bombWhoosh.play();
        } else if(egg.key === "frenzy"){
            gameController.tweenEgg("crackedFrenzy", egg);
            gameController.eggCrack.play();
        }  else if(egg.key === "scoreBoost") {
            gameController.tweenEgg("crackedScoreBoost", egg);
            gameController.eggCrack.play();
        } else if(egg.key === "combo") {
            gameController.tweenEgg("crackedCombo", egg);
            gameController.eggCrack.play();
        } else if(egg.key === "oneUp" ) {
            gameController.tweenEgg("crackedOneUp", egg);
            gameController.eggCrack.play();
        }

    },

    dropEgg: function(){
        let eggOffset = 50;
        var eggX = Math.random() * (canvasWidth-eggOffset);     // selects a random x coordinate on the screen
        var eggY = -0.05 * canvasHeight;
        var eggType = this.getEggType();                        // determines the correct egg to drop
        var egg = game.add.sprite(eggX, eggY, eggType);

        // Sets the scale ratio and adds physics properties to the egg
        egg.scale.setTo(scaleRatio, scaleRatio);
        game.physics.enable(egg, Phaser.Physics.ARCADE);
        this.eggGravity = gameController.calculateEggGravity(gameController.currentTime);
        egg.body.gravity.y = this.eggGravity;
        this.eggs.add(egg);
    },

    /**
     * Randomly selects an egg that will be dropped based on assigned probabilities
     * @returns {*}
     */
    getEggType: function(){
        var eggType;
        var randomNumber = Math.random();
        if(randomNumber <= gameController.regularEggProb){
            eggType = "egg";
        } else if(randomNumber<=gameController.bombProb) {
            eggType = "bomb";
        } else if(randomNumber<=gameController.frenzyProb) {
            eggType = "frenzy";
        } else if(randomNumber<=gameController.comboProb) {
            eggType = "combo";
        } else if(randomNumber<=gameController.scoreBoostProb) {
            eggType = "scoreBoost";
        }  else if(randomNumber<=gameController.oneUpProb && gameController.lives<gameController.maxLives){
            eggType = "oneUp";
        }
        return eggType;
    },

    /**
     * Adds background image, sets bounds of the game world
     */
    setupGame: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight);
        gameController.addBackground();
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    setupPlayer: function(){
        gameController.createBasket();
    },

    /**
     * This function determines what happens when the egg falls into the basket
     * @param player - the basket, which is required by the Phaser library to handle the collision
     * @param egg - the egg that fell into the basket
     */
    collectEgg: function(player, egg){

        egg.kill();

        if (egg.key == "egg") {
            this.handleRegularEgg();
        } else if (egg.key == "bomb") {
            this.handleBomb();
        } else if (egg.key == "scoreBoost") {
            this.handleScoreBoost();
        } else if (egg.key == "combo") {
            this.handleCombo();
        } else if (egg.key == "frenzy") {
            this.handleFrenzy();
        } else if (egg.key == "oneUp"){
            this.handleOneUp();
        }
    },

    /**
     * Performs the necessary actions when a regular egg is caught
     */
    handleRegularEgg: function () {
        gameController.eggCollect.play();
        this.updateScoreAndPlayAnimation(gameController.regularEggPoints);
    },


    /**
     * Performs the necessary actions when a bomb is caught
     */
    handleBomb: function(){
        gameController.bombCollect.play();
        gameController.decrementLives();
        gameController.updateLifeCountLabel();
        this.showBombCaughtText();

        if(gameController.lives<gameController.maxLives){
            this.calculateEggProbability(gameController.currentTime);
        }

        if (gameController.lives==0){
            gameController.checkHighScore();
            this.handlePlayerAtGameEnd();
            this.changeToGameOverState();
        }
    },

    /**
     * Handles what happens when the player loses all their lives
     */
    handlePlayerAtGameEnd: function () {
        gameController.player.inputEnabled = false;
        gameController.player.body.checkCollision.up = false;
        gameController.explosion.play();
        gameController.player.animations.play('explodeBomb');
    },

    /**
     * Randomly selects a string to display when a bomb is caught
     */
    showBombCaughtText: function () {
        var index = Math.floor(Math.random() * 4);
        var bomdDisplayText = this.bombDisplayTexts[index];
        this.showTweenAnimation(bomdDisplayText);
    },

    /**
     * Performs the necessary actions when a score boost egg is caught
     */
    handleScoreBoost: function () {
        this.updateScoreAndPlayAnimation(gameController.scoreBoostPoints);
        gameController.eggCollect.play();
    },

    /**
     * Performs the necessary actions when a combo egg is caught
     */
    handleCombo: function () {
        gameController.eggCollect.play();
        gameController.basketX = gameController.player.x;
        gameController.basketY = gameController.player.y;
        this.game.state.start("transitionToCombo");
    },

    /**
     * Performs the necessary action when a frenzy egg is caught
     */
    handleFrenzy: function () {
        gameController.frenzyCollect.play();
        gameController.frenzyMusic.play();
        backgroundMusic.stop();
        this.game.state.start("transitionToFrenzy");
    },

    /**
     * Performs the necessary actions when a one-up egg is caught
     */
    handleOneUp: function () {
        gameController.eggCollect.play();
        gameController.incrementLives();
        gameController.updateLifeCountLabel();
        if (gameController.lives >= gameController.maxLives) {
            this.calculateEggProbability(gameController.currentTime);
        }
    },

    /**
     * Displays a pop-up text animation on the screen
     * @param display - the expression to be displayed
     */
    showTweenAnimation: function(display){
        var tweenSpeed = 100;
        var tweenTextFormat = gameController.createFormatting("bold 80pt Corbel", "#ff0000");
        gameController.createTweenAnimation(game.world.centerX, game.world.centerY, display, tweenTextFormat, 300, tweenSpeed);
    },

    /**
     * Updates the score by a certain number of points
     * @param points
     */
    updateScoreAndPlayAnimation: function(points){

        this.showTweenAnimation(points);
        gameController.updateScore(points);

    },

};