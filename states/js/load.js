var loadState = {

    //Load the assets
    preload: function(){
        var loadingLabel = game.add.text(80, 150,'loading...',
                                        {font: '30px Courier', fill: '#ffffff'});
        // Loading all sprites
        game.load.image('egg', 'assets/egg.png');
        game.load.image('basket', 'assets/basket.png');
        game.load.image('win', 'assets/bomb.png');
        game.load.image('frenzy', 'assets/frenzy.png');
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('scoreBoost', 'assets/scoreBoost.png');
        game.load.image('oneUp', 'assets/oneUp.png');
        game.load.image('combo', 'assets/combo.png');
        game.load.image('background', 'assets/background.png');
        game.load.image('gametitle', 'assets/logo.png');
        game.load.image('play', 'assets/play.png');
        game.load.image('frenzy_basket', 'assets/frenzy_basket.png');
        game.load.image('crackedEgg', "assets/cracked_egg.png");
        game.load.image('crackedFrenzy', "assets/cracked_frenzy.png");
        game.load.image('crackedOneUp', "assets/cracked_oneUp.png");
        game.load.image('crackedScoreBoost', "assets/cracked_scoreBoost.png");
        game.load.image('crackedCombo',"assets/cracked_combo.png");
        game.load.image('bombCloud', "assets/bomb_cloud.png");
        game.load.image('heart', "assets/heart.png");

        game.load.spritesheet('explode', "assets/explosion_spritesheet1.png", 155, 150);

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

    create : function(){
      //Calling the menu state
      game.state.start('menu');

      backgroundMusic = game.add.audio('background_music');
      backgroundMusic.volume = 0.4;
      backgroundMusic.loop = true;
      backgroundMusic.play();
    }
};
