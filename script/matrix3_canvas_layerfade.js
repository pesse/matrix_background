var context;
var wi = 1920;
var hi = 1080;
var prev = performance.now();
var chars = [];
var maxRunningChars = 400;

var fontSize = 20;
var alphaMask = 0.1;
var gridHorizontal;
var gridVertical;

function getRandomHexChar() {
    let possibleChars = "0123456789ABCDEF";
    return possibleChars.charAt(Math.random() * possibleChars.length);
}

function initCanvas(stage) {
    stage.width = wi;
    stage.height = hi;
    
    gridHorizontal = Math.floor(wi/(fontSize-6));
    gridVertical = Math.floor(hi/(fontSize));

    context.fillStyle="#000000";
    context.fillRect(0, 0, wi, hi);
}

function initChar() {
    var char = {
        x: (Math.floor(Math.random()*gridHorizontal)),
        y: 0,
        tickTime: Math.random()*50+50,
        lastTick: performance.now(),
        char: getRandomHexChar()
    }
    return char;
}

function addBrightness( rgb, brightness ) {
    var multiplier = (100+brightness)/100;
    var result = {};
    result.r = rgb.r * multiplier;
    result.g = rgb.g * multiplier;
    result.b = rgb.b * multiplier;
    return result;
}

function render(time) {
    // Draw a transparent, black rect over everything
    // But not each time
    if ( time - prev > 50 ) {
        context.fillStyle="rgba(0,0,0,"+alphaMask+")";
        context.fillRect(0, 0, wi, hi);
        prev = time;
    }
        
    // Setup Context Font-Style
    context.font = 'bold 20px Consolas';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    var iOut = 0;
    for ( var i = 0; i < chars.length; i++ ) {
        var c = chars[i];
        if ( c.y < gridVertical ) { // If Char is still visible
            chars[iOut++] = c; // put it further-up in the array

            // Add a bit more random brightness to the char
            var color = addBrightness({r: 100, g:200, b:100}, Math.random()*70);
            context.fillStyle = "rgb("+color.r+","+color.g+","+color.b+")";
            context.fillText(c.char, c.x*(fontSize-6), c.y*(fontSize));

            // Only move one y-field down if the randomized TickTime is reached
            if ( time - c.lastTick > c.tickTime) {
                c.y++;
                c.lastTick = time;
                // New y-field means new Char, too
                c.char = getRandomHexChar();
            }
        }
    }
    chars.length = iOut; // Adjust array to new length. 
    //Every visible char is moved to a point before this, the rest is cut off
    
    var newChars = 0;
    while (chars.length < maxRunningChars && newChars < 3) {
        chars.push(initChar());
        newChars++;
    }

    requestAnimationFrame(render);
}

function startCanvasDraw() {
    var stage = document.getElementById("mainStage");
    if (stage.getContext) {
        context = stage.getContext("2d");
    }
    else {
        alert("Browser not able to render 2D canvas");
        return;
    }

    initCanvas(stage);

    requestAnimationFrame(render);
}