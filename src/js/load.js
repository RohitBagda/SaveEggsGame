/**
 * Loads the required image and sound files for the game
 */
var loadState = {

    /**
     * Load all assets
     */
    preload: function(){
        var loadingLabel = game.add.text(80, 150,'loading...',
                                        {font: '30px Courier', fill: '#ffffff'});
        this.loadImages();
        this.loadSounds();
    },

    create : function(){
        //Calling the menu state
        game.state.start('menu');
        this.startMusic();

    },

    loadImages: function(){
        // Loading all sprites
        game.load.image('egg', 'assets/images/egg.png');
        game.load.image('basket', 'assets/images/basket.png');
        game.load.image('win', 'assets/images/bomb.png');
        game.load.image('frenzy', 'assets/images/frenzy.png');
        game.load.image('bomb', 'assets/images/bomb.png');
        game.load.image('scoreBoost', 'assets/images/scoreBoost.png');
        game.load.image('oneUp', 'assets/images/oneUp.png');
        game.load.image('combo', 'assets/images/combo.png');
        game.load.image('background', 'assets/images/background.png');
        game.load.image('gametitle', 'assets/images/final_logo.png');
        game.load.image('play', 'assets/images/play.png');
        game.load.image('frenzy_basket', 'assets/images/frenzy_basket.png');
        game.load.image('crackedEgg', "assets/images/cracked_egg.png");
        game.load.image('crackedFrenzy', "assets/images/cracked_frenzy.png");
        game.load.image('crackedOneUp', "assets/images/cracked_oneUp.png");
        game.load.image('crackedScoreBoost', "assets/images/cracked_scoreBoost.png");
        game.load.image('crackedCombo',"assets/images/cracked_combo.png");
        game.load.image('bombCloud', "assets/images/bomb_cloud.png");
        game.load.image('heart', "assets/images/heart.png");
        //Loading the basket spritesheet to create exploding animation when a user dies
        game.load.spritesheet('explode', "assets/images/explosion_spritesheet1.png", 155, 150);
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
