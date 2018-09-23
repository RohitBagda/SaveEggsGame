/**
 * This file manages the overall game play and interacts with the individual states. It holds information that is
 * relevant to all the states in the game, such as total score, lives, etc.
 */

var gameController = {

    //important string constants for game sprites
    REGULAR_EGG: "egg",
    FRENZY_EGG: "frenzy",
    BOMB: "bomb",
    SCORE_BOOST: "scoreBoost",
    ONE_UP: "oneUp",
    COMBO_EGG: "combo",

    CRACKED_REGULAR_EGG: "crackedEgg",
    CRACKED_FRENZY_EGG: "crackedFrenzy",
    CRACKED_ONE_UP: "crackedOneUp",
    CRACKED_SCORE_BOOST: "crackedScoreBoost",
    CRACKED_COMBO: "crackedCombo",
    BOMB_EXPLOSION_CLOUD: "bombCloud",

    score : 0,
    highestScore: 0,
    lives: 3,

    // Initially, only regular eggs fall
    regularEggProb: 1,
    bombProb: 0,
    scoreBoostProb: 0,
    frenzyProb: 0,
    comboPro: 0,
    oneUpProb: 0,

    currentTime: 0,
    maxLives: 3,
    hasReachedCombo: false,
    regularEggPoints: 5,
    scoreBoostPoints: 30,
    frenzyPoints: 20,
    comboPoints: 100,
    eggVelocity: 20,

    // If an object is placed at a point (x,y), the anchor will set the center of the object to be (x,y)
    horizontalAnchor: 0.5,
    verticalAnchor: 0.5,

    addBackground: function(){
        game.add.sprite(0,0, "background");
    },

    /**
     * This creates the heart symbol at the top right of the screen to represent lives
     */
    createHeart: function () {
        this.heart = game.add.sprite(.75*canvasWidth, 0.025*canvasHeight, "heart");
        this.heart.scale.setTo(0.65*scaleRatio, 0.65*scaleRatio);
        var livesLabelFormat = this.createFormatting("bold 60px Corbel", "fill: #003366");
        this.livesLabel = game.add.text(.81*canvasWidth, 0.018*canvasHeight, ("×" +gameController.lives), livesLabelFormat);
    },

    updateLifeCountLabel: function(){
        if(gameController.lives >= 0 && gameController.lives <= gameController.maxLives) {
            this.livesLabel.setText("×" + gameController.lives);
        }
    },

    /**
     * Adds the pause button at the top right of the screen
     */
    createPause: function(){
        this.createPauseLabel();
        gameController.pauseLabel.events.onInputUp.add(function(){
            gameController.pauseLabel.setText("►");
            game.paused = true;
            tutorialState.createEggDescriptions();
        }, this);

        // This allows you to resume play by touching any point on the screen while the game is paused
        game.input.onDown.add(function(){
            if(game.paused) {
                var eggImages = tutorialState.getEggImages();
                var eggDescription = tutorialState.getEggDescriptions();
                eggImages.forEach(function(image){
                    image.destroy();
                });
                eggDescription.forEach(function(description){
                    description.destroy();
                });
                game.paused = false;
                gameController.pauseLabel.setText("II");
            }
        }, this);
    },

    /**
     * Creates the appropriate formatting for any text that appears on the screen
     * @param fontType
     * @param fillColor
     * @returns {{font: *, fill: *}}
     */
    createFormatting: function(fontType, fillColor) {
        var format = {font: fontType, fill: fillColor};
        format.stroke = "#000000";
        format.strokeThickness = 1;
        return format;
    },

    /**
     * Creates the total score at the top left of the screen
     */
    createScoreText: function() {
        var scoreFormat = this.createFormatting("bold 60px Corbel", "#003366");
        this.scoreText = game.add.text(0.05*canvasWidth,0.02*canvasWidth,'Score: ' + this.score, scoreFormat);
    },

    updateScore: function(points){
        this.score += points;
        this.scoreText.text = 'Score: ' + this.score;
    },

    /**
     * Displays the score animation that pops up on the screen for each individual egg
     * @param x
     * @param y
     * @param text
     * @param format
     * @param duration
     * @param speed
     */
    createTweenText: function(x, y, text, format, duration, speed){
        var tweenDisplay = game.add.text(x, y, text, format);
        tweenDisplay.anchor.setTo(gameController.horizontalAnchor, gameController.verticalAnchor);
        game.add.tween(tweenDisplay)
            .to({alpha: 0}, speed, Phaser.Easing.Default, true, duration);
    },

    /**
     * Displays each egg as cracked when it falls past the basket to the ground
     * @param crackedEggImage
     * @param egg
     */
    tweenEgg: function(crackedEggImage, egg){
        egg.loadTexture(crackedEggImage,0);
        egg.body.gravity.y = 0;
        game.add.tween(egg)
            .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 300);
    },

    createBasket: function(){
        if (!this.hasReachedCombo){
            this.basketX = canvasWidth/2;
            this.basketY = canvasHeight/1.2;
            this.hasReachedCombo = true;
        }

        // Create basket player sprite.
        this.player = game.add.sprite(this.basketX, this.basketY, "explode");

        // Add animation for basket explosion in the form of a sprite sheet of 15 frames
        this.player.animations.add('explodeBomb', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 45);

        // Enable physics properties for the basket.
        this.player.scale.setTo(scaleRatio/1.5, scaleRatio/1.5);
        this.player.anchor.setTo(0.5,0);
        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.kinematic = true;
        this.player.inputEnabled = true;
        this.player.input.enableDrag(false, true, true);
        this.player.input.allowVerticalDrag = false;
        this.player.collideWorldBounds = true;
        let bounds = new Phaser.Rectangle(0,0, canvasWidth, canvasHeight);
        this.player.input.boundsRect = bounds;
        this.player.body.immovable = true;
        this.player.allowGravity = false;
    },

    createPauseLabel: function(){
        var pauseLabelFormat = this.createFormatting("bold 60px Corbel", "003366");
        this.pauseLabel = game.add.text(0.92*canvasWidth, 0.02*canvasHeight, 'II', pauseLabelFormat);
        this.pauseLabel.inputEnabled = true;
    },

    /**
     * Adds all the sounds to the game and sets the volume of each one
     */
    setupSounds: function(){
        this.eggCrack = game.add.audio('egg_crack');
        this.eggCrack.volume = 0.6;

        this.frenzyMusic = game.add.audio('frenzy_music');
        this.frenzyMusic.volume = 0.4;

        this.frenzyCollect = game.add.audio('frenzy_collect');
        this.frenzyCollect.volume = 0.4;

        this.eggCollect = game.add.audio('egg_collect');
        this.eggCollect.volume = 0.6;

        this.explosion = game.add.audio('explosion');
        this.explosion.volume = 0.8;

        this.bombWhoosh = game.add.audio('bomb_whoosh');
        this.bombWhoosh.volume = 0.6;

        this.frenzyTouch = game.add.audio('frenzy_touch');
        this.frenzyTouch.volume = 0.3;

        this.bombCollect = game.add.audio('bomb_collect');
        this.bombCollect.volume = 0.6;
    },

    decrementLives: function(){
        this.lives--;
    },

    incrementLives: function(){
        this.lives++;
    },

    checkHighScore: function(){
        if (this.highestScore < this.score) {
            this.highestScore = this.score;
        }
    },

    /**
     * Calculates the gravity of the egg based on the time passed in the game
     * @param time
     * @returns {number}
     */
    calculateEggGravity: function(time){
        return  67200*(1/(1+Math.exp(-0.1*(time-30)))+1);
    },

    resetScore: function(){
        this.score = 0;
    },

    setEggProbabilities: function(regularEggPr, bombPr, scoreBoostPr, frenzyPr, comboPr, oneUpPr){
        this.regularEggProb = regularEggPr;
        this.bombProb = bombPr;
        this.scoreBoostProb = scoreBoostPr;
        this.frenzyProb = frenzyPr;
        this.comboProb = comboPr;
        this.oneUpProb = oneUpPr;
    },

    /**
     * Resets all aspects of the game when the user starts over
     */
    resetGameComponents: function(){
        this.currentTime=0;
        this.lives = 3;
        this.setEggProbabilities(1,0,0,0,0,0);
        this.score = 0;
        this.hasReachedCombo = false;
    },

    /**
     * Creates the text animation when the game transitions between states
     * @param x
     * @param y
     * @param text
     * @param textFormat
     * @param duration
     * @param speed
     */
    createTweenAnimation: function(x, y, text, textFormat, duration, speed){
        if(text>0){
            var tweenText = "+" + text;
        } else{
            var tweenText = text;
        }
        this.createTweenText(x, y, tweenText, textFormat, duration, speed);
    },

};

