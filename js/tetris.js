var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var gameInterval;
var intervalRender;
var current; // current moving shape
var currentX, currentY; // position of current shape
var currentZ = 0; // current roation
var currentId;
var freezed; // is current shape settled on the board?

var linesCombo;

// time control

var startInterval = 400;
var currentInterval = startInterval;

var startSpeedUp = 1;
var currentSpeedUp = startSpeedUp;

var startSpeedDown = 3;
var currentSpeedDown = startSpeedDown;

// score control
var energy = 0;
var spentEnergy = 0;
var scoreToEnergy = 0.5;
var gameScore;

var initialPointsPerLine = 1;
var currentPointsPerLine = initialPointsPerLine;

// shop

var powerups = {
    initInterval:{level: 0, cost: 18, costPerLevel: 2},
    reduceSpeedUp: {level: 0, cost: 15, costPerLevel: 3},
    timeBonus: {level: 0, cost: 15, costPerLevel: 3},
    pointsGainUp: {level: 0, cost: 20, costPerLevel: 10},
    scoreToEnergy: {level: 0, cost: 19, costPerLevel: 1},
};

var skills = {
    comboLines:{cost: 250, owned: false},
    noBomb:{cost: 320, owned: false},
};

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated
function newShape() {
    id = Math.floor(Math.random() * shapes.length);
    currentId = id;
    var shape = shapes[id][0]; // maintain id for color filling

    current = shapeToCurrent(shape);

    // new shape starts to move
    freezed = false;
    // position where the shape will evolve
    currentX = 5;
    currentY = 0;
}

function shapeToCurrent(shape) {
    var current = [];
    for (var y = 0; y < 5; ++y) {
        current[y] = [];
        for (var x = 0; x < 5; ++x) {
            var i = 5 * y + x;
            if (typeof shape[i] != 'undefined' && shape[i]) {
                current[y][x] = id + 1;
            } else {
                current[y][x] = 0;
            }
        }
    }
    return current;
}

// clears the board
function init() {
    for (var y = 0; y < ROWS; ++y) {
        board[y] = [];
        for (var x = 0; x < COLS; ++x) {
            board[y][x] = 0;
        }
    }
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {

    clearInterval(gameInterval);
    currentInterval -= currentSpeedUp;
    gameInterval = setInterval(gameTick, currentInterval);

    document.getElementById('interval').innerHTML = currentInterval.toFixed(0);
    document.getElementById('score').innerHTML = gameScore.toFixed(0);

    linesCombo = 0;

}

function gameTick() {

    if (valid(0, 1)) {
        ++currentY;
    }
    // if the element settled
    else {
        freeze();
        valid(0, 1);
        clearLines();
        if (lose) {
            loseGame();
            return false;
        }
        newShape();
    }
}

// stop shape at its position and fix it to board
function freeze() {
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (current[y][x]) {
                board[y + currentY][x + currentX] = current[y][x];
            }
        }
    }
    freezed = true;
}


// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate() {
    var newCurrent = current;
    if (typeof (shapes[currentId][currentZ + 1]) != "undefined") {
        currentZ++
    } else {
        currentZ = 0;
    }
    var shape = shapes[currentId][currentZ];

    if (valid(0, 0, shapeToCurrent(shape))) {
        newCurrent = shapeToCurrent(shape);
    }

    return newCurrent;
}

// check if any lines are filled and clear them
function clearLines() {
    for (var y = ROWS - 1; y >= 0; --y) {
        var rowFilled = true;
        for (var x = 0; x < COLS; ++x) {
            if (board[y][x] == 0) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            document.getElementById('clearsound').play();
            for (var yy = y; yy > 0; --yy) {
                for (var x = 0; x < COLS; ++x) {
                    board[yy][x] = board[yy - 1][x];
                }
            }
            ++y;

            gameScore += currentPointsPerLine;
            if (skills['comboLines'].owned) gameScore = gameScore + 0.5*linesCombo;
            currentInterval += currentSpeedDown;
            if (linesCombo == 0) {
                linesCombo = 1
            } else {
                linesCombo += linesCombo;
            }
        }
    }
}

