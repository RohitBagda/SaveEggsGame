var comboState = {

    comboTime: 0,
    comboEggCaughtPerWaveCount: 0,
    comboEggPoints: 100,
    waveScore: 0,
    comboDuration: 12,
    comboEggsDropDuration: 10,

    create: function(){
        // this.setupGame();

        this.comboTime=0;
        game.add.sprite(0,0,"background");
        this.setupPlayer();
        this.comboEggs = game.add.group();
        this.eggGravity = 50000;

        this.scoreText = game.add.text(10,10,'Score: ' + score, {font: 'bold 60px Corbel', fill: '#003366'});

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
        // //Create pause label button
        // this.pause_label = game.add.text(0.95*canvasWidth, 0.01*canvasHeight, 'II', {font:'bold 60px Corbel', fill:'#003366'});
        // this.pause_label.inputEnabled = true;
        //
        // this.pause_label.events.onInputUp.add(function(){
        //     game.paused = true;
        //
        //     tutorialState.createEggDes();
        //
        //     this.backButton = this.game.add.text(canvasWidth/2, 0.2*canvasHeight, "Back to Game", {font: 'bold 48px Corbel', fill: '#003366'});
        //     this.backButton.anchor.setTo(0.5, 0.5);
        //     this.backButton.inputEnabled = true;
        //     this.backButton.events.onInputDown.add(function(){
        //         var eggPics = tutorialState.getEggPics();
        //         var eggDes = tutorialState.getDes();
        //
        //         eggPics.forEach(function(pics){
        //             pics.destroy();
        //         });
        //
        //         eggDes.forEach(function(pics){
        //             pics.destroy();
        //         });
        //
        //         this.backButton.destroy();
        //
        //         game.paused = false;
        //     });
        // });


        game.time.events.loop(1000, this.dropComboEggWave, this);

        game.time.events.loop(1000, function(){
            if(this.comboTime>this.comboDuration){
                this.waveScore = 0;
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

            if(comboEgg.y <= this.player.y - comboEgg.height/1.2){
                game.physics.arcade.collide(this.player, comboEgg, this.collectComboEgg, null, this);
            } else if(comboEgg.y > canvasHeight * 10/11){
                this.crackComboEggs(comboEgg);
            }

        }

    },

    crackComboEggs: function(egg){
        this.tweenComboEggs("crackedCombo", egg);
    },

    tweenComboEggs: function(cracked, egg){
        egg.loadTexture(cracked,0);
        egg.body.gravity.y = 0;
        this.game.add.tween(egg)
            .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 300);
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
            this.eggGravity = this.calculateEggGravity(currentTime);
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
        return  1.4 * 1.2*(40000/(1+Math.exp(-0.1*(currentTime-30)))+40000);
    },

    collectComboEgg: function(player, egg) {
        eggCollect.play();
        egg.kill();
        this.comboEggCaughtPerWaveCount++;
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
        this.waveScore += points;
        score += points;

        this.scoreText.text = 'Score: ' + score;
        if (highestScore < score) {
            highestScore = score;
        }
    }

};