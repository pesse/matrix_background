var matrixRows = [];
var context;
var prev = -1;
var wi = 1920;
var hi = 1080;
var maxRows = 150;


class MatrixChar {
    constructor( char, x, y, fadeVelocity, fontSize ) {
        this.char = char;
        this.x = x;
        this.y = y;
        this.fadeVelocity = fadeVelocity;
        this.fontSize = fontSize;
        this.opacity = 100;
    }
    draw(context, duration) {
        this.opacity = this.opacity - (duration / this.fadeVelocity);
        if ( this.opacity < 0) return;
        
        context.fillStyle = "rgb(100,200,100)";
        context.font = 'bold '+this.fontSize+'px Consolas';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.save();
        context.globalAlpha = this.opacity/100;
        context.fillText(this.char, this.x, this.y);
        context.restore();
    }
}
class MatrixRow {
    constructor( x ) {
        this.x = x;
        this.curY = 0;
        this.fadeVelocity = Math.random()*30+10;
        this.runVelocity = Math.random()*50+10;
        this.chars = [];
        this.fontSize = Math.round(Math.random()*30)+20;
        this.yGain = this.fontSize/(Math.random()+1.2);
        this.prev = performance.now();
        this.lastTick = performance.now();
    }
    draw(context, time) {
        if ( (this.curY < hi) && ((time - this.prev) > this.runVelocity)) {
            this.chars.push(new MatrixChar(getRandomChar(), this.x, this.curY, this.fadeVelocity, this.fontSize));
            this.curY += this.yGain;
            this.prev = time;
        }

        this.chars.forEach(element => {
            element.draw(context, (time - this.lastTick));
        });
        this.chars = this.chars.filter(elem => {return elem.opacity > 0});

        this.lastTick = time;
    }
}


function getRandomChar() {
    let possibleChars = "0123456789ABCDEF";
    return possibleChars.charAt(Math.random() * possibleChars.length);
}

function initCanvas(stage, context) {
    stage.width = wi;
    stage.height = hi;
}

function render(time) {
    context.fillStyle="#000000";
    context.fillRect(0, 0, wi, hi);

    matrixRows.forEach(mRow => {
        mRow.draw(context, time);
    });

    matrixRows = matrixRows.filter(elem => {return elem.chars.length > 0 || elem.curY < hi});

    if ( time - prev > 50 && matrixRows.length < maxRows ) {
        prev = time;
        matrixRows.push(new MatrixRow(Math.random()*wi-10));
    }
    requestAnimationFrame(render);
}

function startCanvasDraw() {
    var stage = document.getElementById("mainStage");
    if (stage.getContext) {
        context = stage.getContext("2d");
    }
    else {
        alert("Browser nicht Context-fähig");
        return;
    }

    initCanvas(stage, context);

    requestAnimationFrame(render);
}