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
        var overviewFormatting = {font: "30pt Corbel", fill: "#003366", align: 'center', wordWrap: true, wordWrapWidth: 0.9*canvasWidth};
        overviewFormatting.stroke = "#000000";
        let rules = this.game.add.text(canvasWidth / 15, canvasHeight / 20, "The objective of the game is to save as many eggs as you can by catching them " +
            "in your basket. Touch and drag the basket from side to side to move it across the screen and catch the falling eggs. Avoid bombs! You have " +
            "3 lives to spare before the game ends.", overviewFormatting);
        rules.anchor.setTo(0.5, 0.5);
    },

    createEggDes: function(){
        var descriptionFormatting = {font: "25pt Corbel", fill: "#003366", align: 'left', wordWrap: true, wordWrapWidth: 0.7*canvasWidth};
        descriptionFormatting.stroke = "#000000";

        let eggPic = game.add.sprite(canvasWidth/12, 4*(canvasHeight/12), 'egg');
        eggPic.scale.setTo(scaleRatio, scaleRatio);
        let eggDes = this.game.add.text(2.5*(canvasWidth/12), 4*(canvasHeight/12)+20, "Regular egg - worth 5 points", descriptionFormatting);

        let scoreBoostPic = game.add.sprite(canvasWidth/12, 5*(canvasHeight/12), 'scoreBoost');
        scoreBoostPic.scale.setTo(scaleRatio, scaleRatio);
        let scoreDes = this.game.add.text(2.5*(canvasWidth/12), 5*(canvasHeight/12)+20, "Score boost egg - worth 30 points", descriptionFormatting);

        let frenzyPic = game.add.sprite(canvasWidth/12, 6*(canvasHeight/12), 'frenzy');
        frenzyPic.scale.setTo(scaleRatio, scaleRatio);
        let frenzyDes = this.game.add.text(2.5*(canvasWidth/12), 6*(canvasHeight/12)+20, "Frenzy egg - enter frenzy mode! Tap as many eggs as " +
            "possible in 3 seconds.", descriptionFormatting);

        let oneUpPic = game.add.sprite(canvasWidth/12, 7*(canvasHeight/12), 'oneUp');
        oneUpPic.scale.setTo(scaleRatio, scaleRatio);
        let OneupDes = this.game.add.text(2.5*(canvasWidth/12), 7*(canvasHeight/12)+20, "One-up egg - gives you an extra life", descriptionFormatting);

        let comboPic = game.add.sprite(canvasWidth/12, 8*(canvasHeight/12), 'combo');
        comboPic.scale.setTo(scaleRatio, scaleRatio);
        let comboDes = this.game.add.text(2.5*(canvasWidth/12), 8*(canvasHeight/12)+20, "Combo egg - enter combo mode and collect each wave of eggs " +
            "for juicy bonus points.", descriptionFormatting);

        let bombPic = game.add.sprite(canvasWidth/12, 9*(canvasHeight/12), 'bomb');
        bombPic.scale.setTo(scaleRatio, scaleRatio);
        let bombDes = this.game.add.text(2.5*(canvasWidth/12), 9*(canvasHeight/12)+20, "Bomb - avoid! Catching 3 of these ends the game.", descriptionFormatting);

        this.eggPics = [eggPic, scoreBoostPic, frenzyPic, oneUpPic, comboPic, bombPic];
        this.descriptions = [eggDes, scoreDes, frenzyDes, OneupDes, comboDes, bombDes]
        },

    createHome: function(){
        var homeButtonFormatting = {font: "bold 48pt Corbel", fill: "#003366"};
        homeButtonFormatting.stroke = "#000000";
        homeButtonFormatting.strokeThickness = 1;

        var aboutButton = this.game.add.text(canvasWidth / 2, 0.9 * canvasHeight, "Back To Main Menu", homeButtonFormatting);
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
