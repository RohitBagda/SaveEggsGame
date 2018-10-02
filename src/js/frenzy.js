/**
 * This is the frenzy state, in which the user has 3 seconds to try to collect (by tapping) as many eggs as possible
 */
var frenzyState = {

    FRENZY_OBJECTS_SCALE: 1.5,

    bonusPointsFrenzy: 50,
    xVelocityFrenzyEgg: 100, // This is used to regulate the horizontal vibration of the eggs
    durationOfFrenzyState: 15,
    probabilityOfAddingFrenzyEgg: 0.75, // When drawing eggs, there is 75 percent chance it draws a frenzy egg instead of a bomb
    hasCaughtBomb: false, //flag to check that bomb hasnt been caught yet
    userDragPathColour: 0xFFFF00, //the colour of the path of the user's thumb
    create: function(){
        gameController.addBackground();
        this.frenzyEggPoints = gameController.frenzyPoints;
        this.numberOfEggsAddedToScreen = 0; // initially 0 eggs are added to the screen
        this.hasAchievedBonus = false; // flag to check if the user has achieved the bonus
        this.frenzyTime = 0; // current time within the frenzy state

        this.createFrenzyTimer(); // creates the timer at the top of the screen to remind the user of the duration of the frenzy state

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

        gameController.createHeart();

        // every 1s (1000ms), the time in the frenzy state increases and the timer text at the top of screen is updated
        game.time.events.loop(1000, function(){
            if (this.frenzyTime >= this.durationOfFrenzyState - 1){
                gameController.frenzyMusic.stop();
                backgroundMusic.play();
                this.game.state.start('play');
            } else if (!this.hasCaughtBomb){
                this.frenzyTime ++;
                this.timer.text = this.durationOfFrenzyState - this.frenzyTime;
            }
        }, this);

        //checks where the user's input is every 0.0001ms and if it is down it adds a circular dot
        //this eventually creates the path that traces the user's thumb
        game.time.events.loop(0.0001, function () {
            var gamePointer = game.input.activePointer;
            if (gamePointer.isDown && gamePointer != null) {
                console.log("Pointer is down");
                var userDragPath = game.add.graphics(0, 0);
                userDragPath.lineStyle(22, this.userDragPathColour);
                userDragPath.drawCircle(gamePointer.position.x, gamePointer.position.y, 22);
                game.add.tween(userDragPath)
                    .to({alpha: 0}, 400, Phaser.Easing.Default, true, 200);
            }
        }, this);

        //after user catches a bomb, a bomb explodes every 250ms
        game.time.events.loop(250, function () {
            if (this.hasCaughtBomb){
                //make sure there are still bombs in the bomb group
                if (this.bombGroup.children.length > 0){
                    this.bombGroup.children[0].destroy();
                    gameController.explosion.play();
                }
                else {
                    //if no bombs left in bomb group, stop frenzy music and transition back into appropriate state
                    //which is frenzy or gameover
                    gameController.frenzyMusic.stop();
                    if (gameController.lives == 0){
                        this.game.state.start('gameOver');
                    } else {
                        this.game.state.start('play');
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

        // determines what happens if user has collected all frenzy eggs and hasnt achieved the bonus
        if (this.numberOfEggsCollected == this.numberOfEggsAddedToScreen && !this.hasAchievedBonus){
            this.hasAchievedBonus = true; //readjusts the flag, in order to prevent the bonus score to keep adding over and over again
            gameController.score += this.bonusPointsFrenzy;
            gameController.scoreText.text = "Score: " + gameController.score;
            this.playBonusReceivedAnimation();
        }

        // adjusts highscores
        if (gameController.score > gameController.highestScore){
            gameController.highestScore = gameController.score;
        }
    },

    /**
     * Creates a timer at the top of the screen in the frenzy state
     */
    createFrenzyTimer: function () {
        var frenzyTimerFormatting = gameController.createFormatting("bold 50pt Corbel", "#ff0000");

        //timer is added with a y-spacing of 3% of the canvas height. Adjust the scale ratio and properly centralise things
        this.timer = game.add.text(canvasWidth / 2, 0.03 * canvasHeight, this.durationOfFrenzyState, frenzyTimerFormatting);
        this.timer.anchor.setTo(0.5, 0.5);
        this.timer.scale.setTo(scaleRatio, scaleRatio);
    },

    /**
     * This plays the animation when the user has achieved the bonus (catching all the frenzy eggs in the state)
     */
    playBonusReceivedAnimation: function(){
        var bonusPointsFormat = gameController.createFormatting("bold 100pt Corbel", "#FF00FF");
        var bonusText = "BONUS: +" + this.bonusPointsFrenzy;
        gameController.createTweenAnimation(game.world.centerX, game.world.centerY, bonusText , bonusPointsFormat);
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
     * @param egg - the egg (bomb) that is collected
     */
    collectBomb: function(bomb){
        this.hasCaughtBomb = true;
        gameController.lives--;
        gameController.updateLifeCountLabel();
        playState.calculateEggProbability(gameController.currentTime);
        gameController.explosion.play();
        bomb.kill();
        this.bombGroup.remove(bomb);
        this.makeEggsInactive();
        //---------------screen shake and wait would be great at this point in the code--------------//

    },

    /**
     * prevents user from being able to touch any eggs or bomb on screen anymore
     */
    makeEggsInactive: function() {
        for (var egg of this.frenzyStateGroup.children) {
            egg.inputEnabled = false;
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

        if (eggName == gameController.FRENZY_EGG){
            // console.log("frenzy egg caught");
            frenzyEgg.events.onInputOver.add(this.collectEgg, this);
        } else {
            // console.log("frenzy egg caught");
            this.bombGroup.add(frenzyEgg);
            frenzyEgg.events.onInputOver.add(this.collectBomb, this);
            // console.log("frenzy egg caught2");
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
        gameController.createTweenAnimation(xCoordinate, yCoordinate, numberOfPoints, scoreTextFormat, 700, tweenSpeed);
    },

};