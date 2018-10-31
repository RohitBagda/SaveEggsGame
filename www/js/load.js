/**
 * Loads the required image and sound files for the game
 */
var loadState = {

    // "LS" = local storage
    LS_KEY_HIGH_SCORE: "high_score",

    /**
     * Load all assets
     */
    preload: function(){
        var loadingLabel = game.add.text(80, 150,'loading...',
                                        {font: '30px Courier', fill: '#ffffff'});
        this.loadImages();
        this.loadSounds();

        // Load highscore
        const storedHighScore = localStorage.getItem(this.LS_KEY_HIGH_SCORE);
        if(storedHighScore !== null) {
            gameController.highestScore = parseInt(storedHighScore);
        }
    },

    create : function(){
        //Calling the menu state
        game.state.start('menu');
        this.startMusic();

    },

    loadImages: function(){
        // Loading all sprites
        game.load.image(gameController.REGULAR_EGG, 'assets/images/egg.png');
        game.load.image(gameController.FRENZY_EGG, 'assets/images/frenzy.png');
        game.load.image(gameController.BOMB, 'assets/images/bomb.png');
        game.load.image(gameController.SCORE_BOOST, 'assets/images/scoreBoostWithGlow.png');
        game.load.image(gameController.ONE_UP, 'assets/images/oneUp.png');
        game.load.image(gameController.COMBO_EGG, 'assets/images/combo.png');
        game.load.image(gameController.BACKGROUND, 'assets/images/background.png');
        game.load.image('gametitle', 'assets/images/final_logo.png');
        game.load.image(gameController.CRACKED_REGULAR_EGG, "assets/images/cracked_egg.png");
        game.load.image(gameController.CRACKED_FRENZY_EGG, "assets/images/cracked_frenzy.png");
        game.load.image(gameController.CRACKED_ONE_UP, "assets/images/cracked_oneUp.png");
        game.load.image(gameController.CRACKED_SCORE_BOOST, "assets/images/cracked_scoreBoost.png");
        game.load.image(gameController.CRACKED_COMBO,"assets/images/cracked_combo.png");
        game.load.image(gameController.BOMB_EXPLOSION_CLOUD, "assets/images/bomb_cloud.png");
        //Loading the basket sprite esheet to create exploding animation when a user dies
        game.load.spritesheet(gameController.BASKET_EXPLOSION_SPRITE_SHEET, "assets/images/basket_spritesheet.png", 155, 150);
        //load the sprite sheet for the bomb explosion
        game.load.spritesheet(gameController.BOMB_EXPLOSION_SPRITE_SHEET, "assets/images/bomb_explosion_frenzy_spritesheet.png", 155, 150);
        
        game.load.image("pauseIcon", 'assets/images/pause.png');
        game.load.image("playIcon", 'assets/images/play.png');
    },

    loadSounds: function(){
        // Loading all audio
        game.load.audio('background_music', ['assets/audio/background_music.mp3', 'assets/audio/background_music.ogg']);
        game.load.audio('egg_crack', ['assets/audio/egg_crack.wav', 'assets/audio/egg_crack.ogg']);
        game.load.audio('frenzy_music', ['assets/audio/frenzy_music.mp3', 'assets/audio/frenzy_music.ogg']);
        game.load.audio('frenzy_collect', ['assets/audio/frenzy_collect.wav', 'assets/audio/frenzy_collect.ogg']);
        game.load.audio('egg_collect', ['assets/audio/collect.mp3', 'assets/audio/collect.ogg']);
        game.load.audio('explosion', ['assets/audio/explosion.wav', 'assets/audio/explosion.ogg']);
        game.load.audio('bomb_whoosh', ['assets/audio/bomb_whoosh.wav', 'assets/audio/bomb_whoosh.ogg']);
        game.load.audio('frenzy_touch', ['assets/audio/frenzy_touch.wav', 'assets/audio/frenzy_touch.ogg']);
        game.load.audio('bomb_collect', ['assets/audio/bomb_collect.mp3', 'assets/audio/bomb_collect.ogg']);
    },

    /**
     * Start the background music to the game and play it throughout the game
     */
    startMusic : function(){
        backgroundMusic = game.add.audio('background_music');
        backgroundMusic.volume = 0.4;
        backgroundMusic.loop = true;
        backgroundMusic.play();
    }
};
