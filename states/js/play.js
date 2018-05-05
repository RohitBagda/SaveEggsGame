var playState = {

    bombDisplayTexts: ["bruh", ":'(", "smh", "-___-"],
    timeStages: [5,6,7,8,9],
    heartList: [],

    create: function(){
        this.setupGame();
        gameData.setupSounds();
        // this.setupSounds();
        this.setupPlayer();

        this.eggs = game.add.group();
        this.eggGravity = 50000;
        // this.playerSpeed = 400;

        // This will contain the score and the timer.
        // this.scoreText = game.add.text(0.05*canvasWidth,0.02*canvasWidth,'Score: ' + score, {font: 'bold 60px Corbel', fill: '#003366'});
        gameData.createScoreText();

        life.createHeart();

        //Create pause label button
        this.pause_label = this.game.add.text(0.92*canvasWidth, 0.02*canvasHeight, 'II', {font:'bold 60px Corbel', fill:'#003366'});
        this.pause_label.inputEnabled = true;

        this.pause_label.events.onInputUp.add(function(){
            this.pause_label.setText("►");

            game.paused = true;

            tutorialState.createEggDes();
        }, this);

        game.input.onDown.add(function(){
            if(game.paused) {
                var eggPics = tutorialState.getEggPics();
                var eggDes = tutorialState.getDes();

                eggPics.forEach(function(pics){
                    pics.destroy();
                });

                eggDes.forEach(function(pics){
                    pics.destroy();
                });

                game.paused = false;
                this.pause_label.setText("II");
            }
        }, this);

        game.time.events.loop(500, this.dropEgg, this);

        game.time.events.loop(1000, function(){
            currentTime++;
            let changeTime = currentTime;
            if(this.timeStages.includes(changeTime))
            this.calculateEggProbability(changeTime);
        }, this);
    },

    calculateEggProbability: function(time){
        if(time<this.timeStages[0]){
            regularEggProb = 1;
        } else if(currentTime <this.timeStages[1]){
            regularEggProb = 0.8;
            bombProb = 1;
        } else if(time < this.timeStages[2]){
            regularEggProb = 0.6;
            bombProb = 0.9;
            scoreBoostProb = 1;
        } else if(time<this.timeStages[3]){
            regularEggProb = 0.5;
            bombProb = 0.9;
            scoreBoostProb =0.95;
            frenzyProb = 0.98;
        } else if(time <this.timeStages[4]){
            if(lives<3){
                this.calculateEggProbWithOneUP();
            } else {
                this.calculateEggProbWithoutOneUP();
            }
        } 
    },

    calculateEggProbWithOneUP: function(){
        // regularEggProb = 0.45;
        // bombProb = 0.9;
        // scoreBoostProb = 0.97;
        // frenzyProb = 0.98;
        // comboProb = 0.99;
        // oneUpProb = 1;
        regularEggProb = 0.45;
        bombProb = 0.5;
        scoreBoostProb = 0.6;
        frenzyProb = 0.61;
        comboProb = 0.9;
        oneUpProb = 1;
    },

    calculateEggProbWithoutOneUP: function(){
        regularEggProb = 0.45;
        bombProb = 0.9;
        scoreBoostProb = 0.91;
        frenzyProb = 0.92;
        comboProb = 1;
        oneUpProb = 0;
    },

    update: function(){
        for(var i in this.eggs.children){
            var egg = this.eggs.children[i];
            egg.body.velocity.y=20;

            if(gameData.score < 0){
                if (gameData.highestScore < gameData.score) {
                    gameData.highestScore = gameData.score;
                }
                gameData.score = 0;

                window.setTimeout(function(){
                    backgroundMusic.stop();
                    game.state.start("gameOver");
                }, 100);
            }

            if(egg.y <= this.player.y - egg.height/1.2){
                game.physics.arcade.collide(this.player, egg, this.collectEgg, null, this);
            } else if(egg.y > this.player.y+this.player.height-egg.height){
                this.crackEggs(egg);
            }

        }
    },

    crackEggs: function(egg){
        if(egg.key === "egg"){
            this.tweenEggs("crackedEgg", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-5);
        } else if(egg.key === "bomb") {
            this.tweenEggs("bombCloud", egg);
            gameData.bombWhoosh.play();
        } else if(egg.key === "frenzy"){
            this.tweenEggs("crackedFrenzy", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-20);
        }  else if(egg.key === "scoreBoost") {
            this.tweenEggs("crackedScoreBoost", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-30);
        } else if(egg.key === "combo") {
            this.tweenEggs("crackedCombo", egg);
            gameData.eggCrack.play();
            this.updateScoreAndPlayAnimation(-100);
        } else if(egg.key === "oneUp" ) {
            this.tweenEggs("crackedOneUp", egg);
            gameData.eggCrack.play();
        }

    },

    tweenEggs: function(cracked, egg){
        egg.loadTexture(cracked,0);
        egg.body.gravity.y = 0;
        this.game.add.tween(egg)
            .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 300);
    },

    dropEgg: function() {
        var numEggs = 1;
        // var numEggs = Math.floor(Math.random() * 4);

        this.createWave(numEggs);
    },

    createWave: function(numEggs){
        let eggOffset = 50;
        for (var i = 0; i < numEggs; i++){
            var eggX = Math.random() * (canvasWidth-eggOffset);
            var eggY = -0.05 * canvasHeight;
            var egg;
            var eggType;

            if(this.currentTime < 15){
                eggType = "egg";
            } else {
                eggType = this.getEggType();
            }

            egg = game.add.sprite(eggX, eggY, eggType);
            egg.scale.setTo(scaleRatio, scaleRatio);
            game.physics.enable(egg, Phaser.Physics.ARCADE);

            this.eggGravity = this.calculateEggGravity(currentTime);
            egg.body.gravity.y = this.eggGravity;
            this.eggs.add(egg);
        }
    },

    getEggType: function(){
        var eggType;
        var randomNumber = Math.random();
        if(randomNumber <= regularEggProb){
            eggType = "egg";
        } else if(randomNumber<=bombProb) {
            eggType = "bomb";
        } else if(randomNumber<=frenzyProb) {
            eggType = "frenzy";
        } else if(randomNumber<=comboProb) {
            eggType = "combo";
        } else if(randomNumber<=scoreBoostProb) {
            eggType = "scoreBoost";
        }  else if(randomNumber<=oneUpProb && lives<3){
            eggType = "oneUp";
        }
        return eggType;
    },

    setupGame: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight+100);
        game.add.sprite(0,0, "background");
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    // setupSounds: function() {
    //     gameData.setupSounds();
    //     // eggCrack = game.add.audio('egg_crack');
    //     // eggCrack.volume = 0.6;
    //     //
    //     // frenzyMusic = game.add.audio('frenzy_music');
    //     // frenzyMusic.volume = 0.4;
    //     // frenzyCollect = game.add.audio('frenzy_collect');
    //     // frenzyCollect.volume = 0.4;
    //     //
    //     // eggCollect = game.add.audio('egg_collect');
    //     // eggCollect.volume = 0.6;
    //     //
    //     // explosion = game.add.audio('explosion');
    //     // explosion.volume = 0.8;
    //     //
    //     // bombWhoosh = game.add.audio('bomb_whoosh');
    //     // bombWhoosh.volume = 0.6;
    //     //
    //     // frenzyTouch = game.add.audio('frenzy_touch');
    //     // frenzyTouch.volume = 0.3;
    //     //
    //     // bombCollect = game.add.audio('bomb_collect');
    //     // bombCollect.volume = 0.6;
    // },

    setupPlayer: function(){
        //Create basket player sprite and enable physics
        this.player = game.add.sprite(canvasWidth / 1.8, canvasHeight / 1.2, "explode");
        this.player.animations.add('explodeBomb', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 45);
        this.player.scale.setTo(scaleRatio/1.5, scaleRatio/1.5);

        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.kinematic = true;
        this.player.inputEnabled = true;
        this.player.input.enableDrag(false, true, true);
        this.player.input.allowVerticalDrag = false;
        this.player.collideWorldBounds = true;
        let bounds = new Phaser.Rectangle(0,0, canvasWidth, canvasHeight);
        this.player.input.boundsRect = bounds;
        this.player.body.immovable = true;
        this.player.allowGravity = false;
    },

    calculateEggGravity: function(time){
        return  1.4 * 1.2*(40000/(1+Math.exp(-0.1*(time-30)))+40000);
    },

    collectEgg: function(player, egg){

        egg.kill();

        if (egg.key == "egg") {
            this.updateScoreAndPlayAnimation(5);
            gameData.eggCollect.play();
        } else if (egg.key == "bomb") {
            gameData.bombCollect.play();
            this.handleBomb();
        } else if (egg.key == "scoreBoost") {
            this.updateScoreAndPlayAnimation(30);
            gameData.eggCollect.play();
        } else if (egg.key == "combo") {
            gameData.eggCollect.play();
            this.game.state.start("transitionToCombo");
        } else if (egg.key == "frenzy") {
            gameData.frenzyCollect.play();
            gameData.frenzyMusic.play();
            backgroundMusic.stop();
            this.game.state.start("transitionToFrenzy");
        } else if (egg.key == "oneUp"){
            gameData.eggCollect.play();
            lives++;
            life.changeLife();
            if(lives>=3){
                this.calculateEggProbability(currentTime);
            }
        }
    },

    handleBomb: function(){
        lives--;
        life.changeLife();

        if(lives<3){
            this.calculateEggProbability(currentTime);
        }
        var index = Math.floor(Math.random() * 4);
        var bomdDisplayText = this.bombDisplayTexts[index];
        this.showScoreAnimation(bomdDisplayText);
        if (lives==0){
            this.player.inputEnabled = false;
            this.player.body.checkCollision.up = false;
            gameData.explosion.play();
            this.player.animations.play('explodeBomb');

            if (gameData.highestScore < gameData.score) {
                gameData.highestScore = gameData.score;
            }

            window.setTimeout(function(){
                backgroundMusic.stop();
                game.state.start("gameOver");
            }, 888);

        }
    },

    showScoreAnimation: function(display){
        var tweenTextFormat = gameData.createFormatting("bold 80pt Corbel", "#ff0000");
        // scoreTextFormat.stroke = "#A4CED9";
        // scoreTextFormat.strokeThickness = 5;
        if (typeof display != "number"){
            var tweenText = display;
        } else if(display>0){
            var tweenText = "+" + display;
        } else{
            var tweenText = display;
        }

        gameData.createTween(game.world.centerX, game.world.centerY, tweenText, tweenTextFormat);
        // this.tweenDisplay.anchor.setTo(0.5, 0.5);
        // this.game.add.tween(this.tweenDisplay)
        //     .to({alpha: 0}, 100, Phaser.Easing.Default, true, 300);
    },


    updateScoreAndPlayAnimation: function(points){
        this.showScoreAnimation(points);
        gameData.updateScore(points);
    }

};