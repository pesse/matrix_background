class MatrixRow {
    constructor( x ) {
        this.x = x;
        this.curY = 0;
        this.requestId;
    }
    start() {
        let obj = this;
        let prev = performance.now();
        this.requestId = requestAnimationFrame(function myTick(time){
            if (obj.curY < document.getElementById("mainStage").clientHeight) 
                requestAnimationFrame(myTick);
            
            if (time - prev > 40) {
                obj.addFadingChar();
                obj.curY += 10;
                prev = time;
            }
        })
    }
    addFadingChar() {
        let div = getFadingCharDiv();
        div.style.position = "absolute";
        div.style.left = this.x+"px";
        div.style.top = this.curY+"px"

        document.getElementById("mainStage").append(div);
    }
}

var intervalId;

function getRandomChar() {
    return String.fromCharCode(Math.random() * 46 + 47);
}

function getFadingCharDiv() {
    let charDiv = document.createElement("span");
    charDiv.style.position = "absolute";
    charDiv.append(getRandomChar());
    charDiv.animate(
        [
            {opacity: 100},
            {opacity: 0}
        ], 
        {
            duration: 2000,
            iterations: 1,
            fill: "forwards"
        }).addEventListener("finish", function() {
            charDiv.remove();
        });
    return charDiv;
}

function tick() {
    new MatrixRow(Math.random()*(document.getElementById("mainStage").clientWidth-10)).start();
}

function main() {
    intervalId = setInterval( tick, 250);
}