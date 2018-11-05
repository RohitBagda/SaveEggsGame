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

    BOMB_EXPLOSION_SPRITE_SHEET: "bomb_explosion_sprite_sheet",
    BASKET_EXPLOSION_SPRITE_SHEET: "basket",
    BACKGROUND: "background",

    MAX_CAMERA_SHAKE_INTENSITY: 0.01,

    score : 0,
    _highestScoreInternal_DO_NOT_ACCESS: 0,
    set highestScore(val) {
        this._highestScoreInternal_DO_NOT_ACCESS = val;
        localStorage.setItem(loadState.LS_KEY_HIGH_SCORE, gameController.highestScore.toString());
    },
    get highestScore() {
        return this._highestScoreInternal_DO_NOT_ACCESS;
    },
    lives: 3,
    maxLives: 3,
    livesList:[],
    regularEggChain: 0,
    streakScore: 0,
    totalRegEggsCaught: 0,
    baseRegEggMultiplier: 2,
    regEggMultiplier: 2,
    eggsNeededToLevelUp: 25,
    currentLevel:1,

    // the timer that keeps track of how long eggs have been falling for. NOT for general-purpose timing usage.
    elapsedEggFallingTimeSecs: 0,
    hasReachedCombo: false,
    baseRegEggPoints: 1,
    regularEggPoints: 1,
    scoreBoostPoints: 5,
    baseFrenzyPoints: 5,
    frenzyPoints: 5,
    comboPoints: 100,
    eggVelocity: 20,
    bucketMovementEnabled: true,

    // If an object is placed at a point (x,y), the anchor will set the center of the object to be (x,y)
    horizontalAnchor: 0.5,
    verticalAnchor: 0.5,
    tweenSpeed: 100,

    rainbowTextEnabled: false,
    didRainbowUpdateLastFrame: false,

    // Other Analytics Data (note this is not the only ones reported, there other variables declared above which are
    // being as well. These are not being used for any in-game calculations.
    longestStreak: 0,
    streakNumber: 0,
    scoreBoostCounter: 0,
    comboCounter: 0,
    frenzyCounter: 0,
    frenzyStateCounter: 0,
    frenzyStateScoreCounter: 0,
    oneUpCounter:0,
    frenzyMissCount: 0,
    fpsCounter: 0,
    framesCounter: 0,

    /**
     * Updates the timer that keeps track of how long eggs have been falling for.
     * NOT for general-purpose timing usage
     */
    updateEggFallingTimer: function() {
        this.elapsedEggFallingTimeSecs += game.time.physicsElapsed;
    },


    /**
     * This creates the intial baskets at the top right of the screen to represent lives
     */
    createLifeBuckets: function () {

        var bucketXPos = 0.85*canvasWidth;
        var bucketYPos = 0.04*canvasHeight;
        var scaleRatioMultiplier = 0.25;
        var bucketXOffset = this.player.width/3;

        for(var i=0; i<this.maxLives; i++){
            this.livesList[i] = game.add.sprite(bucketXPos, bucketYPos, gameController.BASKET_EXPLOSION_SPRITE_SHEET);
            this.livesList[i].scale.setTo(scaleRatioMultiplier*scaleRatio, scaleRatioMultiplier*scaleRatio);
            this.livesList[i].anchor.setTo(0.5);
            bucketXPos -= bucketXOffset;

            if(i >= this.lives) {
                this.livesList[i].alpha = 0;
            }
        }
    },

    /**
     * (Note: Returns a variable indicating if the player has run out of lives)
     */
    loseLife: function(hideBucket = true) {
        if(this.lives > 0) {
            if(hideBucket) {
                this.livesList[this.lives-1].alpha = 0;
            }
            this.lives--;
            return false;
        } else {
            return true;
        }
    },

    getTopVisibleLifeBucket: function() {
        for(let i = this.maxLives - 1; i >= 0; i--) {
            if(this.livesList[i].alpha === 1) {
                return this.livesList[i];
            }
        }
    },

    getNextInvisibleLifeBucket: function() {
        for(let bucket of this.livesList) {
            if(bucket.alpha === 0) {
                return bucket;
            }
        }
    },

    /**
     * Adds the pause button at the top right of the screen
     */
    createPause: function(){
        this.pauseLabel = game.add.sprite(0.92*canvasWidth, 0.02*canvasHeight, "pauseIcon");
        this.pauseLabel.tint = "#003366";
        this.pauseLabel.scale.setTo(0.5);
        this.pauseLabel.inputEnabled = true;
        this.pauseLabel.events.onInputDown.add(function(){
            if(!game.paused) {
                this.pauseGame();
            } else {
                this.unpauseGame();
            }
        }, this);

        // This allows you to resume play by touching any point on the screen while the game is paused
        // We don't trigger the event when the user could also be tapping the play button because otherwise
        // we instantly unpause and pause the game.
        game.input.onDown.add(function(){
            if(game.paused && game.input.y > this.pauseLabel.bottom) {
                this.unpauseGame();
            }
        }, this);
    },

    pauseGame: function() {
        game.paused = true;
        this.pauseLabel.loadTexture("playIcon");
        this.dimBackground();
        this.displayButtonToExitToMainMenu();
    },

    unpauseGame: function() {
        game.paused = false;
        this.pauseLabel.loadTexture("pauseIcon");
        this.setBackgroundToNormal();
        this.exitButtonText.kill();
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

    updateRegEggPoints: function(points){
        this.regularEggPoints = points;
    },

    /**
     * Displays each egg as cracked when it falls past the basket to the ground
     * @param crackedEggImage
     * @param egg
     */
    tweenEgg: function(crackedEggImage, egg){
        egg.loadTexture(crackedEggImage,0);
        egg.body.velocity.y = 20;
        game.add.tween(egg)
            .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 300);
    },

    resetRegularEggStreak: function(){
        if(this.regularEggChain > this.longestStreak){
            this.longestStreak = this.regularEggChain;
        }
        this.regularEggChain = 0;
    },

    resetFrenzyEggPoints: function(){
        this.frenzyPoints = this.baseFrenzyPoints;
    },

    getCurrentStreakScore: function(){
        this.streakScore += this.regularEggPoints;
        return this.streakScore;
    },

    resetStreakScore: function(){
        this.streakScore = 0;
    },

    resetAnalyticsData: function(){
        this.longestStreak = 0;
        this.streakNumber = 0;
        this.scoreBoostCounter = 0;
        this.comboCounter = 0;
        this.frenzyCounter = 0;
        this.frenzyStateCounter = 0;
        this.frenzyStateScoreCounter = 0;
        this.oneUpCounter = 0;
        this.frenzyMissCount = 0;
        this.fpsCounter = 0;
        this.framesCounter = 0;

    },

    createBasket: function(){
        if (!this.hasReachedCombo){
            this.basketX = canvasWidth/2;
            this.basketY = canvasHeight * 0.98;
            this.hasReachedCombo = true;
        }

        // Create basket player sprite.
        this.player = game.add.sprite(this.basketX, this.basketY, gameController.BASKET_EXPLOSION_SPRITE_SHEET);

        // Add animation for basket explosion in the form of a sprite sheet of 15 frames
        this.player.animations.add('explodeBomb', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 15);


        // Enable physics properties for the basket.
        this.player.scale.setTo(scaleRatio/1.5, scaleRatio/1.5);
        this.player.anchor.setTo(0.5,1.0);
        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.kinematic = true;
        this.player.collideWorldBounds = true;
        this.player.body.immovable = true;
        this.player.allowGravity = false;
        this.bucketMovementEnabled = true;

        this.player.body.setSize(127, 30, 12, 40);
    },

    updateBasketPosition: function() {
        if(this.bucketMovementEnabled && game.input.activePointer.isDown) {
            let mouseX = game.input.activePointer.x;
            if(Math.abs(this.player.position.x - mouseX) < canvasWidth / 2) {
                let maxX = canvasWidth - this.player.width / 2;
                let minX =  this.player.width / 2;
                let newX = Math.max(minX, Math.min(mouseX, maxX))
                this.player.position.x = newX;
            }
        }
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

    /**
     * Resets all aspects of the game when the user starts over
     */
    resetGameComponents: function(){
        this.elapsedEggFallingTimeSecs = 0;
        this.lives = this.maxLives;
        this.score = 0;
        this.hasReachedCombo = false;
        this.totalRegEggsCaught = 0;
        this.regularEggPoints = this.baseRegEggPoints;
        this.regEggMultiplier = this.baseRegEggMultiplier;
        this.currentLevel = 1;
        this.resetRegularEggStreak();
    },

    /**
     * Creates the text animation when the game transitions between states
     */
    displayFadingText: function(x, y, text, textFormat, timeBeforeFade, fadeLength){
        var textObject = game.add.text(x, y, text, textFormat);
        //Center text
        textObject.anchor.setTo(0.5, 0.5);
        game.add.tween(textObject)
            .to({alpha: 0}, fadeLength, Phaser.Easing.Default, true, timeBeforeFade);
    },

    displayFlashingComboText: function(text, sizePx) {
        return this.displayFlashingModeText(text, sizePx, "rgb(79, 158, 211)", "rgb(38, 68, 98)");
    },

    displayFlashingFrenzyText: function(text, sizePx) {
        return this.displayFlashingModeText(text, sizePx, "rgb(226, 0, 237)", "rgb(124, 2, 103)");
    },

    displayFlashingModeText(text, sizePx, lighterColor, darkerColor) {
        let format = {
            font: "Times",
            fontWeight: "bold",
            fontSize: sizePx,
            fill: lighterColor,
            strokeThickness: 10,
            stroke: "rgb(0, 0, 0)",
            align: "center"
        };

        let textObject = game.add.text(game.world.centerX, game.world.centerY, text, format);
        textObject.anchor.setTo(0.5, 0.5);

        let loopCount = 0;
        game.time.events.loop(200, function(){
            textObject.clearColors();
            let color = loopCount % 2 === 0 ? darkerColor : lighterColor;
            textObject.addColor(color, 0);
            loopCount++;
        }, this);

        return textObject
    },

    displayEpicScoreText: function(scoreValue){
        // Destroy previous text so there's no overlap
        if(this.currentScoreTextObject != null) {
            this.currentScoreTextObject.destroy();
            this.rainbowTextEnabled = false;
        }

        // Format text
        var textColor;
        var textScale;
        if(scoreValue < 50) {
            textScale = 0.5;
            textColor = "rgb(71, 255, 89)";
        } else if (scoreValue < 100) {
            textScale = 0.6;
            textColor = "rgb(255, 255, 45)";
        } else if (scoreValue < 200) {
            textScale = 0.7;
            textColor = "rgb(255, 195, 0)";
        } else if (scoreValue < 300) {
            textScale = 0.8;
            textColor = "rgb(255, 58, 58)";
        } else if (scoreValue < 400) {
            textScale = 0.9;
            textColor = "rgb(238, 0, 255)";
        } else {
            textScale = 1.0;
            this.rainbowTextEnabled = true;
            this.didRainbowUpdateLastFrame = false;
            textColor = "#000000";
        }

        var textFormat = {font: "bold 160pt Corbel", fill: textColor};
        textFormat.stroke = "#000000";
        textFormat.strokeThickness = 15;

        // Create text object
        var text = "+" + scoreValue;
        var textObject = game.add.text(game.world.centerX, game.world.centerY, text, textFormat);
        this.currentScoreTextObject = textObject;

        //Center text at about the center of the numbers (i.e. ignore the plus sign)
        var justNumbersProportion = (text.length / (text.length + 1));
        var justNumbersStart = 1 - justNumbersProportion;
        var xAnchor = justNumbersStart + (0.5 * justNumbersProportion);
        textObject.anchor.setTo(xAnchor, 0.5);

        // Set the text initial scale and rotation
        textObject.scale.setTo(0.2);
        var rotationInitial = Math.random() > 0.5 ? -1: 1;
        rotationInitial += (Math.random() - 0.5) * (0.4);
        textObject.rotation = rotationInitial;

        // Create tweens
        var bustInLength = 800;
        var bustInTween = game.add.tween(textObject.scale).to( { x: textScale, y: textScale }, bustInLength, Phaser.Easing.Elastic.Out);
        var fadeOutTween = game.add.tween(textObject).to({alpha: 0}, 200, Phaser.Easing.Default);
        bustInTween.chain(fadeOutTween);

        var bustInRotationTween =  game.add.tween(textObject).to( { rotation: 0}, bustInLength, Phaser.Easing.Elastic.Out).start();

        // Starting both tweens at the same time makes them run in sync.
        bustInTween.start();
        bustInRotationTween.start();

        // In case rainbow is enabled
        this.updateRainbowScoreColor();
    },

    updateRainbowScoreColor() {
        if(this.rainbowTextEnabled && !this.didRainbowUpdateLastFrame) {
            let hue = Math.round((game.time.totalElapsedSeconds() * 500) % 360);
            this.currentScoreTextObject.clearColors();
            this.currentScoreTextObject.addColor("hsl(" + hue + ", 90%, 60%)", 0);
        }
        this.didRainbowUpdateLastFrame = !this.didRainbowUpdateLastFrame;
    },

    playEggCrackingSound: function(){
        this.eggCrack.play();
    },

    removeBasket: function () {
        this.player.destroy();
    },

    displayButtonToExitToMainMenu: function() {
        // if (game.paused){
        // var exitButtonFormat = this.createFormatting("bold 70px Corbel", "#00CCFF");
        var exitButtonFormat = {font: "bold 85px Corbel", fill: "#FFFF00"};
        exitButtonFormat.stroke = "#000000";
        exitButtonFormat.strokeThickness = 12;
        this.exitButtonText = game.add.text(game.world.centerX, game.world.centerY, 'EXIT TO MAIN MENU', exitButtonFormat);
        this.exitButtonText.anchor.setTo(this.horizontalAnchor, this.verticalAnchor);
        this.exitButtonText.inputEnabled = true;
        this.exitButtonText.events.onInputDown.add(this.exitToMainMenu, this);
        // }
    },

    /**
     * switches from regular background to a dim background
     */
    dimBackground: function(){
        var backgroundDiv = document.getElementById("gameDiv");
        backgroundDiv.classList.remove("normalBackground");
        backgroundDiv.classList.add("darken"); //the name of the css class which does this is called "darken". see index.html
    },

    /**
     * switches background from dim version to the normal one.
     */
    setBackgroundToNormal: function() {
        var backgroundDiv = document.getElementById("gameDiv");
        backgroundDiv.classList.remove("darken");
        backgroundDiv.classList.add("normalBackground");
    },

    exitToMainMenu: function() {
        this.resetGameComponents();
        game.state.start("menu");
    }
};