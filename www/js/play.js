/**
 * This is the play state. It is the core of the gameplay.
 */

var playState = {

    TIME_BETWEEN_EGG_DROPS_SECONDS: 0.5,
    lastEggDropTimeSecs: 0,
    eggFallingPaused: false,
    rainbowTextEnabled: false,

    stages: [
        { startTime:  0, probabilities: [1,    0,    0,    0,    0,    0] },
        { startTime:  5, probabilities: [0.8,  0.2,  0,    0,    0,    0] },
        { startTime: 15, probabilities: [0.6,  0.3,  0.1,  0,    0,    0] },
        { startTime: 20, probabilities: [0.5,  0.4,  0.08, 0.02, 0,    0] },
        { startTime: 30, probabilities: [0.45, 0.45, 0.05, 0.02, 0.03, 0],
            probabilitiesWhenHurt: [0.45, 0.45, 0.05, 0.02, 0.02, 0.01] }
    ],

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

        this.currentProbabilities = [];
        this.probablilityMap = [
            gameController.REGULAR_EGG,
            gameController.BOMB,
            gameController.SCORE_BOOST,
            gameController.FRENZY_EGG,
            gameController.COMBO_EGG,
            gameController.ONE_UP,
        ];

        this.calculateEggProbability(gameController.elapsedEggFallingTimeSecs);

        this.lastEggDropTimeSecs = 0;
        this.eggFallingPaused = false;
    },

    render: function(){
        //game.debug.text(game.time.fps || '--', 10, 200, "#00ff00", '100px Courier');

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
        let correctStage = null;
        for(let stage of this.stages) {
            if(time >= stage.startTime) {
                correctStage = stage;
            } else {
                break;
            }
        }

        // Adjust for one-up if necessary
        if(gameController.lives < gameController.maxLives
            && (correctStage.probabilitiesWhenHurt != undefined)) {
            this.currentProbabilities = correctStage.probabilitiesWhenHurt;
        } else {
            this.currentProbabilities =  correctStage.probabilities;
        }
    },

    /**
     * This function handles the aspects of the game that need to be dynamically updated
     */
    update: function(){
        gameController.updateRainbowScoreColor();

        if(this.eggFallingPaused) {
            return;
        }

        gameController.updateEggFallingTimer();
        let dropDiff = gameController.elapsedEggFallingTimeSecs - this.lastEggDropTimeSecs;
        if(dropDiff >= this.TIME_BETWEEN_EGG_DROPS_SECONDS) {
            this.lastEggDropTimeSecs = gameController.elapsedEggFallingTimeSecs;
            this.dropEgg();
        }

        this.calculateEggProbability(gameController.elapsedEggFallingTimeSecs);

        gameController.updateBasketPosition();
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

    pauseEggFalling: function() {
        this.eggFallingPaused = true;

        for(var egg of this.eggs.children){
            // We don't need to store old velocity because it gets reset every frame anyway

            egg.oldGravity = egg.body.gravity.y;
            egg.oldAngularVelocity = egg.body.angularVelocity;

            egg.body.velocity.y = 0;
            egg.body.gravity.y = 0;
            egg.body.angularVelocity = 0;
        }
    },

    resumeEggFalling: function() {
        this.eggFallingPaused = false;

        for(var egg of this.eggs.children){
            egg.body.gravity.y = egg.oldGravity;
            egg.body.angularVelocity = egg.oldAngularVelocity;

            egg.oldGravity = undefined;
            egg.oldAngularVelocity = undefined;
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
                gameController.resetStreakScore();
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
        this.eggGravity = gameController.calculateEggGravity(gameController.elapsedEggFallingTimeSecs);
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
     */
    getEggType: function(){
        let randomNumber = Math.random();
        let totalProbabilitySum = 0;
        for(let i = 0; i < this.currentProbabilities.length; i++) {
            totalProbabilitySum += this.currentProbabilities[i];

            if(randomNumber <= totalProbabilitySum) {
                return this.probablilityMap[i];
            }
        }
        // The only time this will happen is if float imprecision causes the probabilities to sum
        // to slightly less than 1 and the random number is above that sum.
        // It's an incredibly unlikely situation, so we don't need to worry about preserving the
        // probabilities - we just return a regular egg cuz it's the only thing present in every
        // stage.
        return gameController.REGULAR_EGG;
    },

    /**
     * Adds background image, sets bounds of the game world
     */
    setupGame: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight);
        // gameController.addBackground();
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
        gameController.totalRegEggsCaught++;
        if(gameController.totalRegEggsCaught/gameController.currentLevel === gameController.eggsNeededToLevelUp){
            gameController.currentLevel++;
            gameController.updateRegEggPoints(gameController.regEggMultiplier*gameController.regularEggPoints);
        }

        gameController.eggCollect.play();
        this.updateScoreAndPlayAnimation(gameController.getCurrentStreakScore());
    },


    /**
     * Performs the necessary actions when a bomb is caught
     */
    handleBomb: function(){
        gameController.bombCollect.play();
        this.shakeScreen();

        let runOutOfLives = gameController.loseLife(false);

        gameController.explosion.play();
        gameController.resetRegularEggStreak();
        gameController.resetStreakScore();

        this.pauseEggFalling();
        gameController.player.animations.play('explodeBomb').killOnComplete = true;

        gameController.bucketMovementEnabled = false;
        gameController.player.body.enable = false;

        //Timeout for animation to play before the basket is generated again
        game.time.events.add(1200, function() {
            gameController.removeBasket();
            if(!runOutOfLives){
                gameController.createBasket();

                let player = gameController.player;
                player.alpha = 0;
                gameController.bucketMovementEnabled = false;

                let lifeBucket = gameController.getTopVisibleLifeBucket();
                let originalScale = lifeBucket.scale.x;
                let originalPosX = lifeBucket.x;
                let originalPosY = lifeBucket.y;

                scaleTween = game.add.tween(lifeBucket.scale).to( { x: player.scale.x, y: player.scale.y },
                    1000, Phaser.Easing.Cubic.InOut);
        
                moveTween =  game.add.tween(lifeBucket).to( { centerX: player.centerX, centerY: player.centerY },
                    1000, Phaser.Easing.Cubic.InOut);
        
                // Starting both tweens at the same time makes them run in sync.
                scaleTween.start();
                moveTween.start();

                moveTween.onComplete.add(function() {
                    lifeBucket.scale.setTo(originalScale);
                    lifeBucket.x = originalPosX;
                    lifeBucket.y = originalPosY;
                    lifeBucket.alpha = 0;

                    player.alpha = 1.0;
                    gameController.bucketMovementEnabled = true;
                    this.resumeEggFalling();
                }, this)
            } else {
                gameController.checkHighScore();
                backgroundMusic.stop();
                game.state.start("gameOver");
            }
        }, this);
    },

    shakeScreen: function(){
        this.camera.shake(gameController.MAX_CAMERA_SHAKE_INTENSITY, 1000, true, Phaser.Camera.SHAKE_BOTH, true);
    },

    /**
     * Performs the necessary actions when a score boost egg is caught
     */
    handleScoreBoost: function () {
        gameController.streakScore += gameController.scoreBoostPoints*gameController.regularEggPoints;
        gameController.regularEggChain += gameController.scoreBoostPoints;
        this.updateScoreAndPlayAnimation(gameController.streakScore);
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
            gameController.frenzyPoints = gameController.streakScore;
        }
        gameController.resetRegularEggStreak();
        this.game.state.start("transitionToFrenzy");
    },

    /**
     * Performs the necessary actions when a one-up egg is caught
     */
    handleOneUp: function () {
        gameController.eggCollect.play();
        if(gameController.lives < gameController.maxLives) {
            let lifeBucket = gameController.getNextInvisibleLifeBucket();
            gameController.lives++;

            lifeBucket.alpha = 1;

            let finalXPos = lifeBucket.centerX;
            let finalYPos = lifeBucket.centerY;

            lifeBucket.centerX = gameController.player.centerX;
            lifeBucket.centerY = gameController.player.top;
            lifeBucket.rotation = Math.PI;

            moveTween = game.add.tween(lifeBucket.position).to( { x: finalXPos, y: finalYPos },
                1000, Phaser.Easing.Quintic.Out);
    
            rotateTween =  game.add.tween(lifeBucket).to( { rotation: 0 },
                1000, Phaser.Easing.Quintic.Out);
    
            // Starting both tweens at the same time makes them run in sync.
            moveTween.start();
            rotateTween.start();

        }
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
