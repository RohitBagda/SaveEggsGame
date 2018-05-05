var comboState = {

    comboTime: 0,
    comboEggCaughtPerWaveCount: 0,
    comboEggPoints: 100,
    waveScore: 0,
    comboDuration: 12,
    comboEggsDropDuration: 10,

    create: function(){

        this.comboTime=0;
        gameData.addBackground();
        this.setupPlayer();
        this.comboEggs = game.add.group();
        gameData.createScoreText();
        gameData.createHeart();
        //Create pause label button
        gameData.createPauseLabel();

        gameData.pauseLabel.events.onInputUp.add(function(){
            gameData.pauseLabel.setText("►");
            game.paused = true;
            tutorialState.createEggDes();
        }, this);

        game.input.onDown.add(function(){
            if(game.paused) {
                var eggPics = tutorialState.getEggImages();
                var eggDes = tutorialState.getEggDescriptions();

                eggPics.forEach(function(pics){
                    pics.destroy();
                });

                eggDes.forEach(function(pics){
                    pics.destroy();
                });

                game.paused = false;
                gameData.pauseLabel.setText("II");
            }
        }, this);


        game.time.events.loop(1000, this.dropComboEggWave, this);

        game.time.events.loop(1000, function(){
            if(this.comboTime>this.comboDuration){
                this.waveScore = 0;
                gameData.basketX = gameData.player.x;
                gameData.basketY = gameData.player.y;
                this.game.state.start('play');
            } else {
                this.comboTime++;
            }
        }, this);
    },

    update: function(){
        for(var i in this.comboEggs.children){
            var comboEgg = this.comboEggs.children[i];
            comboEgg.body.velocity.y=20;

            if(comboEgg.y <= gameData.player.y - comboEgg.height){
                game.physics.arcade.collide(gameData.player, comboEgg, this.collectComboEgg, null, this);
            } else if(comboEgg.y > gameData.player.y+gameData.player.height-comboEgg.height){
                this.crackComboEggs(comboEgg);
            }
        }

    },

    crackComboEggs: function(egg){
        if(egg.key==="combo") {
            gameData.tweenEgg("crackedCombo", egg);
            gameData.eggCrack.play();
        }

    },

    // tweenComboEggs: function(cracked, egg){
    //     egg.loadTexture(cracked,0);
    //     egg.body.gravity.y = 0;
    //     this.game.add.tween(egg)
    //         .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 300);
    // },

    setupPlayer: function(){
        //Create basket player sprite and enable physics
        gameData.createBasket(gameData.basketX, gameData.basketY);
    },

    dropComboEggWave: function() {
        if (this.comboTime<=this.comboEggsDropDuration) {
            // var numEggs = 1;
            var numEggs = Math.floor(Math.random() * 4) + 1;
            this.createComboWave(numEggs);
        }
        this.comboEggCaughtPerWaveCount = 0;
        if(this.waveScore>0){
            this.showScoreAnimation(this.waveScore);
            this.waveScore=0;
        }
    },

    createComboWave: function(numEggs){
        var eggX = this.calculateInitialX();
        var xOffset = this.calculateXOffset(eggX);
        var eggY = -0.05 * canvasHeight;
        var yOffSet = 100;
        for (var i = 0; i < numEggs; i++){
            // var eggX = Math.random() * (canvasWidth-40);
            eggY -= yOffSet;
            eggX += xOffset;
            var eggType = "combo";

            var egg = game.add.sprite(eggX, eggY, eggType);
            egg.scale.setTo(scaleRatio, scaleRatio);

            game.physics.arcade.enable(egg);
            this.eggGravity = this.calculateEggGravity(gameData.currentTime);
            egg.body.gravity.y = this.eggGravity;
            this.comboEggs.add(egg);
        }


    },

    calculateInitialX: function () {
        let edgeGap = 40 + Math.random()*10;
        let xStart = edgeGap;
        let xEnd = canvasWidth-edgeGap;
        var initialXOptions = [xStart, xEnd];
        var num = Math.floor(Math.random()*(initialXOptions.length));
        return initialXOptions[num];
    },

    calculateXOffset: function (xPos) {
        var xOffset = 200;
        if(xPos>canvasWidth/2){
            xOffset = -xOffset;
        }

        return xOffset;
    },

    calculateEggGravity: function(){
        return  1.4 * 1.2*(40000/(1+Math.exp(-0.1*(gameData.currentTime-30)))+40000);
    },

    collectComboEgg: function(player, egg) {
        gameData.eggCollect.play();
        egg.kill();
        this.comboEggCaughtPerWaveCount++;
        this.waveScore += this.comboEggPoints;
        this.updateScore(this.comboEggPoints);
        // this.updateScore(100);
    },

    showScoreAnimation: function(display){
        var scoreTextFormat = {font: "bold 80pt Corbel", fill: "#003366"};
        scoreTextFormat.stroke = "#A4CED9";
        scoreTextFormat.strokeThickness = 5;
        var scoreText = "+" + display;

        this.comboTextDisplay = this.game.add.text(game.world.centerX, game.world.centerY, scoreText, scoreTextFormat);
        this.comboTextDisplay.anchor.setTo(0.5, 0.5);
        this.game.add.tween(this.comboTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 300);

    },


    updateScore: function(points){
        gameData.updateScore(points);
        // score += points;
        // this.scoreText.text = 'Score: ' + score;
    }

};