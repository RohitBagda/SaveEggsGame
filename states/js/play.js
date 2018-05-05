var playState = {

    bombDisplayTexts: ["bruh", ":'(", "smh", "-___-"],
    timeStages: [5,6,7,8,9],

    create: function(){
        this.setupGame();
        gameData.setupSounds();
        this.setupPlayer();

        this.eggs = game.add.group();
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
                var eggImages = tutorialState.getEggImages();
                var eggDescription = tutorialState.getEggDescriptions();
                eggImages.forEach(function(image){
                    image.destroy();
                });
                eggDescription.forEach(function(description){
                    description.destroy();
                });
                game.paused = false;
                gameData.pauseLabel.setText("II");
            }
        }, this);

        // game.input.onDown.add(gameData.resumeGame(), this);

        game.time.events.loop(500, this.dropEgg, this);
        game.time.events.loop(1000, function(){
            gameData.currentTime++;
            let changeTime = gameData.currentTime;
            if(this.timeStages.includes(changeTime)){
                this.calculateEggProbability(changeTime);
            }
        }, this);
    },

    calculateEggProbability: function(time){
        if(time<this.timeStages[0]){
            gameData.setEggProbabilities(1,0,0,0,0,0);
        } else if(gameData.currentTime <this.timeStages[1]){
            gameData.setEggProbabilities(0.8,1,0,0,0,0);
        } else if(time < this.timeStages[2]){
            gameData.setEggProbabilities(0.6,0.9,1,0,0,0);
        } else if(time<this.timeStages[3]){
            gameData.setEggProbabilities(0.5,0.9,0.95,0.98,0,0);
        } else if(time <this.timeStages[4]){
            if(gameData.lives<gameData.maxLives){
                this.calculateEggProbWithOneUP();
            } else {
                this.calculateEggProbWithoutOneUP();
            }
        } 
    },

    calculateEggProbWithOneUP: function(){
        //gameData.setEggProbabilities(0.45,0.9,0.97,0.98,0.99,1);
        gameData.setEggProbabilities(0.45,0.5,0.6,0.61,0.9,1);
    },

    calculateEggProbWithoutOneUP: function(){
        gameData.setEggProbabilities(0.45,0.9,0.91,0.92,1,0);
    },

    update: function(){
        for(var i in this.eggs.children){
            var egg = this.eggs.children[i];
            egg.body.velocity.y= gameData.eggVelocity;

            if(gameData.score < 0){
                gameData.resetScore();
                this.changeToGameOverState();
            }

            if(egg.y <= gameData.player.y - egg.height){
                game.physics.arcade.collide(gameData.player, egg, this.collectEgg, null, this);
            } else if(egg.y > gameData.player.y+gameData.player.height-egg.height){
                this.crackEggs(egg);
            }

        }
    },

    changeToGameOverState: function () {
        window.setTimeout(function () {
            backgroundMusic.stop();
            game.state.start("gameOver");
        }, 100);
    },

    crackEggs: function(egg){
        if(egg.key === "egg"){
            gameData.tweenEgg("crackedEgg", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameData.regularEggPoints);
        } else if(egg.key === "bomb") {
            gameData.tweenEgg("bombCloud", egg);
            gameData.bombWhoosh.play();
        } else if(egg.key === "frenzy"){
            gameData.tweenEgg("crackedFrenzy", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameData.frenzyPoints);
        }  else if(egg.key === "scoreBoost") {
            gameData.tweenEgg("crackedScoreBoost", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameData.scoreBoostPoints);
        } else if(egg.key === "combo") {
            gameData.tweenEgg("crackedCombo", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameData.comboPoints);
        } else if(egg.key === "oneUp" ) {
            gameData.tweenEgg("crackedOneUp", egg);
            gameData.eggCrack.play();
        }

    },



    dropEgg: function(){
        let eggOffset = 50;
        var eggX = Math.random() * (canvasWidth-eggOffset);
        var eggY = -0.05 * canvasHeight;
        var eggType = this.getEggType();
        var egg = game.add.sprite(eggX, eggY, eggType);
        egg.scale.setTo(scaleRatio, scaleRatio);
        game.physics.enable(egg, Phaser.Physics.ARCADE);
        this.eggGravity = gameData.calculateEggGravity(gameData.currentTime);
        egg.body.gravity.y = this.eggGravity;
        this.eggs.add(egg);
    },

    getEggType: function(){
        var eggType;
        var randomNumber = Math.random();
        if(randomNumber <= gameData.regularEggProb){
            eggType = "egg";
        } else if(randomNumber<=gameData.bombProb) {
            eggType = "bomb";
        } else if(randomNumber<=gameData.frenzyProb) {
            eggType = "frenzy";
        } else if(randomNumber<=gameData.comboProb) {
            eggType = "combo";
        } else if(randomNumber<=gameData.scoreBoostProb) {
            eggType = "scoreBoost";
        }  else if(randomNumber<=gameData.oneUpProb && gameData.lives<gameData.maxLives){
            eggType = "oneUp";
        }
        return eggType;
    },

    setupGame: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight);
        gameData.addBackground();
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    setupPlayer: function(){
        gameData.createBasket();
    },

    collectEgg: function(player, egg){

        egg.kill();

        if (egg.key == "egg") {
            this.handleRegularEgg();
        } else if (egg.key == "bomb") {
            this.handleBomb();
        } else if (egg.key == "scoreBoost") {
            this.handleScoreBoost();
        } else if (egg.key == "combo") {
            this.handleCombo();
        } else if (egg.key == "frenzy") {
            this.handleFrenzy();
        } else if (egg.key == "oneUp"){
            this.handleOneUp();
        }
    },

    handleRegularEgg: function () {
        gameData.eggCollect.play();
        this.updateScoreAndPlayAnimation(gameData.regularEggPoints);
    },


    handleBomb: function(){
        gameData.bombCollect.play();
        gameData.decrementLives();
        gameData.updateLifeCountLabel();
        this.showBombCaughtText();

        if(gameData.lives<gameData.maxLives){
            this.calculateEggProbability(gameData.currentTime);
        }

        if (gameData.lives==0){
            gameData.checkHighScore();
            this.handlePlayerAtGameEnd();
            this.changeToGameOverState();
        }
    },

    handlePlayerAtGameEnd: function () {
        gameData.player.inputEnabled = false;
        gameData.player.body.checkCollision.up = false;
        gameData.explosion.play();
        gameData.player.animations.play('explodeBomb');
    },

    showBombCaughtText: function () {
        var index = Math.floor(Math.random() * 4);
        var bomdDisplayText = this.bombDisplayTexts[index];
        this.showTweenAnimation(bomdDisplayText);
    },

    handleScoreBoost: function () {
        this.updateScoreAndPlayAnimation(gameData.scoreBoostPoints);
        gameData.eggCollect.play();
    },

    handleCombo: function () {
        gameData.eggCollect.play();
        gameData.basketX = gameData.player.x;
        gameData.basketY = gameData.player.y;
        this.game.state.start("transitionToCombo");
    },

    handleFrenzy: function () {
        gameData.frenzyCollect.play();
        gameData.frenzyMusic.play();
        backgroundMusic.stop();
        this.game.state.start("transitionToFrenzy");
    },

    handleOneUp: function () {
        gameData.eggCollect.play();
        gameData.incrementLives();
        gameData.updateLifeCountLabel();
        if (gameData.lives >= gameData.maxLives) {
            this.calculateEggProbability(gameData.currentTime);
        }
    },

    showTweenAnimation: function(display){
        var tweenTextFormat = gameData.createFormatting("bold 80pt Corbel", "#ff0000");
        gameData.createTweenAnimation(game.world.centerX, game.world.centerY, display, tweenTextFormat, 300);
    },



    updateScoreAndPlayAnimation: function(points){
        this.showTweenAnimation(points);
        gameData.updateScore(points);
    },

};