
var frenzyState = {

    // eggsInState: {},
    frenzyEggPoints: 2,
    eggsOnScreenCoordinates: [],

    eggsOnScreen: [],

    xVelocityFrenzyEgg: 100,

    durationOfFrenzyState: 5,

    create: function(){
        //Screen Setup
        this.currentTime = 0;
        game.add.sprite(0,0, "background");
        //this.player = game.add.sprite(canvasWidth/2, canvasHeight/1.2, "basket");

        var frenzyTimerFormatting = {font: "bold 56git pt Corbel", fill: "#0000ff"};

        this.timer = game.add.text(canvasWidth/2, 0.008 * canvasHeight, this.durationOfFrenzyState, frenzyTimerFormatting);
        this.timer.anchor.setTo(0.5, 0.2)
        this.timer.scale.setTo(scaleRatio, scaleRatio);

        this.scoreText = game.add.text(10,10, "Score: " + score, {fontSize: '24px'});
        this.frenzyEggsGroup = game.add.group();


        this.generateFrenzyEggs(7, 8);
        // this.jiggleFrenzyEggs();


        game.time.events.loop(1000, function(){
            // Console.log(this.currentTime);
            if (this.currentTime >= this.durationOfFrenzyState){
                // game.time.events.stop();
                // this.frenzyEggsGroup.delete();
                this.game.state.start('play');
            } else{
                this.currentTime ++;
                this.timer.text = this.durationOfFrenzyState - this.currentTime;
            }
        }, this);
        // this.switchBackToPlay(this.currentTime);

    },


    update: function(){

    },

    generateFrenzyEggs: function(numRows, numColumns){
        var xOffSet = 70;
        var yOffSet = 120;
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
                if (decideWhetherToAddEgg > 0.72){
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
        //this.eggsOnScreen.push(frenzyEgg);
        this.jiggle(frenzyEgg);
        frenzyEgg.events.onInputDown.add(this.collectEgg, this);


        // this.frenzyEggsGroup.body.checkCollision.right = false;
        // this.frenzyEggsGroup.body.checkCollision.left = false;
        // this.frenzyEggsGroup.body.checkCollision.down = false;
    },

    // generateFrenzyEggCoordinates: function() {
    //     var eggX = this.generateFrenzyEggXCoordinate();
    //     var eggY = this.generateFrenzyEggYCoordinate();
    //     return [eggX, eggY];
    // },

    // jiggleFrenzyEggs: function(){
    //     console.log("check");
    //     for (var i in this.frenzyEggsGroup.children){
    //         // var egg = this.frenzyEggsGroup.children[i];
    //         this.jiggle(this.frenzyEggsGroup.children[i]);
    //     }
    // },




    jiggle: function(egg){



        // var xOffSet = 50;
        // var newXPositionRightShift = egg.position.x + xOffSet;
        // var newXPositionLeftShift =  egg.position.x - xOffSet;
        // egg.body.velocity.x = this.xVelocityFrenzyEgg;
        // while (this.currentTime < this.durationOfFrenzyState){
        //     if (egg.position.x == newXPositionRightShift || egg.position.x == newXPositionLeftShift){
        //         this.changeXVelocityOfEgg();
        //         egg.body.velocity.x = this.xVelocityFrenzyEgg;
        //     }
        // }

        game.time.events.loop(100, function(){
            this.changeXVelocityOfEgg();
            egg.body.velocity.x = this.xVelocityFrenzyEgg;
            // console.log(this.xVelocityFrenzyEgg);
        }, this)
    },

    changeXVelocityOfEgg: function(){
        this.xVelocityFrenzyEgg = -1 * this.xVelocityFrenzyEgg;
        // return -1*this.xVelocityGravityFrenzyEgg;
    },

    // generateFrenzyEggXCoordinate: function() {
    //     // return Math.random()*450;
    //     return Math.random() * (canvasWidth-80);
    // },
    //
    // generateFrenzyEggYCoordinate: function() {
    //     // return Math.random()*450;
    //     return Math.random() * (canvasHeight-400);
    // },

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


};