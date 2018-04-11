
var frenzyState = {

    eggsInState: [],

    create: function(){
        this.setUpBackGround();
        this.setUpBasket();
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.scaleRatio = window.devicePixelRatio/1.2;
        // console.log("This is so frustrating!!!!!!!!!!!!!!!");
        // alert("welcome to frenzy");
        this.scoreText = game.add.text(10,10, "Score: " + this.game.state.states['gameData'].score, {fontSize: '24px'});
        this.frenzyEggsGroup = game.add.group();
        this.generateFrenzyEggs(1);

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
            this.createFrenzyEgg(eggX, eggY);
        }
    },

    createFrenzyEgg: function (eggX, eggY) {
        var eggType = "frenzy";
        var frenzyEgg = game.add.sprite(eggX, eggY, eggType);
        frenzyEgg.scale.setTo(this.scaleRatio, this.scaleRatio);

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
        this.eggsInState.push(frenzyEgg);
        this.frenzyEggsGroup.add(frenzyEgg);
        frenzyEgg.events.onInputDown.add(this.createNewEgg, this);


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
        return Math.random() * this.canvasWidth;
    },

    generateFrenzyEggYCoordinate: function() {
        // return Math.random()*450;
        return Math.random() * this.canvasHeight;
    },

    checkFrenzyEggOverlap: function(x, y) {
        return false;
    },

    setUpBasket: function(){
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

    setUpBackGround: function(){
        game.world.setBounds(0,0, this.canvasWidth, this.canvasHeight+100);
        game.add.sprite(0,0, "background");
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    createNewEgg: function(){
        this.game.state.states['gameData'].updateScoreFromFrenzy();
        this.scoreText.text = "Score: " + this.game.state.states['gameData'].score;
        this.eggsInState.shift().destroy();
        this.generateFrenzyEggs(1)
    }

};