var life = {

    createHeart: function () {
        this.heart = game.add.sprite(.74*canvasWidth, 0.01*canvasHeight, "heart");
        this.heart.scale.setTo(0.65*scaleRatio, 0.65*scaleRatio);

        // game.add.text(.81*canvasWidth, 0.01*canvasHeight, '×', {font: 'bold 60px Corbel', fill: '#003366'});
        this.livesNum = game.add.text(.81*canvasWidth, 0.01*canvasHeight, ("×" +gameData.lives), {font: 'bold 60px Corbel', fill: '#003366'});
    },

    changeLife: function(){
        if(gameData.lives >= 0 && gameData.lives <= 3) {
            this.livesNum.setText("×" + gameData.lives);
        }
    },

};