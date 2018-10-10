var tutorialState = {
    eggPics : [],
    descriptions : [],
    create: function () {
        gameController.addBackground();
        this.createLogo();
        this.createOverview();
        this.createEggDescriptions();
        this.createHome();
    },

    /**
     * This is where the basic game rules are laid out.
     */
    createOverview: function() {
        const RULE_FIRST_COLUMN_X = canvasWidth/11;
        const RULE_FIRST_ROW_Y = canvasHeight/4;
        const RULE_SECOND_COLUMN_X = canvasWidth/2.2;
        const RULE_SECOND_ROW_Y = canvasHeight/3.5;
        var overviewFormatting = {font: "bold 30pt Corbel", fill: "#003366", align: 'center', wordWrap: true, wordWrapWidth: 0.9*canvasWidth};
        overviewFormatting.stroke = "#000000";
        this.game.add.text(RULE_FIRST_COLUMN_X, RULE_FIRST_ROW_Y, "1. Drag the Basket.", overviewFormatting);
        this.game.add.text(RULE_SECOND_COLUMN_X, RULE_FIRST_ROW_Y, "2. You have up to 3 lives.", overviewFormatting);
        this.game.add.text(RULE_FIRST_COLUMN_X, RULE_SECOND_ROW_Y, "3. Avoid Bombs!", overviewFormatting);
        this.game.add.text(RULE_SECOND_COLUMN_X, RULE_SECOND_ROW_Y, "4. Missed eggs cost points.", overviewFormatting);
    },

    /**
     * Adds the logo at the top of the page.
     */
    createLogo: function(){
        const LOGO_X = canvasWidth/2;
        const LOGO_Y = canvasHeight/7;
        const LOGO_SCALE = scaleRatio/10;
        const LOGO_ANCHOR = 0.5;
        var nameLabel = game.add.sprite(LOGO_X, LOGO_Y, "gametitle");
        nameLabel.scale.setTo(LOGO_SCALE, LOGO_SCALE);
        nameLabel.anchor.setTo(LOGO_ANCHOR, LOGO_ANCHOR);
    },

    /**
     * Adds images and corresponding descriptions of each type of egg/object that falls.
     */
    createEggDescriptions: function() {
        const EGG_PICTURE_X = canvasWidth/12;
        const EGG_PICTURE_Y = canvasHeight/12;
        const DESCRITION_X = canvasWidth/5;
        const EGG_AND_DESCRIPTION = 20;
        var descriptionFormatting = {
            font: "bold 28pt Corbel",
            fill: "#003366",
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 0.7 * canvasWidth
        };
        descriptionFormatting.stroke = "#000000";
        //Create all pictures in tutorial
        let eggPic = game.add.sprite(EGG_PICTURE_X, EGG_PICTURE_Y * 4, gameController.REGULAR_EGG);
        let scoreBoostPic = game.add.sprite(EGG_PICTURE_X, EGG_PICTURE_Y * 5, gameController.SCORE_BOOST);
        let frenzyPic = game.add.sprite(EGG_PICTURE_X, EGG_PICTURE_Y * 6, gameController.FRENZY_EGG);
        let oneUpPic = game.add.sprite(EGG_PICTURE_X, EGG_PICTURE_Y * 7, gameController.ONE_UP);
        let comboPic = game.add.sprite(EGG_PICTURE_X, EGG_PICTURE_Y * 8, gameController.COMBO_EGG);
        let bombPic = game.add.sprite(EGG_PICTURE_X, EGG_PICTURE_Y * 9, gameController.BOMB);
        this.eggPics = [eggPic, scoreBoostPic, frenzyPic, oneUpPic, comboPic, bombPic];
        this.createScale(this.eggPics);
        // Need to do this because of glow
        scoreBoostPic.centerX = eggPic.centerX;
        scoreBoostPic.centerY = (eggPic.centerY + frenzyPic.centerY) / 2
        //Create all the descriptions
        let eggDes = this.game.add.text(DESCRITION_X, EGG_PICTURE_Y * 4 + EGG_AND_DESCRIPTION, "Regular egg - worth 5 points", descriptionFormatting);
        let scoreDes = this.game.add.text(DESCRITION_X, EGG_PICTURE_Y * 5 + EGG_AND_DESCRIPTION, "Score boost egg - worth 30 points", descriptionFormatting);
        let frenzyDes = this.game.add.text(DESCRITION_X, EGG_PICTURE_Y * 6 + EGG_AND_DESCRIPTION, "Frenzy egg - enter frenzy mode! Tap as many eggs as " +
            "possible in 3 seconds.", descriptionFormatting);
        let OneupDes = this.game.add.text(DESCRITION_X, EGG_PICTURE_Y * 7 + EGG_AND_DESCRIPTION, "One-up egg - gives you an extra life", descriptionFormatting);
        let comboDes = this.game.add.text(DESCRITION_X, EGG_PICTURE_Y * 8 + EGG_AND_DESCRIPTION, "Combo egg - enter combo mode and collect each wave of eggs " +
            "for juicy bonus points.", descriptionFormatting);
        let bombDes = this.game.add.text(DESCRITION_X, EGG_PICTURE_Y * 9 + EGG_AND_DESCRIPTION, "Bomb - avoid! Catching 3 of these ends the game.", descriptionFormatting);
        this.descriptions = [eggDes, scoreDes, frenzyDes, OneupDes, comboDes, bombDes];
    },

    /**
     * Scales images of eggs to fit correctly on the page.
     * @param sourceArray
     */
    createScale: function(sourceArray){
        sourceArray.forEach(function(element){
            element.scale.setTo(scaleRatio, scaleRatio);
        });
    },

    /**
     * Adds the button that directs the user back to the home page.
     */
    createHome: function(){
        var homeButtonFormatting = {font: "bold 48pt Corbel", fill: "#003366"};
        homeButtonFormatting.stroke = "#000000";
        homeButtonFormatting.strokeThickness = 1;
        var aboutButton = this.game.add.text(canvasWidth / 2, 0.9 * canvasHeight, "Back To Main Menu", homeButtonFormatting);
        aboutButton.anchor.setTo(0.5, 0.5);
        aboutButton.inputEnabled = true;
        aboutButton.events.onInputDown.add(this.goToHome, this);
    },

    getEggImages: function(){
        return this.eggPics;
    },

    getEggDescriptions: function(){
        return this.descriptions;
    },

    goToHome: function(){
        this.game.state.start('menu');
    }
};