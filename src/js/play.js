/**
 * This is the play state. It is the core of the gameplay.
 */

var playState = {

    rainbowTextEnabled: false,
    /**
     * This function controls the basic setup of the state once it opens.
     */
    create: function(){
        this.setupGame();
        gameController.setupSounds();
        this.setupPlayer();

        this.eggs = game.add.group();
        gameController.createScoreText();
        gameController.createLifeBuckets();
        gameController.createPause();

        game.time.events.loop(500, this.dropEgg, this);    // drops an egg every 500 milliseconds

        /**
         * increases current time of game by 1 second every 1000 milliseconds
         */
        game.time.events.loop(1000, function(){
            gameController.currentTime++;
            let changeTime = gameController.currentTime;
            if(gameController.timeStages.includes(changeTime)){
                this.calculateEggProbability(changeTime);
            }
        }, this);
    },

    render: function(){
        game.debug.text(game.time.fps || '--', 10, 200, "#00ff00", '100px Courier');

        /* game.debug.body(gameController.player);

        for(var egg of this.eggs.children){
            game.debug.body(egg);
        } */
    },

    /**
     * This calculates the probability of each egg falling depending on the current time
     * @param time - current time in the game
     */
    calculateEggProbability: function(time){
        if(time<gameController.timeStages[0]){
            gameController.setEggProbabilities(1,0,0,0,0,0);
        } else if(gameController.currentTime < gameController.timeStages[1]){
            gameController.setEggProbabilities(0.8,1,0,0,0,0);
        } else if(time < gameController.timeStages[2]){
            gameController.setEggProbabilities(0.6,0.9,1,0,0,0);
        } else if(time < gameController.timeStages[3]){
            gameController.setEggProbabilities(0.5,0.9,0.98,1,0,0);
        } else if(time < gameController.timeStages[4]){
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
        gameController.updateRainbowScoreColor();
        for(var egg of this.eggs.children){
            egg.body.velocity.y= gameController.eggVelocity;    // set initial vertical (y) velocity

            // This checks for collisions between the egg and basket, and otherwise cracks the egg if it has fallen past the basket
            if(game.physics.arcade.overlap(gameController.player, egg)) {
                this.collectEgg(egg);
            // Note: we don't use the player body's bottom because we want eggs to crack when they
            // *visually* go below the bucket, not when they go below the physics body.
            } else if(egg.body.bottom > gameController.player.bottom){
                this.crackEggs(egg);
            }
        }
    },

    /**
     * This cracks the egg and plays the according animation and sound depending on type of egg
     * @param egg
     */
    crackEggs: function(egg){
        egg.rotation = 0;
        egg.body.angularVelocity = 0;
        switch (egg.key){
            case gameController.REGULAR_EGG:
                gameController.resetRegularEggStreak();
                gameController.tweenEgg(gameController.CRACKED_REGULAR_EGG, egg);
                gameController.playEggCrackingSound();
                break;
            case gameController.BOMB:
                gameController.tweenEgg(gameController.BOMB_EXPLOSION_CLOUD, egg);
                gameController.playEggCrackingSound();
                break;
            case gameController.FRENZY_EGG:
                gameController.tweenEgg(gameController.CRACKED_FRENZY_EGG, egg);
                gameController.playEggCrackingSound();
                break;
            case gameController.SCORE_BOOST:
                gameController.tweenEgg(gameController.CRACKED_SCORE_BOOST, egg);
                gameController.playEggCrackingSound();
                break;
            case gameController.COMBO_EGG:
                gameController.tweenEgg(gameController.CRACKED_COMBO, egg);
                gameController.playEggCrackingSound();
                break;
            case gameController.ONE_UP:
                gameController.tweenEgg(gameController.CRACKED_ONE_UP, egg);
                gameController.playEggCrackingSound();
                break;
        }
    },

    dropEgg: function(){
        let eggMinDistanceFromEdge = canvasWidth * 0.1;
        let eggXRangeSize = (canvasWidth - (eggMinDistanceFromEdge * 2));
        var eggX = (Math.random() * eggXRangeSize) + eggMinDistanceFromEdge;
        var eggY = -0.05 * canvasHeight;
        var eggType = this.getEggType();                        // determines the correct egg to drop
        var egg = game.add.sprite(eggX, eggY, eggType);

        // Sets the scale ratio and adds physics properties to the egg
        egg.scale.setTo(scaleRatio);
        egg.anchor.setTo(0.5);
        game.physics.enable(egg, Phaser.Physics.ARCADE);
        this.eggGravity = gameController.calculateEggGravity(gameController.currentTime);
        egg.body.gravity.y = this.eggGravity;

        egg.rotation = Math.random() * 360;
        egg.body.angularVelocity = ((Math.random() - 0.5) * 2) * 720;

        // Since score boost eggs have larger texture (for the glow) we need to adjust their
        // collision body to just be the egg
        if(eggType == gameController.SCORE_BOOST) {
            var normalEggImage = game.cache.getImage(gameController.REGULAR_EGG);
            var normalEggWidth = normalEggImage.width;
            var normalEggHeight = normalEggImage.height;

            var textureCenterX = egg.texture.width / 2;
            var textureCenterY = egg.texture.height / 2;

            egg.body.setSize(normalEggWidth, normalEggHeight, 
                textureCenterX - (normalEggWidth/2), textureCenterY - (normalEggHeight/2));
        }

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
            eggType = gameController.REGULAR_EGG;
        } else if(randomNumber<=gameController.bombProb) {
            eggType = gameController.BOMB;
        } else if(randomNumber<=gameController.scoreBoostProb) {
            eggType = gameController.SCORE_BOOST;
        } else if(randomNumber<=gameController.frenzyProb) {
            eggType = gameController.FRENZY_EGG;
        } else if(randomNumber<=gameController.comboProb) {
            eggType = gameController.COMBO_EGG;
        } else if(randomNumber<=gameController.oneUpProb && gameController.lives<gameController.maxLives){
            eggType = gameController.ONE_UP;
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
        // we make sure camera is at position (0,0)
    },

    setupPlayer: function(){
        gameController.createBasket();
    },

    /**
     * This function determines what happens when the egg falls into the basket
     * @param egg - the egg that fell into the basket
     */
    collectEgg: function(egg){
        switch(egg.key) {
            case gameController.REGULAR_EGG:
                gameController.regularEggChain ++;
                this.handleRegularEgg();
                break;
            case gameController.BOMB:
                this.handleBomb();
                break;
            case gameController.SCORE_BOOST:
                this.handleScoreBoost();
                break;
            case gameController.COMBO_EGG:
                this.handleCombo();
                break;
            case gameController.FRENZY_EGG:
                this.handleFrenzy();
                break;
            case gameController.ONE_UP:
                this.handleOneUp();
                break;
        }

        egg.destroy();
    },

    /**
     * Performs the necessary actions when a regular egg is caught
     */
    handleRegularEgg: function () {
        gameController.eggCollect.play();
        this.updateScoreAndPlayAnimation(gameController.getCurrentStreakScore());
    },


    /**
     * Performs the necessary actions when a bomb is caught
     */
    handleBomb: function(){
        gameController.bombCollect.play();
        this.shakeScreen();
        gameController.decrementLives();
        gameController.hideALifeBucket();
       
        // We don't want combo eggs to fall when the user catches a bomb in the early stages. Without this check combo
        // eggs and one ups will fall during the 1st 60 seconds.
        if(gameController.currentTime>gameController.timeStages[4]){
            gameController.calculateEggProbWithOrWithoutOneUp();
        }
        
        gameController.explosion.play();
        gameController.resetRegularEggStreak();

        //Stopping eggs from falling by pausing all the time events loop to begin explosion animation
        game.time.gamePaused();
        gameController.player.animations.play('explodeBomb');
        gameController.player.inputEnabled = false;
        gameController.player.body.enable = false;

        //Timeout for animation to play before the basket is generated again
        window.setTimeout(function () {
            gameController.removeBasket();
            if(gameController.lives > 0){
                gameController.createBasket();
            }

            //Resuming the time loop after new basket is generated.
            game.time.gameResumed();

            if(gameController.lives === 0){
                gameController.checkHighScore();
                backgroundMusic.stop();
                game.state.start("gameOver");
            }

        }, 1200);
    },

    shakeScreen: function(){
        this.camera.shake(gameController.MAX_CAMERA_SHAKE_INTENSITY, 1000, true, Phaser.Camera.SHAKE_BOTH, true);
    },

    /**
     * Performs the necessary actions when a score boost egg is caught
     */
    handleScoreBoost: function () {
        gameController.regularEggChain += gameController.scoreBoostPoints / gameController.regularEggPoints;
        this.updateScoreAndPlayAnimation(gameController.getCurrentStreakScore());
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

        // When Hosea is done with frenzy improvements make sure to add code that will reset the frenzy points before it
        // returns back to the play state.
        if(gameController.regularEggChain > 0){
            gameController.frenzyPoints = gameController.getCurrentStreakScore();
        }
        gameController.resetRegularEggStreak();
        this.game.state.start("transitionToFrenzy");
    },

    /**
     * Performs the necessary actions when a one-up egg is caught
     */
    handleOneUp: function () {
        gameController.eggCollect.play();
        gameController.incrementLives();
        gameController.unHideLifeBucket();
        gameController.calculateEggProbWithOrWithoutOneUp();
    },

    /**
     * Updates the score by a certain number of points
     * @param points
     */
    updateScoreAndPlayAnimation: function(points){

        
        gameController.displayEpicScoreText(points);
        gameController.updateScore(points);
    },

};