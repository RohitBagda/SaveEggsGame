var playState = {

    bombDisplayTexts: ["Bruh", ":'(", "WTF", "-___-"],

    create: function(){
        this.setupGame();
        this.setupSounds();
        this.setupPlayer();

        this.eggs = game.add.group();
        this.eggGravity = 50000;
        // this.playerSpeed = 400;

        // This will contain the score and the timer.
        this.scoreText = game.add.text(10,10,'Score: ' + score, {fontSize: '24px'});

        // this.currentTime = currentTime;
        // this.gameDuration = -1;

        // this.isFrenzy = false;
        game.time.events.loop(500, this.dropEgg, this);
        // this.frenzy = this.isFrenzy;
        // while (!this.isFrenzy){
        //     game.time.events.loop(800, this.dropEgg, this);
        // }
        // game.state.start('frenzy');
        game.time.events.loop(1000, function(){
            currentTime++;
        }, this);
    },

    update: function(){
        for(var i in this.eggs.children){
            var egg = this.eggs.children[i];
            egg.body.velocity.y=20;

            if(egg.y <= this.player.y - egg.height/1.2){
                game.physics.arcade.collide(this.player, egg, this.collectEgg, null, this);
            } else if(egg.y > canvasHeight * 10/11){
                this.crackEggs(egg);
            }

        }
    },

    crackEggs: function(egg){
        if(egg.key === "egg"){
            this.tweenEggs("crackedEgg", egg);
            eggCrack.play();
        } else if(egg.key === "bomb") {
            this.tweenEggs("bombCloud", egg);
            bombWhoosh.play();
        } else if(egg.key === "frenzy"){
            this.tweenEggs("crackedFrenzy", egg);
            eggCrack.play();
        }  else if(egg.key === "scoreBoost") {
            this.tweenEggs("crackedScoreBoost", egg);
            eggCrack.play();
        } else if(egg.key === "timeBoost") {
            this.tweenEggs("crackedOneUp", egg);
            eggCrack.play();
        }
    },

    tweenEggs: function(cracked, egg){
        egg.loadTexture(cracked,0);
        egg.body.gravity.y = 0;
        this.game.add.tween(egg)
            .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 300)
            .onComplete.add(function () {
                console.log("This is called when the tween is done.");
            }, this
        );
    },

    dropEgg: function() {
        var numEggs = 1;
        // var numEggs = Math.floor(Math.random() * 4);

        this.createWave(numEggs);
    },

    createWave: function(numEggs){
        for (var i = 0; i < numEggs; i++){
            var eggX = Math.random() * (canvasWidth-40);
            var eggY = -0.05 * canvasHeight;
            var egg;
            var eggType;

            if(this.currentTime < 1){
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
        var randomNumber = Math.random()*100;
        if(randomNumber < 40){
            eggType = "egg";
        } else if(randomNumber < 70) {
            eggType = "bomb";
        } else if(randomNumber<80) {
            eggType = "frenzy";
        } else if(randomNumber<90) {
            eggType = "timeBoost";
        } else {
            eggType = "scoreBoost";
        }
        return eggType;
    },

    setupGame: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight+100);
        game.add.sprite(0,0, "background");
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    setupSounds: function() {
        eggCrack = game.add.audio('egg_crack');
        eggCrack.volume = 0.6;

        backgroundMusic = game.add.audio('background_music');
        backgroundMusic.volume = 0.4;
        backgroundMusic.loop = true;
        backgroundMusic.play();

        frenzyMusic = game.add.audio('frenzy_music');
        frenzyMusic.volume = 0.4;
        frenzyCollect = game.add.audio('frenzy_collect');
        frenzyCollect.volume = 0.6;

        eggCollect = game.add.audio('egg_collect');
        eggCollect.volume = 0.6;

        explosion = game.add.audio('explosion');
        explosion.volume = 0.8;

        bombWhoosh = game.add.audio('bomb_whoosh');
        bombWhoosh.volume = 0.6;

        frenzyTouch = game.add.audio('frenzy_touch');
        frenzyTouch.volume = 0.5;

        bombCollect = game.add.audio('bomb_collect');
        bombCollect.volume = 0.6;
    },

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
            this.updateScore(5);
            eggCollect.play();
        } else if (egg.key == "bomb") {
            bombCollect.play();
            this.handleBomb();
        } else if (egg.key == "scoreBoost") {
            this.updateScore(30);
            eggCollect.play();
        } else if (egg.key == "timeBoost") {
            eggCollect.play();
            this.game.state.start("transitionToCombo");
        } else if (egg.key == "frenzy") {
            // this.showFrenzyModeAnimation();

            // this.game.state.stop();
            // game.time.events.stop();
            //this.game.state.states['gameData'].score = score;
            frenzyCollect.play();
            frenzyMusic.play();
            backgroundMusic.stop();
            this.game.state.start("transitionToFrenzy");
        }
    },

    handleBomb: function(){
        lives--;
        var index = Math.floor(Math.random() * 4);
        var bomdDisplayText = this.bombDisplayTexts[index];
        this.showScoreAnimation(bomdDisplayText);
        if (lives==0){
            this.player.inputEnabled = false;
            this.player.body.checkCollision.up = false;
            explosion.play();
            this.player.animations.play('explodeBomb');

            window.setTimeout(function(){
                backgroundMusic.stop();
                game.state.start("gameOver");
            }, 888);

        }
    },

    showScoreAnimation: function(display){
        var scoreTextFormat = {font: "bold 80pt Arial", fill: "#ff0000"};
        scoreTextFormat.stroke = "#A4CED9";
        scoreTextFormat.strokeThickness = 5;
        if (typeof display != "number"){
            var scoreText = display;
        } else{
            var scoreText = "+" + display;
        }

        this.frenzyTextDisplay = this.game.add.text(game.world.centerX, game.world.centerY, scoreText, scoreTextFormat);
        this.frenzyTextDisplay.anchor.setTo(0.5, 0.5);
        this.game.add.tween(this.frenzyTextDisplay)
            .to({alpha: 0}, 100, Phaser.Easing.Default, true, 300)
            .onComplete.add(function () {
                console.log("This is called when the tween is done.");
            }, this
        );

    },


    updateScore: function(points){
        this.showScoreAnimation(points);
        score += points;
        this.scoreText.text = 'Score: ' + score;
        if (highestScore < score) {
            highestScore = score;
        }
    }

};