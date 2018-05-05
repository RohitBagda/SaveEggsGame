
var frenzyState = {

    bonusPointsFrenzy: 50,
    xVelocityFrenzyEgg: 100,
    durationOfFrenzyState: 3,
    probabilityOfAddingFrenzyEgg: 0.75,


    create: function(){
        gameController.addBackground();
        this.frenzyEggPoints = gameController.frenzyPoints;
        this.numberOfEggsAddedToScreen = 0;
        this.hasAchievedBonus = false;
        this.frenzyTime = 0;
        this.createFrenzyTimer();
        gameController.createScoreText();
        // gameController.scoreText = game.add.text(10,10, "Score: " + score, {font: 'bold 60px Corbel', fill: '#003366'});
        this.frenzyStateGroup = game.add.group();
        this.minDistanceBetweenPoints = this.createFrenzyEgg(-500, -500);
        this.points = this.generatePoints();
        this.drawEggsAtPoints(this.points);
        this.numberOfEggsCollected = 0;
        this.elapsedTime = 0;
        gameController.createHeart();
        game.time.events.loop(1000, function(){
            if (this.frenzyTime >= this.durationOfFrenzyState){
                gameController.frenzyMusic.stop();
                backgroundMusic.play();
                this.game.state.start('play');
            } else{
                this.frenzyTime ++;
                this.timer.text = this.durationOfFrenzyState - this.frenzyTime;
            }
        }, this);

    },

    update: function(){
        this.elapsedTime += game.time.physicsElapsedMS;
        if (this.elapsedTime >= 150) {
            this.changeXVelocityOfEgg();
            this.frenzyStateGroup.forEach(function (egg) {
                egg.body.velocity.x = this.xVelocityFrenzyEgg;
            }, this);
            this.elapsedTime = 0;
        }
        if (this.numberOfEggsCollected == this.numberOfEggsAddedToScreen && !this.hasAchievedBonus){
            this.hasAchievedBonus = true;
            gameController.score += this.bonusPointsFrenzy;
            gameController.scoreText.text = "Score: " + gameController.score;
            this.playBonusReceivedAnimation();
        }
        if (gameController.score > gameController.highestScore){
            gameController.highestScore = gameController.score;
        }

    },

    createFrenzyTimer: function () {
        var frenzyTimerFormatting = gameController.createFormatting("bold 50pt Corbel", "#ff0000");
        this.timer = game.add.text(canvasWidth / 2, 0.03 * canvasHeight, this.durationOfFrenzyState, frenzyTimerFormatting);
        this.timer.anchor.setTo(0.5, 0.5);
        this.timer.scale.setTo(scaleRatio, scaleRatio);
    },

    playBonusReceivedAnimation: function(){
        var bonusPointsFormat = gameController.createFormatting("bold 100pt Corbel", "#FF00FF");
        var bonusText = "BONUS: +" + this.bonusPointsFrenzy;
        gameController.createTweenAnimation(game.world.centerX, game.world.centerY, bonusText , bonusPointsFormat);

    },

    generatePoints: function(){
        var poissonDiskSampler = new PoissonDiskSampler();
        poissonDiskSampler.radiusMin = this.minDistanceBetweenPoints/2;
        poissonDiskSampler.radiusMax = this.minDistanceBetweenPoints/2;
        poissonDiskSampler.createPoints();
        return poissonDiskSampler.pointList;
    },

    drawEggsAtPoints: function(points){
        let eggOffset = 50;
        var xOffSet = 0.1 * (canvasWidth-eggOffset);
        var topYOffSet = 0.15 * canvasHeight;
        var bottomYOffSet = 0.2 * canvasHeight;
        for (var i = 0; i < points.length; i++){
            let coordinate = points[i];
            if ((coordinate.x > xOffSet) && (coordinate.x < (canvasWidth - xOffSet))
                && (coordinate.y > topYOffSet) && (coordinate.y < (canvasHeight - bottomYOffSet))){
                var prob = Math.random();
                if (prob < this.probabilityOfAddingFrenzyEgg){
                    this.createFrenzyEgg(coordinate.x, coordinate.y, "frenzy");
                    this.numberOfEggsAddedToScreen++;
                } else{
                    this.createFrenzyEgg(coordinate.x, coordinate.y, "bomb");
                }
            }
        }
    },

    collectBomb: function(egg){
        gameController.lives--;
        gameController.updateLifeCountLabel();
        playState.calculateEggProbability(gameController.currentTime);
        egg.kill();
        if (gameController.lives == 0){
            gameController.explosion.play();
            gameController.frenzyMusic.stop();
            this.game.state.start('gameOver');
        } else{
            gameController.bombCollect.play();
        }


    },

    createFrenzyEgg: function (eggX, eggY, eggName) {
        var frenzyEgg = game.add.sprite(eggX, eggY, eggName);
        game.physics.arcade.enable(frenzyEgg, Phaser.Physics.ARCADE);
        game.physics.arcade.enable(frenzyEgg);
        frenzyEgg.scale.setTo(scaleRatio * 1.5, scaleRatio * 1.5);
        frenzyEgg.body.kinematic = true;
        frenzyEgg.inputEnabled = true;
        frenzyEgg.input.enableDrag(false, true, true);
        frenzyEgg.input.allowVerticalDrag = true;
        frenzyEgg.collideWorldBounds = true;
        frenzyEgg.body.immovable = true;
        this.frenzyStateGroup.add(frenzyEgg);
        if (eggName == "frenzy"){
            frenzyEgg.events.onInputDown.add(this.collectEgg, this);
        } else{
            frenzyEgg.events.onInputDown.add(this.collectBomb, this);
        }
        var distanceSquared = Math.pow(frenzyEgg.width, 2) + Math.pow(frenzyEgg.height, 2);
        var distance = Math.pow(distanceSquared, 0.5);

        return distance;
    },


    changeXVelocityOfEgg: function(){
        this.xVelocityFrenzyEgg = -1 * this.xVelocityFrenzyEgg;
    },

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

    showScoreAnimation: function(xCoordinate, yCoordinate, numberOfPoints){
        var scoreTextFormat = gameController.createFormatting("bold 40pt Corbel", "#003366");
        gameController.createTweenAnimation(xCoordinate, yCoordinate, numberOfPoints, scoreTextFormat, 700);
    },

};