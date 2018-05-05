var comboState = {

    comboTime: 0,
    comboEggCaughtPerWaveCount: 0,
    waveScore: 0,
    comboDuration: 12,
    comboEggsDropDuration: 10,

    create: function(){
        gameData.addBackground();
        gameData.createScoreText();
        gameData.createHeart();
        gameData.createPauseLabel();
        this.comboEggPoints=gameData.comboPoints;
        this.comboTime=0;
        this.setupPlayer();
        this.comboEggs = game.add.group();

        gameData.pauseLabel.events.onInputUp.add(function(){
            gameData.pauseLabel.setText("►");
            game.paused = true;
            tutorialState.createEggDes();
        }, this);

        game.input.onDown.add(function(){
            if(game.paused) {
                var eggPics = tutorialState.getEggImages();
                var eggDes = tutorialState.getEggDescriptions();
                eggPics.forEach(function(image){
                    image.destroy();
                });
                eggDes.forEach(function(description){
                    description.destroy();
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
            comboEgg.body.velocity.y=gameData.eggVelocity;

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

    setupPlayer: function(){
        //Create basket player sprite and enable physics
        gameData.createBasket(gameData.basketX, gameData.basketY);
    },

    dropComboEggWave: function() {
        if (this.comboTime<=this.comboEggsDropDuration) {
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
            eggY -= yOffSet;
            eggX += xOffset;
            var eggType = "combo";
            var egg = game.add.sprite(eggX, eggY, eggType);
            egg.scale.setTo(scaleRatio, scaleRatio);
            game.physics.arcade.enable(egg);
            this.eggGravity = gameData.calculateEggGravity(gameData.currentTime);
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

    collectComboEgg: function(player, egg) {
        gameData.eggCollect.play();
        egg.kill();
        this.comboEggCaughtPerWaveCount++;
        this.waveScore += this.comboEggPoints;
        this.updateScore(this.comboEggPoints);
    },

    showScoreAnimation: function(display){
        var scoreTextFormat = gameData.createFormatting("bold 80pt Corbel","#003366");
        gameData.createTweenAnimation(game.world.centerX, game.world.centerY, display, scoreTextFormat, 300);
    },

    updateScore: function(points){
        gameData.updateScore(points);
    }
};