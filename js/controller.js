document.body.onkeydown = function( e ) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate',
        32: 'drop'
    };
    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
        render();
    }
};

var pause = false;

function pauseOrResume() {
    pause = !pause;
}

function resetGame() {
    localStorage.clear();
    load();
}

function updateView() {
    document.getElementById('energy').innerHTML = (file.energy - file.spentEnergy).toFixed(0);
}