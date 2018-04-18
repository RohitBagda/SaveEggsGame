
var frenzyState = {

    // eggsInState: {},
    frenzyEggPoints: 2,
    eggsOnScreenCoordinates: [],

    create: function(){
        //Screen Setup
        this.currentTime = 0;
        game.add.sprite(0,0, "background");
        //this.player = game.add.sprite(canvasWidth/2, canvasHeight/1.2, "basket");

        this.scoreText = game.add.text(10,10, "Score: " + score, {fontSize: '24px'});
        this.frenzyEggsGroup = game.add.group();

        //randomly generate 20 eggs
        this.generateFrenzyEggs(7, 8);


        game.time.events.loop(1000, function(){
            // Console.log(this.currentTime);
            if (this.currentTime >= 5){
                // game.time.events.stop();
                this.game.state.start('play');
            } else{
                this.currentTime ++;
            }
        }, this);
        // this.switchBackToPlay(this.currentTime);

    },

    update: function(){
        // console.log("shoot me now wtf");
    },

    generateFrenzyEggs: function(numRows, numColumns){
        var xOffSet = 70;
        var yOffSet = 150;
        var horizontalBlockPerEgg = (canvasWidth - xOffSet)/numColumns;
        var verticalBlockPerEgg = (canvasHeight * 3/4)/numRows;
        var eggRows = new Array(numRows);
        for (var i = 0; i < eggRows.length; i++){
            eggRows[i] = new Array(numColumns);
            var startY = i * verticalBlockPerEgg + yOffSet;
            for (var j = 0; j < eggRows[i].length; j++){
                var extraYOffSet = 20;
                var startX = j * horizontalBlockPerEgg + xOffSet;
                var decideWhetherToAddEgg = Math.random();
                var decideWhetherToShiftUp = Math.random();
                if (decideWhetherToAddEgg > 0.65){
                    if (decideWhetherToShiftUp < 0.3){
                        var y = startY + extraYOffSet
                        this.createFrenzyEgg(startX, y);
                    } else if (decideWhetherToShiftUp < 0.7) {
                        this.createFrenzyEgg(startX, startY);
                    } else{
                        var y = startY - extraYOffSet;
                        this.createFrenzyEgg(startX, y);
                    }
                    // this.createFrenzyEgg(startX, startY);
                }



            }
        }


        // for (var i = 0; i < numberOfFrenzyEggs; i++){
        //     var newCoordinates = this.generateFrenzyEggCoordinates();
        //     var eggX = newCoordinates[0];
        //     var eggY = newCoordinates[1];
        //     var overlapping =  this.checkFrenzyEggOverlap(eggX, eggY);
        //     while(overlapping){
        //         newCoordinates = this.generateFrenzyEggCoordinates();
        //         eggX = newCoordinates[0];
        //         eggY = newCoordinates[1];
        //         overlapping = this.checkFrenzyEggOverlap(eggX, eggY)
        //     }
        //     var coordinatesCreated = [eggX, eggY];
        //     this.eggsOnScreenCoordinates.push(coordinatesCreated);
        //     this.createFrenzyEgg(eggX, eggY);
        // }
    },

    createFrenzyEgg: function (eggX, eggY) {
        var eggType = "frenzy";
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
        frenzyEgg.events.onInputDown.add(this.collectEgg, this);


        // this.frenzyEggsGroup.body.checkCollision.right = false;
        // this.frenzyEggsGroup.body.checkCollision.left = false;
        // this.frenzyEggsGroup.body.checkCollision.down = false;
    },

    generateFrenzyEggCoordinates: function() {
        var eggX = this.generateFrenzyEggXCoordinate();
        var eggY = this.generateFrenzyEggYCoordinate();
        return [eggX, eggY];
    },

    generateFrenzyEggXCoordinate: function() {
        // return Math.random()*450;
        return Math.random() * (canvasWidth-80);
    },

    generateFrenzyEggYCoordinate: function() {
        // return Math.random()*450;
        return Math.random() * (canvasHeight-400);
    },

    checkFrenzyEggOverlap: function(x, y) {

        // for(var i=0; i<this.eggsOnScreenCoordinates.length; i++){
        //
        //     if (this.eggsOnScreenCoordinates[0][0] +
        //
        // };
        return false;
    },

    collectEgg: function(egg){
        // this.game.state.start('menu');
        let eggX = egg.x;
        let eggY = egg.y;

        egg.kill();
        this.createScoreAnimation(eggX, eggY, this.frenzyEggPoints);
        // alert("this is fine");
        //this.game.state.states['gameData'].updateScoreFromFrenzy();
        score += this.frenzyEggPoints;
        this.scoreText.text = "Score: " + score;

    },

    createScoreAnimation: function(xCoordinate, yCoordinate, numberOfPoints){
        
        let scoreText = "+" + numberOfPoints;
        var scoreTextFormat = {font: "bold 40pt Arial", fill: "#0000ff"};
        scoreTextFormat.stroke = "#000000";
        scoreTextFormat.strokeThickness = 5;

        this.scoreTextDisplay = this.game.add.text(xCoordinate, yCoordinate, scoreText, scoreTextFormat);

        this.game.add.tween(this.scoreTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 1000)
            .onComplete.add(function () {
                console.log("This is called when the tween is done.");
            }, this
        );

    },

    // switchBackToPlay: function(time){
    //     if (time >= 5){
    //         game.time.events.stop();
    //         // this.game.state.states['gameData'].score = this.score;
    //         this.game.state.start("play");
    //     }
    //
    // },

    // createNewEgg: function(){
    //     this.game.state.states['gameData'].updateScoreFromFrenzy();
    //     this.scoreText.text = "Score: " + this.game.state.states['gameData'].score;
    //     // this.eggsInState.shift().destroy();
    //     this.generateFrenzyEggs(1)
    // },

    generateTopLeftCoordinates: function (){

    }

};