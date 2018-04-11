var loadState = {

    //Load the assets
    preload: function(){
        var loadingLabel = game.add.text(80, 150,'loading...',
                                        {font: '30px Courier', fill: '#ffffff'});
        //Loading all assets
        game.load.image('egg', 'assets/egg.png');
        game.load.image('basket', 'assets/basket.png');
        game.load.image('win', 'assets/bomb.png');
        game.load.image('frenzy', 'assets/frenzy.png');
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('scoreBoost', 'assets/scoreBoost.png');
        game.load.image('timeBoost', 'assets/timeBoost.png');
        game.load.image('background', 'assets/background.png');
        game.load.image('gametitle', 'assets/logo.png');
        game.load.image('play', 'assets/play.png');
        game.load.image('frenzy_basket', 'assets/frenzy_basket.png');
    },

    create : function(){
      //Calling the menu state
      game.state.start('menu');
    }
};
