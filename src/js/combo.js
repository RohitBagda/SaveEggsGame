var comboState = {

    comboTime: 0,
    comboEggCaughtPerWaveCount: 0,
    waveScore: 0,
    comboDuration: 12,
    comboEggsDropDuration: 10,

    create: function(){
        gameController.addBackground();
        gameController.createScoreText();
        gameController.createHeart();

        this.comboEggPoints=gameController.comboPoints;
        this.comboTime=0;
        this.setupPlayer();
        this.comboEggs = game.add.group();

        gameController.createPause();

        game.time.events.loop(1000, this.dropComboEggWave, this);
        game.time.events.loop(1000, function(){
            if(this.comboTime>this.comboDuration){
                this.waveScore = 0;
                gameController.basketX = gameController.player.x;
                gameController.basketY = gameController.player.y;
                this.game.state.start('play');
            } else {
                this.comboTime++;
            }
        }, this);
    },

    update: function(){
        for(var i in this.comboEggs.children){
            var comboEgg = this.comboEggs.children[i];
            comboEgg.body.velocity.y=gameController.eggVelocity;

            if(comboEgg.y <= gameController.player.y - comboEgg.height){
                game.physics.arcade.collide(gameController.player, comboEgg, this.collectComboEgg, null, this);
            } else if(comboEgg.y > gameController.player.y+gameController.player.height-comboEgg.height){
                this.crackComboEggs(comboEgg);
            }
        }

    },

    crackComboEggs: function(egg){
        if(egg.key==="combo") {
            gameController.tweenEgg("crackedCombo", egg);
            gameController.eggCrack.play();
        }

    },

    setupPlayer: function(){
        //Create basket player sprite and enable physics
        gameController.createBasket(gameController.basketX, gameController.basketY);
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
            this.eggGravity = gameController.calculateEggGravity(gameController.currentTime);
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
        gameController.eggCollect.play();
        egg.kill();
        this.comboEggCaughtPerWaveCount++;
        this.waveScore += this.comboEggPoints;
        this.updateScore(this.comboEggPoints);
    },

    showScoreAnimation: function(display){
        var scoreTextFormat = gameController.createFormatting("bold 80pt Corbel","#003366");
        gameController.createTweenAnimation(game.world.centerX, game.world.centerY, display, scoreTextFormat, 300);
    },

    updateScore: function(points){
        gameController.updateScore(points);
    }
};