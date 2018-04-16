var attractState = {

    // eggsInState: {},
    eggsOnScreenCoordinates: [],
    attractEggs: [],

    create: function(){
        //Screen Setup
        this.currentTime = 0;
        game.add.sprite(0,0, "background");
        //this.player = game.add.sprite(canvasWidth/2, canvasHeight/1.2, "basket");

        this.player = this.game.add.sprite(canvasWidth/2, canvasHeight/1.2, "basket");
        this.player.scale.setTo(scaleRatio, scaleRatio);
        this.setupBasket();

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
        this.attractEggs.forEach(function(element) {
            game.physics.arcade.collide(this.player, element, this.collectEgg, null, this);
        });
    },

    generateFrenzyEggs: function(numberOfFrenzyEggs){
        for (var i = 0; i < numberOfFrenzyEggs; i++){
            var newCoordinates = this.generateFrenzyEggCoordinates();
            var eggX = newCoordinates[0];
            var eggY = newCoordinates[1];
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

        game.physics.arcade.accelerateToObject(frenzyEgg, this.player, 500);

        // frenzyEgg.enableDrag();
        frenzyEgg.body.kinematic = true;
        frenzyEgg.inputEnabled = true;
        frenzyEgg.input.enableDrag(false, true, true);
        frenzyEgg.input.allowVerticalDrag = true;
        frenzyEgg.collideWorldBounds = true;
        frenzyEgg.body.immovable = true;
        // this.eggsInState.push(frenzyEgg);

        this.attractEggs.push(frenzyEgg);
        // frenzyEgg.enableDrag(true, true, true, true, true, true);



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
        return Math.random() * (canvasHeight-400);
    },


    setupBasket: function(){
        //Create basket player sprite and enable physics
        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.kinematic = true;
        this.player.inputEnabled = true;
        this.player.input.enableDrag(false, true, true);
        this.player.input.allowVerticalDrag = false;
        this.player.collideWorldBounds = true;
        //let bounds = new Phaser.Rectangle(0,0, canvasWidth, canvasHeight);
        //this.player.input.boundsRect = bounds;
        this.player.body.immovable = true;
        this.player.body.checkCollision.right = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.down = false;
    },

    collectEgg: function(attractEgg){
        attractEgg.kill();
        score += 5;
        this.scoreText.text = "Score: " + score;
    },

};