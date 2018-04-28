var tutorialState = {
    eggPics : [],
    descriptions : [],

    create: function () {
        game.add.sprite(0, 0, "background");

        this.createOverview();
        this.createEggDes();
        this.createHome();
    },

    createOverview: function() {
        var overviewFormatting = {font: "35pt Corbel", fill: "#003366"};
        overviewFormatting.stroke = "#000000";
        this.game.add.text(canvasWidth / 12, canvasHeight / 15, "Put overview of rules here", overviewFormatting);
    },

    createEggDes: function(){
        var descriptionFormatting = {font: "25pt Corbel", fill: "#003366"};
        descriptionFormatting.stroke = "#000000";

        let eggPic = game.add.sprite(canvasWidth/12, 3*(canvasHeight/12), 'egg');
        eggPic.scale.setTo(scaleRatio, scaleRatio);
        let eggDes = this.game.add.text(3*(canvasWidth/12), 3*(canvasHeight/12)+20, "Regular egg - worth 5 points", descriptionFormatting);

        let scoreBoostPic = game.add.sprite(canvasWidth/12, 4*(canvasHeight/12), 'scoreBoost');
        scoreBoostPic.scale.setTo(scaleRatio, scaleRatio);
        let scoreDes = this.game.add.text(3*(canvasWidth/12), 4*(canvasHeight/12)+20, "Score boost egg - worth 30 points", descriptionFormatting);

        let frenzyPic = game.add.sprite(canvasWidth/12, 5*(canvasHeight/12), 'frenzy');
        frenzyPic.scale.setTo(scaleRatio, scaleRatio);
        let frenzyDes = this.game.add.text(3*(canvasWidth/12), 5*(canvasHeight/12)+20, "Frenzy egg - enter frenzy mode and tap as many eggs as" +
            "possible in the 5-second time limit to collect them. Each collected egg is worth 2 points.", descriptionFormatting);

        let oneUpPic = game.add.sprite(canvasWidth/12, 6*(canvasHeight/12), 'oneUp');
        oneUpPic.scale.setTo(scaleRatio, scaleRatio);
        let OneupDes = this.game.add.text(3*(canvasWidth/12), 6*(canvasHeight/12)+20, "One-up egg - gives you an extra life", descriptionFormatting);

        let comboPic = game.add.sprite(canvasWidth/12, 7*(canvasHeight/12), 'combo');
        comboPic.scale.setTo(scaleRatio, scaleRatio);
        let comboDes = this.game.add.text(3*(canvasWidth/12), 7*(canvasHeight/12)+20, "Combo egg - enter combo mode and collect each wave of eggs" +
            "that falls for juicy bonus points.", descriptionFormatting);

        let bombPic = game.add.sprite(canvasWidth/12, 8*(canvasHeight/12), 'bomb');
        bombPic.scale.setTo(scaleRatio, scaleRatio);
        let bombDes = this.game.add.text(3*(canvasWidth/12), 8*(canvasHeight/12)+20, "Bomb - avoid! Catching 3 of these ends the game.", descriptionFormatting);

        this.eggPics = [eggPic, scoreBoostPic, frenzyPic, oneUpPic, comboPic, bombPic];
        this.descriptions = [eggDes, scoreDes, frenzyDes, OneupDes, comboDes, bombDes]
        },

    createHome: function(){
        var homeButtonFormatting = {font: "bold 48pt Corbel", fill: "#003366"};
        homeButtonFormatting.stroke = "#000000";
        homeButtonFormatting.strokeThickness = 1;

        var aboutButton = this.game.add.text(canvasWidth / 2, 0.85 * canvasHeight, "Back To Main Menu", homeButtonFormatting);
        aboutButton.anchor.setTo(0.5, 0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.goToHome, this);
    },

    getEggPics: function(){
        return this.eggPics;
    },

    getDes: function(){
        return this.descriptions;
    },

    goToHome: function(){
        this.game.state.start('menu');
    }
};
