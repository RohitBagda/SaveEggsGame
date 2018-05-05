var playState = {

    bombDisplayTexts: ["bruh", ":'(", "-_-", "Oops"],
    timeStages: [5, 15, 20, 30, 60],

    create: function(){
        this.setupGame();
        gameController.setupSounds();
        this.setupPlayer();

        this.eggs = game.add.group();
        gameController.createScoreText();
        gameController.createHeart();
        gameController.createPause();

        game.time.events.loop(500, this.dropEgg, this);
        game.time.events.loop(1000, function(){
            gameController.currentTime++;
            let changeTime = gameController.currentTime;
            if(this.timeStages.includes(changeTime)){
                this.calculateEggProbability(changeTime);
            }
        }, this);
    },

    calculateEggProbability: function(time){
        if(time<this.timeStages[0]){
            gameController.setEggProbabilities(1,0,0,0,0,0);
        } else if(gameController.currentTime <this.timeStages[1]){
            gameController.setEggProbabilities(0.8,1,0,0,0,0);
        } else if(time < this.timeStages[2]){
            gameController.setEggProbabilities(0.6,0.9,1,0,0,0);
        } else if(time<this.timeStages[3]){
            gameController.setEggProbabilities(0.5,0.9,0.98,1,0,0);
        } else if(time <this.timeStages[4]){
            if(gameController.lives<gameController.maxLives){
                this.calculateEggProbWithOneUP();
            } else {
                this.calculateEggProbWithoutOneUP();
            }
        } 
    },

    calculateEggProbWithOneUP: function(){
        gameController.setEggProbabilities(0.45,0.9,0.95,0.97,0.99,1);
        // gameController.setEggProbabilities(0.45,0.5,0.6,0.61,0.9,1);
    },

    calculateEggProbWithoutOneUP: function(){
        gameController.setEggProbabilities(0.45,0.9,0.95,0.97,1,0);
    },

    update: function(){
        for(var i in this.eggs.children){
            var egg = this.eggs.children[i];
            egg.body.velocity.y= gameController.eggVelocity;

            if(gameController.score < 0){
                gameController.resetScore();
                this.changeToGameOverState();
            }

            if(egg.y <= gameController.player.y - egg.height){
                game.physics.arcade.collide(gameController.player, egg, this.collectEgg, null, this);
            } else if(egg.y > gameController.player.y+gameController.player.height-egg.height){
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
            gameController.tweenEgg("crackedEgg", egg);
            gameController.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameController.regularEggPoints);
        } else if(egg.key === "bomb") {
            gameController.tweenEgg("bombCloud", egg);
            gameController.bombWhoosh.play();
        } else if(egg.key === "frenzy"){
            gameController.tweenEgg("crackedFrenzy", egg);
            gameController.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameController.frenzyPoints);
        }  else if(egg.key === "scoreBoost") {
            gameController.tweenEgg("crackedScoreBoost", egg);
            gameController.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameController.scoreBoostPoints);
        } else if(egg.key === "combo") {
            gameController.tweenEgg("crackedCombo", egg);
            gameController.eggCrack.play();
            this.updateScoreAndPlayAnimation(-gameController.comboPoints);
        } else if(egg.key === "oneUp" ) {
            gameController.tweenEgg("crackedOneUp", egg);
            gameController.eggCrack.play();
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
        this.eggGravity = gameController.calculateEggGravity(gameController.currentTime);
        egg.body.gravity.y = this.eggGravity;
        this.eggs.add(egg);
    },

    getEggType: function(){
        var eggType;
        var randomNumber = Math.random();
        if(randomNumber <= gameController.regularEggProb){
            eggType = "egg";
        } else if(randomNumber<=gameController.bombProb) {
            eggType = "bomb";
        } else if(randomNumber<=gameController.frenzyProb) {
            eggType = "frenzy";
        } else if(randomNumber<=gameController.comboProb) {
            eggType = "combo";
        } else if(randomNumber<=gameController.scoreBoostProb) {
            eggType = "scoreBoost";
        }  else if(randomNumber<=gameController.oneUpProb && gameController.lives<gameController.maxLives){
            eggType = "oneUp";
        }
        return eggType;
    },

    setupGame: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight);
        gameController.addBackground();
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    setupPlayer: function(){
        gameController.createBasket();
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
        gameController.eggCollect.play();
        this.updateScoreAndPlayAnimation(gameController.regularEggPoints);
    },


    handleBomb: function(){
        gameController.bombCollect.play();
        gameController.decrementLives();
        gameController.updateLifeCountLabel();
        this.showBombCaughtText();

        if(gameController.lives<gameController.maxLives){
            this.calculateEggProbability(gameController.currentTime);
        }

        if (gameController.lives==0){
            gameController.checkHighScore();
            this.handlePlayerAtGameEnd();
            this.changeToGameOverState();
        }
    },

    handlePlayerAtGameEnd: function () {
        gameController.player.inputEnabled = false;
        gameController.player.body.checkCollision.up = false;
        gameController.explosion.play();
        gameController.player.animations.play('explodeBomb');
    },

    showBombCaughtText: function () {
        var index = Math.floor(Math.random() * 4);
        var bomdDisplayText = this.bombDisplayTexts[index];
        this.showTweenAnimation(bomdDisplayText);
    },

    handleScoreBoost: function () {
        this.updateScoreAndPlayAnimation(gameController.scoreBoostPoints);
        gameController.eggCollect.play();
    },

    handleCombo: function () {
        gameController.eggCollect.play();
        gameController.basketX = gameController.player.x;
        gameController.basketY = gameController.player.y;
        this.game.state.start("transitionToCombo");
    },

    handleFrenzy: function () {
        gameController.frenzyCollect.play();
        gameController.frenzyMusic.play();
        backgroundMusic.stop();
        this.game.state.start("transitionToFrenzy");
    },

    handleOneUp: function () {
        gameController.eggCollect.play();
        gameController.incrementLives();
        gameController.updateLifeCountLabel();
        if (gameController.lives >= gameController.maxLives) {
            this.calculateEggProbability(gameController.currentTime);
        }
    },

    showTweenAnimation: function(display){
        var tweenTextFormat = gameController.createFormatting("bold 80pt Corbel", "#ff0000");
        gameController.createTweenAnimation(game.world.centerX, game.world.centerY, display, tweenTextFormat, 300);
    },



    updateScoreAndPlayAnimation: function(points){
        this.showTweenAnimation(points);
        gameController.updateScore(points);
    },

};