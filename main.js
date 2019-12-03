let score = document.querySelector(".score");
let gameBoard = document.querySelector(".game-board");
let playAgain = document.querySelector(".play-again");
let goHome = document.querySelector(".go-home");
let homeScreen = document.querySelector(".home-screen")
let back = document.querySelector(".back");
let yourScore = document.querySelector(".your-score")
let yours = document.querySelector(".yours")
let grids = document.querySelector(".grids")

/************/

let borders = false;
let grid = false;
let gameStarted = false;
let step = 15,
    globalSpeed = 80; // canvas width and height = numbers divisible by step.
speed = globalSpeed;
let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d")
let width = canvas.width,
    height = canvas.height;
let appleX = width / step,
    appleY = height / step;
let [column, row, canTurn, secondTurn, turn, running] = [0, 0, true];
let canTurnAgain = true;
let snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
let apple = [];
let newScore;
let legalMoves = {
    left: ["up", "down"],
    right: ["up", "down"],
    up: ["left", "right"],
    down: ["left", "right"]
}

/**** TIMER ****/

let increase = false;
let activated = false;

function setTimer(seconds) {
    return function () {
        console.log(seconds)
        return --seconds
    }
}

let timer = setTimer(5)

function runTimer() {
    activated = true;
    let innerTimer = setInterval(function () {
        if (!timer()) {
            clearInterval(innerTimer)
            increase = false;
            doubleScore = false;
            speed = globalSpeed;
            timer = setTimer(5)
            activated = false;
        }
    }, 1000)
}

function activateGrid() {
    grid = !grid
}

grids.addEventListener("click", activateGrid)
/*****************************************/

let hard = document.querySelector(".hard")
let normal = document.querySelector(".normal")

function activateBorders() {

    borders = true;
    canvas.style.display = "block"
    homeScreen.style.display = "none";
    restart()

}

function desactivateBorders() {

    borders = false;
    canvas.style.display = "block"
    homeScreen.style.display = "none";
    restart()

}

function mainScreen() {
    homeScreen.style.display = "flex";
    gameBoard.style.display = "none"
    ctx.clearRect(0, 0, width, height) // canvas.width
    gameStarted = true;
}

hard.addEventListener("click", activateBorders)
normal.addEventListener("click", desactivateBorders)
goHome.addEventListener("click", mainScreen)
back.addEventListener("click", mainScreen)

function toggleDisplay() {
    gameBoard.style.display = "flex";
}

function restart() {

    speed = globalSpeed;
    step = 15;

    width = canvas.width;
    height = canvas.height;

    appleX = width / step;
    appleY = height / step;

    powerX = width / step;
    appleY = height / step;

    [column, row, canTurn, canTurnAgain, secondTurn, turn, running] = [0, 0, true, true];

    snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
    apple = [];

    gameStarted = false;

    game = setTimeout(function getRunning() {
        let innerRunning = setTimeout(getRunning, speed)
        drawBoard()
        if (gameStarted) {
            clearTimeout(innerRunning)
            clearTimeout(game)
            gameStarted = false;

        }


    })
    gameBoard.style.display = "none";

    score.textContent = 0;


}

playAgain.addEventListener("click", restart)


/************************************/

/**** POWER-UPS ****/
let doubleScore;
let powerUps = [];


let powers = [function () { speed = 40 }, function () { speed = 100 },
function () { doubleScore = true },
function () { snake = snake.slice(0, snake.length / 2) },
function () { snake = [...snake, ...snake] }]

/************************************/

/**** DIRECTION ****/

function direction(event) {

    if (!canTurn && canTurnAgain) {

        if (event.keyCode == 37 && secondTurn != "right") {
            secondTurn = "left";
        } else if (event.keyCode == 38 && secondTurn != "down") {
            secondTurn = "up";
        } else if (event.keyCode == 39 && secondTurn != "left") {
            secondTurn = "right";
        } else if (event.keyCode == 40 && secondTurn != "up") {
            secondTurn = "down";
        }

        canTurnAgain = false;

    }

    if (canTurn) {

        if (event.keyCode == 37 && turn != "right") {
            turn = "left";
        } else if (event.keyCode == 38 && turn != "down") {
            turn = "up";
        } else if (event.keyCode == 39 && turn != "left") {
            turn = "right";
        } else if (event.keyCode == 40 && turn != "up") {
            turn = "down";
        }

        canTurn = false;


    }


    if (!running) {
        running = "run"
    }

}
let directionCounter = 0;
document.addEventListener("keydown", direction);

function turnSnake() {

    if (turn === "left") {
        column -= step;

    } else if (turn === "right") {
        column += step;

    } else if (turn === "up") {
        row -= step;

    } else if (turn === "down") {
        row += step;

    }

}

/**** DRAW ****/

function drawSnake() {

    for (let counter = 0; counter < snake.length; counter++) {

        ctx.fillStyle = (counter % 2) ? "#F13400" : "#EFE4BC";
        ctx.fillRect(snake[counter].x, snake[counter].y, step, step)

        /*
        ctx.lineWidth = 2;
        ctx.strokeRect(snake[counter].x, snake[counter].y, step, step)
        */
    }

}

function drawGrid() {

    // (x, y, width, height)

    /*
    let pato = 2;
  
    for (let line = step; line <= canvas.width; line += step) {
  
      if (pato == 2) {
        ctx.fillStyle = "#52A454";
        ctx.fillRect(line, 0, step, height);
  
        ctx.fillStyle = '#52A454';
        ctx.fillRect(0, line, width, step);
  
        pato = 0;
      } else {
        pato = 2;
      }
  
    }
    */


    for (let line = step; line <= width; line += step) {

        ctx.fillStyle = "#FFF";
        ctx.fillRect(`${line}`, 0, 0.5, `${height}`);

        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, `${line}`, `${width}`, 0.5);

    }


}

