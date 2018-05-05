
var frenzyState = {

    bonusPointsFrenzy: 50,
    xVelocityFrenzyEgg: 100,
    durationOfFrenzyState: 3,
    probabilityOfAddingFrenzyEgg: 0.75,


    create: function(){
        gameData.addBackground();
        this.frenzyEggPoints = gameData.frenzyPoints;
        this.numberOfEggsAddedToScreen = 0;
        this.hasAchievedBonus = false;
        this.frenzyTime = 0;
        this.createFrenzyTimer();
        gameData.createScoreText();
        // gameData.scoreText = game.add.text(10,10, "Score: " + score, {font: 'bold 60px Corbel', fill: '#003366'});
        this.frenzyStateGroup = game.add.group();
        this.minDistanceBetweenPoints = this.createFrenzyEgg(-500, -500);
        this.points = this.generatePoints();
        this.drawEggsAtPoints(this.points);
        this.numberOfEggsCollected = 0;
        this.elapsedTime = 0;
        gameData.createHeart();
        game.time.events.loop(1000, function(){
            if (this.frenzyTime >= this.durationOfFrenzyState){
                gameData.frenzyMusic.stop();
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
            gameData.score += this.bonusPointsFrenzy;
            gameData.scoreText.text = "Score: " + gameData.score;
            this.playBonusReceivedAnimation();
        }
        if (gameData.score > gameData.highestScore){
            gameData.highestScore = gameData.score;
        }

    },

    createFrenzyTimer: function () {
        var frenzyTimerFormatting = gameData.createFormatting("bold 50pt Corbel", "#ff0000");
        this.timer = game.add.text(canvasWidth / 2, 0.03 * canvasHeight, this.durationOfFrenzyState, frenzyTimerFormatting);
        this.timer.anchor.setTo(0.5, 0.5);
        this.timer.scale.setTo(scaleRatio, scaleRatio);
    },

    playBonusReceivedAnimation: function(){
        var bonusPointsFormat = gameData.createFormatting("bold 100pt Corbel", "#FF00FF");
        var bonusText = "BONUS: +" + this.bonusPointsFrenzy;
        gameData.createTweenAnimation(game.world.centerX, game.world.centerY, bonusText , bonusPointsFormat);

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
        gameData.lives--;
        gameData.updateLifeCountLabel();
        playState.calculateEggProbability(gameData.currentTime);
        egg.kill();
        if (gameData.lives == 0){
            gameData.explosion.play();
            gameData.frenzyMusic.stop();
            this.game.state.start('gameOver');
        } else{
            gameData.bombCollect.play();
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
        gameData.frenzyTouch.play();
        this.numberOfEggsCollected++;
        this.showScoreAnimation(eggX, eggY, this.frenzyEggPoints);
        gameData.score += this.frenzyEggPoints;
        gameData.scoreText.text = "Score: " + gameData.score;
    },

    showScoreAnimation: function(xCoordinate, yCoordinate, numberOfPoints){
        var scoreTextFormat = gameData.createFormatting("bold 40pt Corbel", "#003366");
        gameData.createTweenAnimation(xCoordinate, yCoordinate, numberOfPoints, scoreTextFormat, 700);
    },

};