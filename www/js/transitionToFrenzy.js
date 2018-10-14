/**
 * This is a transition state that switches the game from the play state to the frenzy state.
 */

var transitionToFrenzyState = {
    TOTAL_TRANSITION_LENGTH: 2000,
    TEXT_SIZE_PX: 200,
    TEXT_HORZONTAL_SEPARATION: 30,
    ROW_SEPARATION: 0,
    FIRST_ROW_TEXT_START: -247,
    ROW_START_OFFSET: -567,
    TEXT_MOVEMENT_PER_FRAME: 10,

    textRows: [],

    makeText: function(centerY, left) {
        let textObj = gameController.displayFlashingFrenzyText("FRENZY", this.TEXT_SIZE_PX);
        textObj.position.y = centerY;
        textObj.left = left;
        textObj.alpha = 0;
        return textObj;
    },

    create: function(){
        //gameController.addBackground();
        gameController.createScoreText();
        gameController.createLifeBuckets();
        gameController.createPause();

        this.textRows = [];

        let widthTester = this.makeText(0, 0);
        let textWidth = widthTester.width;
        widthTester.destroy();

        for(let i = 0;; i++)
        { 
            let rowCenterY = (i * (this.TEXT_SIZE_PX + this.ROW_SEPARATION)) + (this.TEXT_SIZE_PX / 2);
            if(rowCenterY > canvasHeight) { break; }

            let rowStartX = this.FIRST_ROW_TEXT_START + (i * this.ROW_START_OFFSET);
            let firstVisibleTextLeft = rowStartX % textWidth;

            
            let thisRow = [];

            let curTextLeft = firstVisibleTextLeft;
            do 
            {
                thisRow.push(this.makeText(rowCenterY, curTextLeft));
                curTextLeft += textWidth + this.TEXT_HORZONTAL_SEPARATION;

            } while(thisRow[thisRow.length-1].left < canvasWidth)

            this.textRows[i] = thisRow;
        }

        // This loop allows the switch into the combo state
        game.time.events.add(this.TOTAL_TRANSITION_LENGTH, function(){
            game.state.start('frenzy');
        }, this);

    },

    update: function() {
        let mov = this.TEXT_MOVEMENT_PER_FRAME;
        for(let row of this.textRows) 
        {
            mov = -mov;
            for(let textObj of row) 
            {
                textObj.position.x += mov;
                if(textObj.right < 0)
                {
                    textObj.position.x += (textObj.width + this.TEXT_HORZONTAL_SEPARATION) * row.length;
                }
                if(textObj.left > canvasWidth)
                {
                    textObj.position.x -= (textObj.width + this.TEXT_HORZONTAL_SEPARATION) * row.length;
                }
                textObj.alpha = Math.min(1, textObj.alpha + 0.05);
            }
        }
    }
};