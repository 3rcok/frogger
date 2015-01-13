/**************************************************************
 * Purpose: This file contains the functions used to instantiate
 *          the player, enemy and jewel objects.
 *
 *
 **************************************************************/

/*
 * Purpose:  This is the base object that holds common properties.
 *
 * Pre con:  none.
 * Post con: Base properties are added to objects.
 *
 * @param x - The x coordinate to spawn the object.
 * @param y - The y coordinate to spawn the object.
 * @param image - The sprit value for the object.
 */
var baseObj = function(x,y,image) {
    // The sprite holds the image to draw for this instance.
    this.sprite = image;
    this.x = x;
    this.y = y;
};

/*
 * Purpose:  This var contains the function that will instantiate
 *           enemy objects.
 *
 * Pre con:  none.
 * Post con: An enemy object has been loaded into memory.
 *
 * @param x - The x coordinate to spawn the object.
 * @param y - The y coordinate to spawn the object.
 */
var Enemy = function(x,y) {
    //call base object
    baseObj.call(this,x,y,'images/enemy-bug.png');
    this.constructor = Enemy;

    // This sets a speed modifier of 1, 2 or 3.
    this.speedMod = getRandomInt(1,4);

    // This will get the current timestamp down to seconds.
    var ts = Math.round((new Date()).getTime() / 1000);
    // This will add a random number of seconds to ts.
    // This is used to spaw another enemy instance.
    this.friend = ts + getRandomInt(1,5);
};
/*
 * Purpose:  This method contains the function that will update
 *           enemy objects.
 *
 * Pre con:  This enemy has been instantiated.
 * Post con: This enemy instance has been updated.
 *
 * @param dt - The time dialation of the last update.
 */
Enemy.prototype.update = function(dt) {
    // This is what moves the enemy across the screen.
    this.x += (90*dt)+this.speedMod;
    // This holds the current time.
    var ts = Math.round((new Date()).getTime() / 1000);
    if(this.friend === ts) {
        // Get a random y (this is used as an index of valid rows).
        var randy = getRandomInt(0,3);
        // Get a random x.
        var randx = getRandomInt(1,2) * -100;
        // Add the new enemy to allEnemies array.
        allEnemies[index] = new Enemy(randx,validRows[randy]);
        // increment the enemy index.
        index++;
        // un-set the time, so this enemy won't spawn any more friends.
        this.friend = 0;
    }
    // If the index is at 14 go back to index 0,
    // by 14 the object should be well off the screen
    // so can be reused to save on memory.
    if(index === 14) {
        index = 0;
    }
};

/*
 * Purpose:  This method contains the function that will draw
 *           enemy objects.
 *
 * Pre con:  This enemy has been updated.
 * Post con: This enemy instance has been drawn.
 */