function drawApple() {

    if (apple.length == 0) {

        apple.push("x")

        appleX = Math.round(Math.random() * (appleX - 1)) * step;
        appleY = Math.round(Math.random() * (appleY - 1)) * step;


    }

    ctx.fillStyle = "#F2A34D";
    ctx.fillRect(appleX, appleY, step, step)
}

let probabilities = [];
let probabilityCoordinates = [];
let pX, pY;

function getProbability() {

    if (probabilities.length == 0) { // DOESN?T HAVE TO BE AN ARRAY
        let squares = ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
            "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x",
            "x", "x", "x", "x", "x", "x", "x", "x", "x",
            "x", "x", "x", "x", "x", "x", "x", "x", "x"]
        probabilities.push(...squares) // appleX = 20 is off bounds -> 400 // This doesn't have to be an array either, just a variable would be fine?
        for (let x of probabilities) {

            pX = Math.round(Math.random() * (pX - 1)) * step;
            pY = Math.round(Math.random() * (pY - 1)) * step;
            probabilityCoordinates.push({ pX, pY })
            pX = width / step;
            pY = height / step;
        }

    }


    for (let patos of probabilityCoordinates) {

        ctx.fillStyle = "#733B2E";

        ctx.fillRect(patos.pX, patos.pY, step, step)
    }

}

let powerX = width / step,
    powerY = height / step;

function addPowerUp() {

    if (powerUps.length == 0) { // DOESN?T HAVE TO BE AN ARRAY

        //powerUps.push("x") // appleX = 20 is off bounds -> 400 // This doesn't have to be an array either, just a variable would be fine?
        //powerUps.push({x: Math.round(Math.random() * (width / step - 1)) * step, y: Math.round(Math.random() * (height / step - 1))})
        powerUps.push("x")
        powerX = Math.round(Math.random() * (powerX - 1)) * step;
        powerY = Math.round(Math.random() * (powerY - 1)) * step;


    }

    ctx.fillStyle = "black";
    ctx.fillRect(powerX, powerY, step, step)
}

/**** CHECK BORDERS ****/

function checkBorders() {

    if ((column >= width || column < 0 || row >= height || row < 0) && borders == true) {
        toggleDisplay()
        //clearInterval(game)
        clearTimeout(game)
        yours.textContent = score.textContent
        gameStarted = true;
        //canvas.style.background = "red"
    }

    if (column >= width) {
        column = 0;
    } else if (column < 0) {
        column = width

    }

    if (row >= height) {
        row = 0;
    } else if (row < 0) {
        row = height
    }


}

/**** CHECK SNAKE PROGRESS ****/

function checkSnakeProgress() {

    if (running) {
        snake.unshift({ x: column, y: row })
        snake.pop()
    }

}

/**** CRASH ****/

function crash([head, ...body]) {

    return body.filter(coordinate => head.x == coordinate.x && head.y == coordinate.y)

}

/**** VALIDATE POSITION ****/

function validatePosition(x, y, body) {

    return body.filter(coordinate => x == coordinate.x && y == coordinate.y)

}

function goAhead() {
    if (validatePosition(appleX, appleY, snake).length) {
        appleX = width / step;
        appleY = height / step;
        appleX = Math.round(Math.random() * (appleX - 1)) * step;
        appleY = Math.round(Math.random() * (appleY - 1)) * step;
    }
}

/**** END GAME ****/

function endGame() {

    if (crash(snake).length && snake.length > 3) {
        clearTimeout(game)
        gameStarted = true;
        toggleDisplay()
        yours.textContent = score.textContent
    }

}

function what() {
    return [snake[0], ...probabilityCoordinates]
}

/**** REASSIGN VARIABLES ****/

function reassign() {
    canTurn = true;
    canTurnAgain = true;
    secondTurn = undefined;
}

function drawBoard() {

    turnSnake()


    ctx.clearRect(0, 0, width, height) // canvas.width
    ctx.fillStyle = 'blue';

    ctx.fillRect(powerX, powerY, step, step)

    checkBorders()
    crash(snake)
    goAhead()

    getProbability()
    drawApple()
    drawSnake()
    if (grid) {
        drawGrid()
    }

    addPowerUp()
    if (crash(what()).length) {
        //console.log("there")
    }


    if (secondTurn && legalMoves[turn].includes(secondTurn)) {

        turn = secondTurn
    } else {
        reassign()
    }


    checkSnakeProgress()

    let snakeCoordinates = [snake[0].x, snake[0].y];
    let appleCoordinates = [appleX, appleY];
    let powerUp = [powerX, powerY]


    endGame()

    if (areEqual(snakeCoordinates, powerUp)) {

        increase = true;
        powerUps.pop()
        powerX = width / step
        powerY = height / step

    }


    if (increase) {
        let randomPick = Math.floor(Math.random() * powers.length);
        if (!activated) {
            runTimer()
            powers[randomPick]()
        }

    }


    if (areEqual(snakeCoordinates, appleCoordinates)) {

        snake.push({ x: column, y: row })
        apple.pop()
        appleX = width / step
        appleY = height / step

        /**** SCORE ****/

        if (doubleScore) {
            newScore = Number(score.textContent) + 100
        } else {
            newScore = Number(score.textContent) + 50
        }
        score.textContent = newScore

    }


}

function areEqual(arr1, arr2) {

    if (arr1.length === arr2.length) {
        for (let counter = 0; counter < arr1.length; counter++) {
            if (arr1[counter] !== arr2[counter]) {
                return false
            }
        }
    }
    return true
}