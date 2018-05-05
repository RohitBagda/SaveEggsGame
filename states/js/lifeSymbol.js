var life = {

    createHeart: function () {
        this.heart = game.add.sprite(.74*canvasWidth, 0.02*canvasHeight, "heart");
        this.heart.scale.setTo(0.65*scaleRatio, 0.65*scaleRatio);

        this.times = game.add.text(.81*canvasWidth, 0.02*canvasHeight, '×', {font: 'bold 60px Corbel', fill: '#003366'});
        this.livesNum = game.add.text(.85*canvasWidth, 0.02*canvasHeight, lives, {font: 'bold 60px Corbel', fill: '#003366'});
    },

    changeLife: function(){
        if(lives >= 0 && lives <= 3) {
            this.livesNum.setText(lives);
        }
    }
};