Enemy.prototype.render = function() {
    // draw the sprite image on the canvas at this enemys x and y.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * Purpose:  This var contains the function that will instantiate
 *           jewel objects.
 *
 * Pre con:  none.
 * Post con: A Jewel object has been loaded into memory.
 *
 * @param x - The x coordinate to spawn the object.
 * @param y - The y coordinate to spawn the object.
 */
var Jewel = function(x,y) {
    // select a random image for the jewel
    //call base object
    baseObj.call(this,x,y,gems[getRandomInt(0,2)]);
    this.constructor = Jewel;

    this.speedMod = getRandomInt(1,4);
    // If there is a colission this will be set to false
    // and it will not render on the following frames.
    this.enabled = true;
    // The points to add to the play in the event of a collision.
    this.score = 100;

    var ts = Math.round((new Date()).getTime() / 1000);
    // // un-set the time, so this jewel won't spawn any more friends.
    this.friend = ts + getRandomInt(5,10);
};

/*
 * Purpose:  This method contains the function that will update
 *           jewel objects.
 *
 * Pre con:  This jewel has been instantiated.
 * Post con: This jewel instance has been updated.
 *
 * @param dt - The time dialation of the last update.
 */
Jewel.prototype.update = function(dt) {
    // Move the jewel across the screen.
    this.x += (90*dt)+this.speedMod;
    var ts = Math.round((new Date()).getTime() / 1000);
    if(this.friend === ts) {
        var randy = getRandomInt(0,3);
        var randx = getRandomInt(1,2) * -100;
        // spawn a new jewel on a random row.
        allJewels[jIndex] = new Jewel(randx,validRows[randy]);
        jIndex++;
        // set time to 0
        this.friend = 0;
    }
    if(jIndex === 14) {
        jIndex = 0;
    }
};

/*
 * Purpose:  This method contains the function that will draw
 *           jewel objects.
 *
 * Pre con:  This jewel has been updated.
 * Post con: This jewel instance has been drawn.
 */
Jewel.prototype.render = function() {
    // draw the sprite image on the canvas at this jewels x and y.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * Purpose:  This var contains the function that will instantiate
 *           player objects.
 *
 */
var Player = function() {
    //call base object
    baseObj.call(this,200,400,'images/char-boy.png');
    this.constructor = Player;

    // these hold buckets of movement that need to be applied.
    // this allows for smoother player movement.
    this.moveX = 0;
    this.moveY = 0;

    // the speed modifier of the player.
    this.speed = 5;
};

/*
 * Purpose:  This method contains the function that will handle
 *           the key press events.
 *
 * Pre con:  none.
 * Post con: if a play is able to move to that location,
 *           the move vars are set to move the player
 *           one square. The play is not actually moved
 *           untill the update method.
 */
Player.prototype.handleInput = function(key) {
    // dont process new movement untill the previous movement is done.
    if(this.moveX !== 0 || this.moveY !== 0) {
        return;
    }

    // check the bondry, dont let player go off screen.
    if(this.x>300 && key === 'right') {
        return;
    }
    if(this.x<100 && key === 'left') {
        return;
    }
    if(this.y<100 && key === 'up') {
        return;
    }
    if(this.y>359 && key === 'down') {
        return;
    }

    // set player movement vars
    if(key === 'up') {
        this.moveY -= 85;
    }
    if(key === 'down') {
        this.moveY += 85;
    }
    if(key === 'left') {
        this.moveX -= 100;
    }
    if(key === 'right') {
        this.moveX += 100;
    }
};

/*
 * Purpose:  This method contains the function that will update
 *           player object.
 *
 * Pre con:  This player has been instantiated.
 * Post con: This player instance has been updated.
 *
 * @param dt - The time dialation of the last update.
 */
Player.prototype.update = function(dt) {
    // thses will move the player a little bit each frame
    if(this.moveX > 0) {
        this.x += this.speed;
        this.moveX -= this.speed;
    }
    if(this.moveX < 0) {
        this.x -= this.speed;
        this.moveX += this.speed;
    }
    if(this.moveY > 0) {
        this.y += this.speed;
        this.moveY -= this.speed;
    }
    if(this.moveY < 0) {
        this.y -= this.speed;
        this.moveY += this.speed;
    }
};

/*
 * Purpose:  This method contains the function that will draw
 *           player objects.
 *
 * Pre con:  This player has been updated.
 * Post con: This player instance has been drawn.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * Purpose:  This function will return a random int between
 *           min and max.
 *
 * Pre con:  none
 * Post con: int has been returned.
 *
 * @param min - The minimum value to return
 * @param max - The maximum value to return
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*
 * Purpose:  This will add a listener to the document
 *           to watch for key up values. If its
 *           directional, handle the input.
 *
 * Pre con:  The page has been loaded
 * Post con: Directional kys have been handled.
 */
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // pass the key to the players handleInput method.
    player.handleInput(allowedKeys[e.keyCode]);
    e.preventDefault();
    return false;
});

/*
 * Purpose:  This function is used to help get click coordinates
 *           values, it is used for touch screen play. Disabling
 *           it for now...
 *
 * Pre con:  The page has been loaded
 * Post con: a direction is sent to the player handle method
 */
document.addEventListener('click', function(e){
    return;
    // set mouse x and y
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    var xDiff = player.x - mouse.x;
    var yDiff = player.y - mouse.y;

    if(Math.abs(xDiff) > Math.abs(yDiff)) {
        if(mouse.x > player.x) {
            player.handleInput('right');
        }
        else {
            player.handleInput('left');
        }
    }
    else {
        if(mouse.y < player.y) {
            player.handleInput('up');
        }
        else {
            player.handleInput('down');
        }
    }
}, false);

// instantiate the player.
var player = new Player();
// Holds any Enemy objects
var allEnemies = [];
// Holds any Jewel objects
var allJewels = [];
// Current index of the allEnemy array
var index = 2;
// Current index of the allJewels array
var jIndex = 1;
// Players current score.
var score = 0;
// Players top score.
var topScore = 0;
// This array hold the vaild rows that enemies and jewels can spawn on.
var validRows = [60,145,230];
// Types of jewels
var gems = ["images/GemGreen.png","images/GemOrange.png"];
// used by the mouse click listener
var mouse = {x: 0, y: 0};

//seed sprites
allJewels[0] = new Jewel(-200,validRows[1]);
allEnemies[0] = new Enemy(-100,validRows[0]);
allEnemies[1] = new Enemy(-400,validRows[2]);


