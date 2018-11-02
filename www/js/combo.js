/**
 * This object represents the combo state where waves of eggs fall. This state is meant to be a breather for
 * users in between the game where they can catch eggs worth significant amount of points and there are no bombs and penalties for missing eggs.
 */
var comboState = {

    comboTime: 0,
    comboEggCaughtPerWaveCount: 0,
    waveScore: 0,
    comboDuration: 12,
    comboEggsDropDuration: 10,
    eggGapInWave: 100,

    totalScore: 0,

    comboStateHitCounter: 0,
    comboStateEggCounter: 0,
    comboScoreCounter: 0,

    /**
     * The create method in this object, sets up the combo state and is responsible for dropping egg waves, keeping
     * track of the combo duration and going back to the play state.
     */
    create: function(){
        //Setup background, score, lives and pause.
        gameController.createScoreText();
        gameController.createLifeBuckets();
        gameController.createPause();

        this.totalScore = 0;

        this.comboEggPoints=gameController.comboPoints;
        this.comboTime=0;
        this.setupPlayer();
        this.comboEggs = game.add.group();

        //Drop a combo wave every second.
        game.time.events.loop(1000, this.dropComboEggWave, this);

        //Keeps track of combo time and switches back to play when combo time exceeds combo duration.
        game.time.events.loop(1000, function(){
            if(this.comboTime>this.comboDuration){
                this.waveScore = 0;
                gameController.basketX = gameController.player.x;
                gameController.basketY = gameController.player.y;
                this.sendComboStateAnalyticsData();
                this.resetComboStateAnalyticsData();
                this.game.state.start('transitionFromCombo');
            } else {
                this.comboTime++;
            }
        }, this);
    },

    /**
     * This function handles the aspects of the game that need to be dynamically updated.
     */
    update: function(){
        gameController.updateRainbowScoreColor();
        gameController.updateBasketPosition();
        for(var comboEgg of this.comboEggs.children){
            // For each egg in the combo state. Set the initial velocity of the eggs
            comboEgg.body.velocity.y=gameController.eggVelocity;

            // Check for collision between combo egg and basket.
            if(game.physics.arcade.overlap(gameController.player, comboEgg)) {
                this.collectComboEgg(comboEgg);
            // Note: we don't use the player body's bottom because we want eggs to crack when they
            // *visually* go below the bucket, not when they go below the physics body.
            } else if(comboEgg.body.bottom > gameController.player.bottom){
                this.crackComboEgg(comboEgg);
            }
        }

    },

    /**
     * Play combo egg cracking animation and egg cracking sound.
     * @param egg
     */
    crackComboEgg: function(egg){
        gameController.tweenEgg(gameController.CRACKED_COMBO, egg);
        gameController.playEggCrackingSound();
    },

    /**
     * Setup basket for combo state.
     */
    setupPlayer: function(){
        //Create basket player sprite and enable physics
        gameController.createBasket();
    },

    /**
     * Drop a combo wave of 2 to 4 eggs  selected at random.
     */
    dropComboEggWave: function() {
        if (this.comboTime<=this.comboEggsDropDuration) {
            var numEggs = Math.floor(Math.random() * 3) + 2;
            this.createComboWave(numEggs);
            this.comboStateEggCounter += numEggs;
        }
        this.tweenPreviousWaveScore();
    },

    /**
     *  Tween wave score based on number of eggs caught in a wave.
     */
    tweenPreviousWaveScore: function () {
        if (this.waveScore > 0) {
            this.showScoreAnimation(this.waveScore);
            this.waveScore = 0;
        }
        this.comboEggCaughtPerWaveCount = 0;
    },

    /**
     * Create a wave of n eggs.
     * @param numEggs
     */
    createComboWave: function(numEggs){

        var eggX = this.calculateInitialX();
        var xOffset = this.calculateXOffset(eggX);
        var eggY = -0.05 * canvasHeight;
        var yOffSet = this.eggGapInWave;

        for (var i = 0; i < numEggs; i++){
            eggY -= yOffSet;
            eggX += xOffset;
            var eggType = gameController.COMBO_EGG;
            var egg = game.add.sprite(eggX, eggY, eggType);
            egg.scale.setTo(scaleRatio, scaleRatio);
            game.physics.arcade.enable(egg);
            this.eggGravity = gameController.calculateEggGravity(gameController.elapsedEggFallingTimeSecs);
            egg.body.gravity.y = this.eggGravity;
            this.comboEggs.add(egg);
        }
    },

    /**
     *  Calculates the initial starting position of the first egg in a wave randomly by putting it either on the right
     *  half or the left half of the screen.
     * @returns an x coordinate of the 1st egg.
     */
    calculateInitialX: function () {
        let edgeGap = 40 + Math.random()*10;
        let xStart = edgeGap;
        let xEnd = canvasWidth-edgeGap;
        var initialXOptions = [xStart, xEnd];
        var num = Math.floor(Math.random()*(initialXOptions.length));
        return initialXOptions[num];
    },

    /**
     * Calculates if the eggs after the 1st egg in a wave will be towards the left or the right.
     * @param xPos
     * @returns {number}
     */
    calculateXOffset: function (xPos) {
        var xOffset = 200;
        if(xPos>canvasWidth/2){
            xOffset = -xOffset;
        }
        return xOffset;
    },

    /**
     * Collect combo egg and perform necessary actions.
     * @param player
     * @param egg
     */
    collectComboEgg: function(egg) {

        gameController.eggCollect.play();
        egg.destroy();
        this.comboScoreCounter += this.comboEggPoints;
        this.comboStateHitCounter ++;
        this.comboEggCaughtPerWaveCount++;
        this.waveScore += this.comboEggPoints;
        this.updateScore(this.comboEggPoints);
    },

    /**
     * Tween combo wave score animation.
     * @param display
     */
    showScoreAnimation: function(display){
        gameController.displayEpicScoreText(display)
    },

    /**
     * Update game score
     * @param points
     */
    updateScore: function(points){
        this.totalScore += points;
        gameController.updateScore(points);
    },

    sendComboStateAnalyticsData: function () {
        mixpanel.track(
            "Combo " + gameController.comboCounter, {
                "Combo Score": this.comboScoreCounter,
                "Combo Eggs Caught": this.comboStateHitCounter,
                "Proportion of Combo Eggs Caught": (this.comboStateHitCounter/this.comboStateEggCounter).toFixed(2)
            }
        );
    },

    resetComboStateAnalyticsData: function () {
        this.comboScoreCounter = 0;
        this.comboStateHitCounter = 0;
        this.comboStateEggCounter = 0;
    }
};