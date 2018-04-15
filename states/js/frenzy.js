
var frenzyState = {

    // eggsInState: {},
    eggsOnScreenCoordinates: [],

    create: function(){

        //Screen Setup
        this.currentTime = 0;
        this.setUpBackGround();
        // this.setUpBasket();

        this.scoreText = game.add.text(10,10, "Score: " + score, {fontSize: '24px'});
        this.frenzyEggsGroup = game.add.group();

        //randomly generate 20 eggs
        this.generateFrenzyEggs(20);


        game.time.events.loop(1000, function(){
            // Console.log(this.currentTime);
            if (this.currentTime >= 5){
                // game.time.events.stop();
                this.game.state.start('play');
            } else{
                this.currentTime ++;
            }
        }, this);
        // this.switchBackToPlay(this.currentTime);

    },

    update: function(){
        // console.log("shoot me now wtf");
    },

    generateFrenzyEggs: function(numberOfFrenzyEggs){
        for (var i = 0; i < numberOfFrenzyEggs; i++){
            var newCoordinates = this.generateFrenzyEggCoordinates();
            var eggX = newCoordinates[0];
            var eggY = newCoordinates[1];
            var overlapping =  this.checkFrenzyEggOverlap(eggX, eggY);
            while(overlapping){
                newCoordinates = this.generateFrenzyEggCoordinates();
                eggX = newCoordinates[0];
                eggY = newCoordinates[1];
                overlapping = this.checkFrenzyEggOverlap(eggX, eggY)
            }
            var coordinatesCreated = [eggX, eggY];
            this.eggsOnScreenCoordinates.push(coordinatesCreated);
            this.createFrenzyEgg(eggX, eggY);
        }
    },

    createFrenzyEgg: function (eggX, eggY) {
        var eggType = "frenzy";
        var frenzyEgg = game.add.sprite(eggX, eggY, eggType);
        frenzyEgg.scale.setTo(scaleRatio, scaleRatio);

        game.physics.arcade.enable(frenzyEgg, Phaser.Physics.ARCADE);
        // frenzyEgg.scale.setTo(scaleRatio, scaleRatio);
        game.physics.arcade.enable(frenzyEgg);

        // frenzyEgg.enableDrag();
        frenzyEgg.body.kinematic = true;
        frenzyEgg.inputEnabled = true;
        frenzyEgg.input.enableDrag(false, true, true);
        frenzyEgg.input.allowVerticalDrag = true;
        frenzyEgg.collideWorldBounds = true;
        frenzyEgg.body.immovable = true;
        // this.eggsInState.push(frenzyEgg);
        this.frenzyEggsGroup.add(frenzyEgg);
        // frenzyEgg.enableDrag(true, true, true, true, true, true);
        frenzyEgg.events.onInputDown.add(this.collectEgg, this);


        // this.frenzyEggsGroup.body.checkCollision.right = false;
        // this.frenzyEggsGroup.body.checkCollision.left = false;
        // this.frenzyEggsGroup.body.checkCollision.down = false;
    },

    generateFrenzyEggCoordinates: function() {
        var eggX = this.generateFrenzyEggXCoordinate();
        var eggY = this.generateFrenzyEggYCoordinate();
        return [eggX, eggY];
    },

    generateFrenzyEggXCoordinate: function() {
        // return Math.random()*450;
        return Math.random() * (canvasWidth-80);
    },

    generateFrenzyEggYCoordinate: function() {
        // return Math.random()*450;
        return Math.random() * (canvasHeight-100);
    },

    checkFrenzyEggOverlap: function(x, y) {

        // for(var i=0; i<this.eggsOnScreenCoordinates.length; i++){
        //
        //     if (this.eggsOnScreenCoordinates[0][0] +
        //
        // };
        return false;
    },

    setUpBasket: function(){
        this.player = game.add.sprite(canvasWidth/2, canvasHeight/1.2, "basket");
        this.player.scale.setTo(scaleRatio, scaleRatio);
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

    setUpBackGround: function(){
        game.world.setBounds(0,0, canvasWidth, canvasHeight+100);
        game.add.sprite(0,0, "background");
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    collectEgg: function(egg){
        // this.game.state.start('menu');
        egg.kill();
        //this.game.state.states['gameData'].updateScoreFromFrenzy();
        score += 50;
        this.scoreText.text = "Score: " + score;
    },

    // switchBackToPlay: function(time){
    //     if (time >= 5){
    //         game.time.events.stop();
    //         // this.game.state.states['gameData'].score = this.score;
    //         this.game.state.start("play");
    //     }
    //
    // },

    // createNewEgg: function(){
    //     this.game.state.states['gameData'].updateScoreFromFrenzy();
    //     this.scoreText.text = "Score: " + this.game.state.states['gameData'].score;
    //     // this.eggsInState.shift().destroy();
    //     this.generateFrenzyEggs(1)
    // },

    generateTopLeftCoordinates: function (){

    }

};