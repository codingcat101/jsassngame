// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bacteria
let bacteriaWidth = 50; //width/height ratio = 408/228 = 17/12
let bacteriaHeight = 30;
let bacteriaX = boardWidth / 8;
let bacteriaY = boardHeight / 2;
let bacteriaImg;

let bacteria = {
    x: bacteriaX,
    y: bacteriaY,
    width: bacteriaWidth,
    height: bacteriaHeight
};

// antibiotics
let antibioticArray = [];
let antibioticWidth = 64; //width/height ratio = 384/3072 = 1/8
let antibioticHeight = 512;
let antibioticX = boardWidth;
let antibioticY = 0;

let topAntibioticImg;
let bottomAntibioticImg;

// physics
let velocityX = -2; //antibiotics moving left speed
let velocityY = 0; //bacteria jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    // load images
    bacteriaImg = new Image();
    bacteriaImg.src = "./bacteria.png";
    bacteriaImg.onload = function () {
        context.drawImage(bacteriaImg, bacteria.x, bacteria.y, bacteria.width, bacteria.height);
    };

    topAntibioticImg = new Image();
    topAntibioticImg.src = "./antibiotic.png";

    bottomAntibioticImg = new Image();
    bottomAntibioticImg.src = "./antibiotic.png";

    requestAnimationFrame(update); // Start the game loop using requestAnimationFrame
    setInterval(placeAntibiotics, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBacteria);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // bacteria
    velocityY += gravity;
    bacteria.y = Math.max(bacteria.y + velocityY, 0); //apply gravity to current bacteria.y, limit the bacteria.y to top of the canvas
    context.drawImage(bacteriaImg, bacteria.x, bacteria.y, bacteria.width, bacteria.height);

    if (bacteria.y > board.height) {
        gameOver = true;
    }

    // antibiotics
    for (let i = 0; i < antibioticArray.length; i++) {
        let antibiotic = antibioticArray[i];
        antibiotic.x += velocityX;
        context.drawImage(antibiotic.img, antibiotic.x, antibiotic.y, antibiotic.width, antibiotic.height);

        if (!antibiotic.passed && bacteria.x > antibiotic.x + antibiotic.width) {
            score += 0.5; //0.5 because there are 2 antibiotics! so 0.5*2 = 1, 1 for each set of antibiotics
            antibiotic.passed = true;
        }

        if (detectCollision(bacteria, antibiotic)) {
            gameOver = true;
        }
    }

    // clear antibiotics
    while (antibioticArray.length > 0 && antibioticArray[0].x < -antibioticWidth) {
        antibioticArray.shift(); //removes first element from the array
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placeAntibiotics() {
    if (gameOver) {
        return;
    }

    let randomAntibioticY = antibioticY - antibioticHeight / 4 - Math.random() * (antibioticHeight / 2);
    let openingSpace = board.height / 4;

    let topAntibiotic = {
        img: topAntibioticImg,
        x: antibioticX,
        y: randomAntibioticY,
        width: antibioticWidth,
        height: antibioticHeight,
        passed: false
    };
    antibioticArray.push(topAntibiotic);

    let bottomAntibiotic = {
        img: bottomAntibioticImg,
        x: antibioticX,
        y: randomAntibioticY + antibioticHeight + openingSpace,
        width: antibioticWidth,
        height: antibioticHeight,
        passed: false
    };
    antibioticArray.push(bottomAntibiotic);
}

function moveBacteria(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;

        if (gameOver) {
            bacteria.y = bacteriaY;
            antibioticArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
