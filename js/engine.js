/**************************************************************
 * Purpose: This file contains the functions used to drive the
 *          game engine. It will render the images and detect
 *          collisions.
 *
 **************************************************************/

/*
 * Purpose: this var contains the engine object
 */
var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime,
        collisionOccurred = false,
        rAfId;



        //set the size of the game play area
    canvas.width = 505;
    canvas.height = 606;

    //append the canvas to the DOM
    doc.body.appendChild(canvas);

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        if (collisionOccurred) {
            win.cancelAnimationFrame(rAfId);
            return;
        }
        render();

        lastTime = now;
        win.requestAnimationFrame(main);
    }

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    // enabled checkCollisions function, ks872x 10/24/2014
    function update(dt) {
        updateEntities(dt);
        if (checkCollisions()) {
            collisionOccurred = true;
            if (win.confirm('Collision occurred! do you wanna start again?')) {
                reset();
                collisionOccurred = false;
            }
        }
    }

    /*
     * Purpose:  This function will check if any collision have occured.
     *
     * Pre con:  none
     * Post con: collisions have been handled.
     */
    function checkCollisions()
    {
        // check each enemy and see if the player has collided
        allEnemies.forEach(function(enemy) {
            if(xBetween(enemy.x,player.x-20,player.x+40) && xBetween(enemy.y,player.y-20,player.y+40)) {
                collisionOccurred = true;
                if (win.confirm('Collision occurred! do you wanna start again?')) {
                    reset();
                    collisionOccurred = false;
                }
                // reset the vars to starting points (except top score)
                reset();
            }
        });

        // check each jewel and see if the player has collided
        allJewels.forEach(function(jewel) {
            if(xBetween(jewel.x,player.x-20,player.x+40) && xBetween(jewel.y,player.y-20,player.y+40)) {
                // add the jewel score to the players score
                score += jewel.score;
                // display the new sore to the user
                document.getElementById("score").innerHTML = "Score: " + score;
                // disable the jewel
                jewel.enabled = false;
                // set the score to 0 (so the score only gets counted once per jewel
                jewel.score = 0;

                // if the new score is greater, set that top score.
                if(score>topScore) {
                    topScore = score;
                    // display the new top score
                    document.getElementById("topScore").innerHTML = "Top Score: "+topScore;
                }
            }
        });
    }

    /*
     * Purpose:  This check if a number is between 2 other numbers.
     *           Is (a < x < b).
     *
     * Pre con:  none
     * Post con: true if x is in between a and b
     *
     * @param x - Is (a < x < b)
     * @param a - Is (a < x < b)
     * @param x - Is (a < x < b)
     */
    function xBetween(x,a,b){
        if(x>a && x<b) {
            return true;
        }
        else {
            return false;
        }
    }

/*
     * Purpose:  This update all of the objects with their new values
     *
     * Pre con:  objects exist
     * Post con: objects have been updated
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
	allJewels.forEach(function(jewel) {
            jewel.update(dt);
        });
        player.update();
    }

    /*
     * Purpose:  This will draw the background objects on the screen.
     *
     * Pre con:  resources exits to draw
     * Post con: objects have been drawn.
     */
    function render() {
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png'
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        // draw the background
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        // draw any objects that exist
        renderEntities();
    }

    /*
     * Purpose:  This will draw all of the sprite objects on the screen.
     *
     * Pre con:  resources exits to draw
     * Post con: objects have been drawn.
     */
    function renderEntities() {
        allJewels.forEach(function(jewel) {
            if(jewel.enabled) {
                jewel.render();
            }
        });

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /*
     * Purpose:  This will reset all of the objects back to thier starting values.
     *
     * Pre con:  none
     * Post con: objects have been reset.
     */
    function reset() {
        player = new Player();
        allEnemies = [];
        allJewels = [];
        index = 2;
        jIndex = 1;
        allJewels[0] = new Jewel(-300,50);
        allEnemies[0] = new Enemy(-200,60);
        allEnemies[1] = new Enemy(-400,230);
        score = 0;
        document.getElementById("score").innerHTML = "Score: " + score;
        document.getElementById("topScore").innerHTML = "Top Score: " + topScore;
    }

    /*
     * Purpose:  This load all of the resources to be used.
     *
     * Pre con:  files exist
     * Post con: resources are in memory.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/GemOrange.png',
        'images/GemGreen.png'
    ]);

    // after the resources have been loaded, start the game
    Resources.onReady(init);

    // make the canvas global
    global.ctx = ctx;
})(this);