function keyPress(key) {
    switch (key) {
        case 'left':
            if (valid(-1)) {
                --currentX;
            }
            break;
        case 'right':
            if (valid(1)) {
                ++currentX;
            }
            break;
        case 'down':
            if (valid(0, 1)) {
                ++currentY;
            }
            break;
        case 'rotate':
            current = rotate();
            break;
        case 'drop':
            while (valid(0, 1)) {
                ++currentY;
            }
            tick();
            break;
    }
}

// checks if the resulting position of current shape will be feasible
function valid(offsetX, offsetY, newCurrent) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for (var y = 0; y < 5; ++y) {
        for (var x = 0; x < 5; ++x) {
            if (newCurrent[y][x]) {
                if (typeof board[y + offsetY] == 'undefined'
                    || typeof board[y + offsetY][x + offsetX] == 'undefined'
                    || board[y + offsetY][x + offsetX]
                    || x + offsetX < 0
                    || y + offsetY >= ROWS
                    || x + offsetX >= COLS) {
                    if (offsetY == 1 && freezed) {
                        lose = true; // lose if the current shape is settled at the top most row
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function playButtonClicked() {
    newGame();
    document.getElementById("playbutton").disabled = true;
}

function newGame() {
    clearAllIntervals();
    intervalRender = setInterval(render, 30);
    controlPowerUps();
    init();
    gameScore = 0;

    newShape();
    lose = false;

    interval = setInterval(tick, currentInterval);
}

function controlPowerUps() {
    currentInterval = startInterval + powerups['initInterval'].level*30;
    currentSpeedUp = startSpeedUp / (1+powerups['reduceSpeedUp'].level*0.1);
    console.log(currentSpeedUp);
    currentSpeedDown = currentSpeedDown; + powerups['timeBonus'].level*0.3;
    currentPointsPerLine = currentPointsPerLine + powerups['pointsGainUp'].level
}

function loseGame() {
    document.getElementById('playbutton').disabled = false;
    //TODO: make this thing stop adding digits
    energy = Math.abs(parseInt(energy) + (parseInt(gameScore * (scoreToEnergy + powerups['scoreToEnergy'].level*0.05))));
    // document.cookie = "tetrisEnergy=" + energy;
    document.getElementById('energy').innerHTML = energy - spentEnergy;
    save();
    clearAllIntervals();
}

function clearAllIntervals() {
    clearInterval(interval);
    clearInterval(intervalRender);
    clearInterval(gameInterval);
}

function save() {
    localStorage.setItem('energy', energy)
}

function load() {

    var energyString = localStorage.getItem('energy');
    console.log(energyString);
    energy = energyString;
    document.getElementById('energy').innerHTML = energy;
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

//SHOP

function buyPowerUp(id) {
    var cost = (powerups[id].cost + powerups[id].costPerLevel * powerups[id].level);
    if ( cost <= (parseInt(energy) - spentEnergy)) {
        spentEnergy += cost;
        powerups[id].level++;
        cost = (powerups[id].cost + powerups[id].costPerLevel * powerups[id].level);
        document.getElementById('energy').innerHTML = energy - spentEnergy;
        var currentHTML = document.getElementById(id).innerHTML;
        var newHTML = currentHTML.substr(0, currentHTML.indexOf('|') + 1) + ' '+ cost;
        document.getElementById(id).innerHTML = newHTML;
    }
}

function buySkill(id) {
    var cost = (skills[id].cost);
    if ( cost <= (parseInt(energy) - spentEnergy)) {
        document.getElementById(id).remove();
        spentEnergy += cost;
        skills[id].owned = true;
        document.getElementById('energy').innerHTML = energy - spentEnergy;

        if (id == ('noBomb')) {
            shapes.pop();
            colors.pop();
        }
    }
}