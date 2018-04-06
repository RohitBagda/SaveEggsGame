var playState = {

    create: function(){
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.scaleRatio = window.devicePixelRatio/1.2;

        this.setupGame();
        this.setupPlayer();

        this.eggs = game.add.group();
        this.eggGravity = 50000;
        this.playerSpeed = 400;

        // This will contain the score and the timer.
        this.scoreText = game.add.text(10,10,'Score: 0', {fontSize: '24px'});

        this.score = 0;
        this.currentTime = 0;
        this.gameDuration = 90;

        this.isFrenzy = false;

        game.time.events.loop(800, this.dropEgg, this);
        game.time.events.loop(1000, function(){
           this.currentTime ++;
        }, this);
    },

    update: function(){
        for(var i in this.eggs.children){
            var egg = this.eggs.children[i];
            egg.body.velocity.y=20;

            if(egg.position.y > this.canvasHeight+50){
                egg.destroy();
            }
            game.physics.arcade.collide(this.player, egg, this.collectEgg, null, this);
        }
    },

    dropEgg: function() {
        if (this.currentTime < this.gameDuration) {
            var numEggs = 1;
            this.createWave(numEggs);
        }
    },

    createWave: function(numEggs){
        for (var i = 0; i < numEggs; i++){
            var eggX = Math.random() * this.canvasWidth;
            var eggY = -0.05 * this.canvasHeight;
            var egg;
            var eggType;

            if(this.currentTime < 10){
                eggType = "egg";
            } else {
                eggType = this.getEggType();
            }

            egg = game.add.sprite(eggX, eggY, eggType)
            egg.scale.setTo(this.scaleRatio, this.scaleRatio);

            game.physics.arcade.enable(egg);
            this.eggGravity = this.calculateEggGravity(this.currentTime);
            egg.body.gravity.y = this.eggGravity;
            this.eggs.add(egg);
        }
    },

    getEggType: function(){
        var eggType;
        var randomNumber = Math.random()*100;
        if(randomNumber < 50){
            eggType = "egg";
        } else if(randomNumber<70) {
            eggType = "bomb";
        } else if(randomNumber<89) {
            eggType = "frenzy";
        } else if(randomNumber<96) {
            eggType = "scoreBoost";
        } else {
            eggType = "timeBoost";
        }
        return eggType;
    },

    setupGame: function(){
        game.world.setBounds(0,0, this.canvasWidth, this.canvasHeight+100);
        game.add.sprite(0,0, "background");
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    setupPlayer: function(){
        //Create basket player sprite and enable physics
        this.player = game.add.sprite(this.canvasWidth/2, this.canvasHeight/1.2, "basket");
        this.player.scale.setTo(this.scaleRatio, this.scaleRatio);
        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.kinematic = true;
        this.player.inputEnabled = true;
        this.player.input.enableDrag(false, true, true);
        this.player.input.allowVerticalDrag = false;
        this.player.collideWorldBounds = true;
        this.player.body.immovable = true;
        this.player.body.checkCollision.right = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.down = false;
    },

    calculateEggGravity: function(time){
        return 1.2*(40000/(1+Math.exp(-0.1*(time-30)))+40000);
    },

    collectEgg: function(player, egg){
        egg.kill();

        if(egg.key == "egg"){
            this.updateScore(5);
        } else if(egg.key == "bomb"){
            game.state.stop();
        } else if(egg.key == "scoreBoost"){
            this.updateScore(30);
        } else if(egg.key == "timeBoost") {
            this.currentTime -= 5;
        } else {
            this.isFrenzy = true;
        }
    },

    updateScore: function(points){
        this.score += points;
        this.scoreText.text = 'Score: ' + this.score;
    }

};