
var frenzyState = {

    frenzyEggPoints: 20,
    bonusPointsFrenzy: 50,
    xVelocityFrenzyEgg: 100,
    durationOfFrenzyState: 3,

    create: function(){
        this.numberOfEggsAddedToScreen = 0;
        this.hasAchievedBonus = false;
        //Screen Setup
        this.currentTime = 0;
        game.add.sprite(0,0, "background");
        var frenzyTimerFormatting = {font: "bold 56pt Corbel", fill: "#0000ff"};

        this.timer = game.add.text(canvasWidth/2, 0.008 * canvasHeight, this.durationOfFrenzyState, frenzyTimerFormatting);
        this.timer.anchor.setTo(0.5, 0.2);
        this.timer.scale.setTo(scaleRatio, scaleRatio);

        this.scoreText = game.add.text(10,10, "Score: " + score, {font: 'bold 48px Corbel', fill: '#003366'});
        this.frenzyEggsGroup = game.add.group();
        this.minDistanceBetweenPoints = this.createFrenzyEgg(-500, -500);
        this.points = this.generatePoints();
        this.drawEggsAtPoints(this.points);
        this.numberOfEggsCollected = 0;
        this.elapsedTime = 0;
        
        // this.generateFrenzyEggs(7, 8);
        // this.jiggleFrenzyEggs();


        game.time.events.loop(1000, function(){
            if (this.currentTime >= this.durationOfFrenzyState){
                frenzyMusic.stop();
                backgroundMusic.play();
                this.game.state.start('play');
            } else{
                this.currentTime ++;
                this.timer.text = this.durationOfFrenzyState - this.currentTime;
            }
        }, this);
        // this.switchBackToPlay(this.currentTime);

    },


    update: function(){
        this.elapsedTime += game.time.physicsElapsedMS;
        if (this.elapsedTime >= 150) {
            this.changeXVelocityOfEgg();
            this.frenzyEggsGroup.forEach(function (egg) {
                egg.body.velocity.x = this.xVelocityFrenzyEgg;
            }, this);
            this.elapsedTime = 0;
        }
        if (this.numberOfEggsCollected == this.numberOfEggsAddedToScreen && !this.hasAchievedBonus){
            this.hasAchievedBonus = true;
            score += this.bonusPointsFrenzy;
            this.scoreText.text = "Score: " + score;
            this.playBonusReceivedAnimation();
        }

        if (score > highestScore){
            highestScore = score;
        }

    },

    playBonusReceivedAnimation: function(){
        var bonusPointsFormat = {font: "bold 100pt Corbel", fill: "#FF00FF"};
        bonusPointsFormat.stroke = "#A4CED9";
        bonusPointsFormat.strokeThickness = 5;
        var bonusText = "BONUS: +" + this.bonusPointsFrenzy;

        this.bonusPointsDisplay = this.game.add.text(game.world.centerX, game.world.centerY, bonusText , bonusPointsFormat);
        this.bonusPointsDisplay.anchor.setTo(0.5, 0.5);
        this.game.add.tween(this.bonusPointsDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 700);

    },

    generatePoints: function(){
        var poissonDiskSampler = new PoissonDiskSampler();
        poissonDiskSampler.radiusMin = this.minDistanceBetweenPoints/2;
        poissonDiskSampler.radiusMax = this.minDistanceBetweenPoints;
        poissonDiskSampler.createPoints();
        return poissonDiskSampler.pointList;
    },

    drawEggsAtPoints: function(points){
        let eggOffset = 50;
        var xOffSet = 0.1 * (canvasWidth-eggOffset);
        var topYOffSet = 0.018 * canvasHeight;
        var bottomYOffSet = 0.2 * canvasHeight;
        for (var i = 0; i < points.length; i++){
            let coordinate = points[i]
            if ((coordinate.x > xOffSet) && (coordinate.x < (canvasWidth - xOffSet))
                && (coordinate.y > topYOffSet) && (coordinate.y < (canvasHeight - bottomYOffSet))){
                var prob = Math.random();
                if (prob < 0.80){
                    this.createFrenzyEgg(coordinate.x, coordinate.y);
                    this.numberOfEggsAddedToScreen++;
                } else{
                    this.createBomb(coordinate.x, coordinate.y);
                }


            }

        }
    },

    createBomb: function(eggX, eggY){
        var eggType = "bomb";
        var frenzyEgg = game.add.sprite(eggX, eggY, eggType);
        frenzyEgg.scale.setTo(scaleRatio * 1.5, scaleRatio * 1.5);

        game.physics.arcade.enable(frenzyEgg, Phaser.Physics.ARCADE);
        // frenzyEgg.scale.setTo(scaleRatio, scaleRatio);
        game.physics.arcade.enable(frenzyEgg);

        // frenzyEgg.enableDrag();
        frenzyEgg.body.kinematic = true;
        frenzyEgg.inputEnabled = true;
        frenzyEgg.input.enableDrag(false, true, true);
        frenzyEgg.input.allowVerticalDrag = true;
        frenzyEgg.collideWorldBounds = true;
        frenzyEgg.body.immovable = true;
        // this.eggsInState.push(frenzyEgg);
        this.frenzyEggsGroup.add(frenzyEgg);
        // frenzyEgg.enableDrag(true, true, true, true, true, true);
        //this.eggsOnScreen.push(frenzyEgg);
        frenzyEgg.events.onInputDown.add(this.collectBomb, this);
    },

    collectBomb: function(egg){
        lives--;
        egg.kill();
        if (lives == 0){
           explosion.play();
            frenzyMusic.stop();
            this.game.state.start('gameOver');
        } else{

        }
        bombCollect.play();

    },

    createFrenzyEgg: function (eggX, eggY) {
        var eggType = "frenzy";
        var frenzyEgg = game.add.sprite(eggX, eggY, eggType);
        game.physics.arcade.enable(frenzyEgg, Phaser.Physics.ARCADE);
        game.physics.arcade.enable(frenzyEgg);
        frenzyEgg.scale.setTo(scaleRatio * 1.5, scaleRatio * 1.5);
        frenzyEgg.body.kinematic = true;
        frenzyEgg.inputEnabled = true;
        frenzyEgg.input.enableDrag(false, true, true);
        frenzyEgg.input.allowVerticalDrag = true;
        frenzyEgg.collideWorldBounds = true;
        frenzyEgg.body.immovable = true;
        this.frenzyEggsGroup.add(frenzyEgg);
        frenzyEgg.events.onInputDown.add(this.collectEgg, this);
        console.log("eggWidth: " + frenzyEgg.width + "eggHeight: " + frenzyEgg.height);

        var distanceSquared = Math.pow(frenzyEgg.width, 2) + Math.pow(frenzyEgg.height, 2);
        var distance = Math.pow(distanceSquared, 0.5);

        return distance;
    },


    changeXVelocityOfEgg: function(){
        this.xVelocityFrenzyEgg = -1 * this.xVelocityFrenzyEgg;
        // return -1*this.xVelocityGravityFrenzyEgg;
    },

    collectEgg: function(egg){
        // this.game.state.start('menu');
        let eggX = egg.x;
        let eggY = egg.y;

        egg.kill();
        frenzyTouch.play();
        this.numberOfEggsCollected++
        this.createScoreAnimation(eggX, eggY, this.frenzyEggPoints);
        score += this.frenzyEggPoints;
        this.scoreText.text = "Score: " + score;

    },

    createScoreAnimation: function(xCoordinate, yCoordinate, numberOfPoints){
        
        let scoreText = "+" + numberOfPoints;
        var scoreTextFormat = {font: "bold 40pt Corbel", fill: "#003366"};
        scoreTextFormat.stroke = "#000000";
        scoreTextFormat.strokeThickness = 5;

        this.scoreTextDisplay = this.game.add.text(xCoordinate, yCoordinate, scoreText, scoreTextFormat);

        this.game.add.tween(this.scoreTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 1000);
    },

};