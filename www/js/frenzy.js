/**
 * This is the frenzy state, in which the user has 3 seconds to try to collect (by tapping) as many eggs as possible
 */
var frenzyState = {

    FRENZY_OBJECTS_SCALE: 1.5,

    xVelocityFrenzyEgg: 100, // This is used to regulate the horizontal vibration of the eggs
    durationOfFrenzyState: 5, //5 seconds feels better than 4
    probabilityOfAddingFrenzyEgg: 0.75, // When drawing eggs, there is 75 percent chance it draws a frenzy egg instead of a bomb
    hasCaughtBomb: false, //flag to check that bomb hasnt been caught yet
    userDragPathColour: 0xFFFF00, //the colour of the path of the user's thumb

    playerHasRunOutOfLives: false,

    //The number of colours here must be the same as the duration of Frenzy State.
    //if you wanna make frenzy last longer (for testing purposes), add more colours to this array
    //this will help avoid null errors
    //currently goes from yellow to orange to red to dark red to black
    frenzyTimerColours: ["#FFFF00", "#FFA500", "#FF0000", "#8B0000", "#000000"],

    frenzyStateHitCounter: 0,
    frenzyStateScoreCounter: 0,
    numberOfEggsAddedToScreen: 0,
    numberOfEggsCollected: 0,

    create: function(){
        this.frenzyEggPoints = gameController.frenzyPoints;
        this.numberOfEggsAddedToScreen = 0; // initially 0 eggs are added to the screen
        this.frenzyTime = 0; // current time within the frenzy state
        this.showTimeLeft(this.frenzyTime);

        gameController.createScoreText();
        this.frenzyStateGroup = game.add.group();
        this.bombGroup = game.add.group();
        let frenzyEggImage = game.cache.getImage(gameController.FRENZY_EGG);
        this.frenzyEggDimensions = { width: frenzyEggImage.width * scaleRatio * this.FRENZY_OBJECTS_SCALE,
                                    height: frenzyEggImage.height * scaleRatio * this.FRENZY_OBJECTS_SCALE };
                              
        this.minDistanceBetweenPoints = Math.hypot(this.frenzyEggDimensions.width, this.frenzyEggDimensions.height);

        this.points = this.generatePoints();
        this.drawEggsAtPoints(this.points);
        this.numberOfEggsCollected = 0; // initially set the number of eggs the user has collected to 0
        this.elapsedTime = 0;

        gameController.createLifeBuckets();

        // every 1s (1000ms), the time in the frenzy state increases and the timer text at the top of screen is updated
        game.time.events.loop(1000, function(){
            if (!this.hasCaughtBomb && this.frenzyTime >= this.durationOfFrenzyState - 1){
                gameController.frenzyMusic.stop();
                backgroundMusic.play();
                gameController.resetStreakScore();
                gameController.resetFrenzyEggPoints();
                this.sendFrenzyStateAnalyticsData();
                this.resetFrenzyStateAnalyticsData();
                this.game.state.start('transitionFromFrenzy');
                this.hasCaughtBomb = false;
            } else if (!this.hasCaughtBomb){
                this.frenzyTime ++;
                this.showTimeLeft(this.frenzyTime);
            }
        }, this);

        //checks where the user's input is every 0.0001ms and if it is down it adds a circular dot
        //this eventually creates the path that traces the user's thumb
        game.time.events.loop(0.0001, function () {
            var gamePointer = game.input.activePointer;
            if (!this.hasCaughtBomb && gamePointer.isDown && gamePointer != null) {
                console.log("Pointer is down");
                var userDragPath = game.add.graphics(0, 0);
                userDragPath.lineStyle(22, this.userDragPathColour);
                userDragPath.drawCircle(gamePointer.position.x, gamePointer.position.y, 22);
                game.add.tween(userDragPath)
                    .to({alpha: 0}, 400, Phaser.Easing.Default, true, 200);
            }
        }, this);

        //after user catches a bomb, a bomb explodes every 250ms
        game.time.events.loop(400, function () {
            if (this.hasCaughtBomb){
                //make sure there are still bombs in the bomb group
                if (this.bombGroup.children.length > 0){
                    this.playExplosion(this.bombGroup.children[0]);
                }
                else {
                    //if no bombs left in bomb group, stop frenzy music and transition back into appropriate state
                    //which is frenzy or gameover
                    gameController.frenzyMusic.stop();
                    if (this.playerHasRunOutOfLives){
                        this.game.state.start('gameOver');
                    } else {
                        this.game.state.start('transitionFromFrenzy');
                        backgroundMusic.play();
                    }
                    //important that this is reset to false so that the next time you enter frenzy state the bombs dont just explode
                    this.hasCaughtBomb = false;
                }
            }
        }, this);

    },


    /**
     * This is the update function, which we added with some help from Bret Jackson.
     * This function manages the vibration of the eggs in the frenzy state.
     * This function also controls how the bonus points are added.
     */
    update: function(){

        //every 150ms, the x-velocity flips, in order to help the eggs switch directions.
        this.elapsedTime += game.time.physicsElapsedMS;
        if (this.elapsedTime >= (200 - (15 * this.frenzyTime))) {
            this.changeXVelocityOfEgg();
            this.frenzyStateGroup.forEach(function (egg) {
                egg.body.velocity.x = this.xVelocityFrenzyEgg;
            }, this);
            this.bombGroup.forEach(function (bomb){
                bomb.body.velocity.x = this.xVelocityFrenzyEgg;
            }, this);

            this.elapsedTime = 0;
        }


        // adjusts high scores
        if (gameController.score > gameController.highestScore){
            gameController.highestScore = gameController.score;
        }
    },

    /**
     * takes displays the time left in the frenzy state
     * @param timeSpent: the number of seconds spent in the state
     */
    showTimeLeft: function(timeSpent) {
        var timerFormatting = gameController.createFormatting("bold 150pt Corbel", this.frenzyTimerColours[timeSpent]);
        var timeLeft = this.durationOfFrenzyState - timeSpent;
        var x = canvasWidth/2;
        var y = 0.03 * canvasHeight;
        gameController.displayFadingText(x, y, timeLeft, timerFormatting, 400, 600);
    },

    /**
     * This uses the poisson disk sampler to generate an array of coordinates to put the frenzy eggs
     * @returns {Array} - contains the coordinates at which we will add frenzy eggs or bombs
     */
    generatePoints: function(){
        var poissonDiskSampler = new PoissonDiskSampler();

        //Sets the minimum and maximum distance between two points.
        poissonDiskSampler.radiusMin = this.minDistanceBetweenPoints/2;
        poissonDiskSampler.radiusMax = this.minDistanceBetweenPoints/2;

        poissonDiskSampler.createPoints();
        return poissonDiskSampler.pointList;
    },

    /**
     * Takes an array of coordinates and draws frenzy eggs or bombs there
     * @param points - an array containing coordinates
     */
    drawEggsAtPoints: function(points){
        //set horizontal and vertical bounds to control positions at which the eggs are created
        let minX = 0.05 * canvasWidth;
        let maxX = canvasWidth - minX;
        let minY = 0.15 * canvasHeight;
        let maxY = 0.9 * canvasHeight;

        for (var i = 0; i < points.length; i++){
            let eggCenter = points[i];
            if ((eggCenter.x - this.frenzyEggDimensions.width/2) > minX && 
                (eggCenter.x + this.frenzyEggDimensions.width/2) < maxX && 
                (eggCenter.y + this.frenzyEggDimensions.height/2) > minY && 
                (eggCenter.y - this.frenzyEggDimensions.height/2) < maxY) {

                if (Math.random() < this.probabilityOfAddingFrenzyEgg){
                    this.createFrenzyEgg(eggCenter.x, eggCenter.y, gameController.FRENZY_EGG);
                    this.numberOfEggsAddedToScreen++;
                } else{
                    this.createFrenzyEgg(eggCenter.x, eggCenter.y, gameController.BOMB);
                }
            }
        }
    },

    /**
     * Handles what happens when a bomb is collected
     * @param bomb - the bomb that is collected
     */
    collectBomb: function(bomb){
        this.hasCaughtBomb = true;
        this.playerHasRunOutOfLives = gameController.loseLife();
        gameController.frenzyMusic.stop();

        this.camera.shake(gameController.MAX_CAMERA_SHAKE_INTENSITY, 1000, true, Phaser.Camera.SHAKE_BOTH, true);
        gameController.explosion.play();
        this.playExplosion(bomb);
        this.makeEggsInactive();
    },

    /**
     * takes a bomb and explodes it on the screen
     * @param bombToExplode the bomb we want to explode
     */
    playExplosion: function(bombToExplode){
        //add new spritesheet of explosion to current position of bomb
        var bombAnimationSprite = game.add.sprite(bombToExplode.x, bombToExplode.y, gameController.BOMB_EXPLOSION_SPRITE_SHEET);
        gameController.explosion.play();
        this.bombGroup.remove(bombToExplode);
        bombAnimationSprite.inputEnabled = false;
        bombAnimationSprite.animations.add("explode", [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        bombAnimationSprite.anchor.setTo(0.5,0.5);
        bombAnimationSprite.animations.play('explode', 45, false, true);

    },


    /**
     * prevents user from being able to touch any eggs or bomb on screen anymore
     */
    makeEggsInactive: function() {
        for (var egg of this.frenzyStateGroup.children) {
            egg.inputEnabled = false;
        }
        for (var bomb of this.bombGroup.children){
            bomb.inputEnabled = false;
        }
    },

    /**
     * creates a frenzy egg or bomb
     * @param eggX - the x-coordinate
     * @param eggY - the y-coordinate
     * @param eggName - the egg type; either "bomb" or "egg"
     * @returns {number} - returns the diagonal length of an egg
     */
    createFrenzyEgg: function (eggX, eggY, eggName) {
        var frenzyEgg = game.add.sprite(eggX, eggY, eggName);

        // sets up physical properties of egg
        game.physics.arcade.enable(frenzyEgg);
        frenzyEgg.scale.setTo(scaleRatio * this.FRENZY_OBJECTS_SCALE);
        frenzyEgg.anchor.setTo(0.5, 0.5);
        frenzyEgg.inputEnabled = true;
        this.frenzyStateGroup.add(frenzyEgg);

        if (eggName === gameController.FRENZY_EGG){
            frenzyEgg.events.onInputOver.add(this.collectEgg, this);
        } else {
            this.bombGroup.add(frenzyEgg);
            frenzyEgg.events.onInputOver.add(this.collectBomb, this);
        }
    },

    /**
     * reverses the direction of the x-velocity
     */
    changeXVelocityOfEgg: function(){
        this.xVelocityFrenzyEgg = -1 * this.xVelocityFrenzyEgg;
    },

    /**
     * This controls what happens when an egg is clicked
     * @param egg - the egg that is touched/clicked
     */
    collectEgg: function(egg){
        let eggX = egg.x;
        let eggY = egg.y;
        egg.kill();
        gameController.frenzyTouch.play();
        this.numberOfEggsCollected++;
        this.showScoreAnimation(eggX, eggY, this.frenzyEggPoints);
        gameController.score += this.frenzyEggPoints;
        this.frenzyStateScoreCounter += this.frenzyEggPoints;
        gameController.scoreText.text = "Score: " + gameController.score;
    },

    /**
     * Plays the animation pop-up when an egg is touched
     * @param xCoordinate
     * @param yCoordinate
     * @param numberOfPoints - number of points that are added to the score and displayed on the screen where the user touched egg
     */
    showScoreAnimation: function(xCoordinate, yCoordinate, numberOfPoints){
        var tweenSpeed = 500;
        var scoreTextFormat = gameController.createFormatting("bold 40pt Corbel", "#003366");
        gameController.displayFadingText(xCoordinate, yCoordinate, "+" + numberOfPoints, scoreTextFormat, 700, tweenSpeed);
    },

    sendFrenzyStateAnalyticsData: function () {
        mixpanel.track(
            "Frenzy ", {
                "Frenzy Number": gameController.frenzyCounter,
                "Frenzy Score": this.frenzyStateScoreCounter,
                "Frenzy Eggs Caught": this.numberOfEggsCollected,
                "Proportion of Frenzy Eggs Caught": (this.numberOfEggsCollected/this.numberOfEggsAddedToScreen).toFixed(2)                
            }
        );
    },

    resetFrenzyStateAnalyticsData: function () {
        this.frenzyStateScoreCounter = 0;
    }
};
