var comboState = {

    comboTime: 0,
    comboEggCaughtPerWaveCount: 0,
    comboEggPoints: 100,

    create: function(){
        // this.setupGame();

        this.comboTime=0;
        game.add.sprite(0,0,"background");
        this.setupPlayer();
        this.comboEggs = game.add.group();
        this.eggGravity = 50000;

        this.scoreText = game.add.text(10,10,'Score: ' + score, {fontSize: '24px'});

        game.time.events.loop(1000, this.dropComboEggWave, this);

        game.time.events.loop(1000, function(){
            if(this.comboTime>=12){
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

            if(comboEgg.position.y > canvasHeight+50){
                comboEgg.destroy();
            }
            game.physics.arcade.collide(this.player, comboEgg, this.collectComboEgg, null, this);
        }
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
        if (this.comboTime<=11) {
            // var numEggs = 1;
            var numEggs = Math.floor(Math.random() * 4);
            this.createComboWave(numEggs);
        }
    },

    createComboWave: function(numEggs){
        // var eggX = Math.random() * (canvasWidth-40);
        var eggX = this.calculateInitialX();
        var xOffset = this.calculateXOffset(eggX);
        var eggY = -0.05 * canvasHeight;
        var yoffSet = 100;
        for (var i = 0; i < numEggs; i++){
            // var eggX = Math.random() * (canvasWidth-40);
            eggY -= yoffSet;
            eggX += xOffset;
            var eggType = "timeBoost";

            var egg = game.add.sprite(eggX, eggY, eggType);
            egg.scale.setTo(scaleRatio, scaleRatio);

            game.physics.arcade.enable(egg);
            this.eggGravity = this.calculateEggGravity(currentTime);
            egg.body.gravity.y = this.eggGravity;
            this.comboEggs.add(egg);
        }

        this.updateScore(this.comboEggPoints*this.comboEggCaughtPerWaveCount);
        this.comboEggCaughtPerWaveCount = 0;
    },

    calculateInitialX: function () {
        let edgeGap = 40;
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

    calculateEggGravity: function(time){
        return  1.4 * 1.2*(40000/(1+Math.exp(-0.1*(time-30)))+40000);
    },

    collectComboEgg: function(player, egg) {
        egg.kill();
        this.comboEggCaughtPerWaveCount++;
        // this.updateScore(100);
    },

    showScoreAnimation: function(display){
        var scoreTextFormat = {font: "bold 80pt Arial", fill: "#ff0000"};
        scoreTextFormat.stroke = "#A4CED9";
        scoreTextFormat.strokeThickness = 5;
        var scoreText = "+" + display;

        this.comboTextDisplay = this.game.add.text(game.world.centerX - 100, game.world.centerY - 100, scoreText, scoreTextFormat);
        this.game.add.tween(this.comboTextDisplay)
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