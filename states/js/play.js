var playState = {

    bombDisplayTexts: ["Bruh", ":'(", "WTF", "-___-"],

    create: function(){
        this.setupGame();
        this.setupPlayer();

        this.eggs = game.add.group();
        this.eggGravity = 50000;
        // this.playerSpeed = 400;

        // This will contain the score and the timer.
        this.scoreText = game.add.text(10,10,'Score: ' + score, {fontSize: '24px'});

        // this.currentTime = currentTime;
        // this.gameDuration = -1;

        backgroundMusic.volume = 0.4;
        backgroundMusic.loop = true;
        backgroundMusic.play();

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

            if(egg.position.y > canvasHeight-210){
                this.crackEggs(egg);
            }

            game.physics.arcade.collide(this.player, egg, this.collectEgg, null, this);
        }
    },

    crackEggs: function(egg){
        eggCrack.volume = 0.8;
        if(egg.key == "egg"){
            this.tweenEggs("crackedEgg", egg);
            eggCrack.play();
        } else if(egg.key == "frenzy"){
            this.tweenEggs("crackedFrenzy", egg);
            eggCrack.play();
        }  else if(egg.key == "scoreBoost") {
            this.tweenEggs("crackedScoreBoost", egg);
            eggCrack.play();
        } else if(egg.key == "timeBoost") {
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
        if (2<3) {

            var numEggs = 1;
            // var numEggs = Math.floor(Math.random() * 4);

            this.createWave(numEggs);
        }
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

            game.physics.arcade.enable(egg);
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
        } else if(randomNumber<98) {
            eggType = "frenzy";
        } else if(randomNumber<99) {
            eggType = "scoreBoost";
        } else {
            eggType = "timeBoost";
        }
        return eggType;
    },

    setupGame: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight+100);
        game.add.sprite(0,0, "background");
        game.physics.startSystem(Phaser.Physics.ARCADE);
        eggCrack = game.add.audio('egg_crack');
        backgroundMusic = game.add.audio('background_music');
    },

    setupPlayer: function(){
        //Create basket player sprite and enable physics
        this.player = game.add.sprite(canvasWidth/2, canvasHeight/1.2, "basket");
        this.player.scale.setTo(scaleRatio, scaleRatio);
        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.kinematic = true;
        this.player.inputEnabled = true;
        this.player.input.enableDrag(false, true, true);
        this.player.input.allowVerticalDrag = false;
        this.player.collideWorldBounds = true;
        let bounds = new Phaser.Rectangle(0,0, canvasWidth, canvasHeight);
        this.player.input.boundsRect = bounds;
        this.player.body.immovable = true;
        this.player.body.checkCollision.right = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.down = false;
    },

    calculateEggGravity: function(time){
        return  1.4 * 1.2*(40000/(1+Math.exp(-0.1*(time-30)))+40000);
    },

    collectEgg: function(player, egg){
        egg.kill();

        if(egg.key == "egg"){
            this.updateScore(5);
        } else if(egg.key == "bomb"){
            this.handleBomb();
        } else if(egg.key == "scoreBoost"){
            this.updateScore(30);
        } else if(egg.key == "timeBoost") {
            backgroundMusic.stop();
            this.game.state.start("transitionToCombo");
        } else if(egg.key == "frenzy"){
            // this.showFrenzyModeAnimation();

            // this.game.state.stop();
            // game.time.events.stop();
            //this.game.state.states['gameData'].score = score;
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
            // var mummy = game.add.sprite(300, 200, 'explode');
            //
            // var walk = mummy.animations.add('walk');
            // mummy.animations.play('walk', 30, true);
            //
            // this.game.add.tween(this.player)
            //     .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 300)
            //     .onComplete.add(function () {
            //         console.log("This is called when the tween is done.");
            //     }, this
            // );

            backgroundMusic.stop();
            this.game.state.start("gameOver");
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