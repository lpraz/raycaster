/*
 * raycast.js
 * Draws a raycasted view of a map to the canvas.
 */

var playerX = 0;
var playerY = 0;
var playerAngle = 0;
var walkState = 0;
var turnState = 0;

// Rounds val to the nearest decimal point based on exp.
function round(val, exp) {
    return +(Math.round(val * Math.pow(10, exp)) / Math.pow(10, exp));
}

// Handles a keydown event.
function handleKeyDown(e) {
    if (e.keyCode == 38 && walkState < 1)
        walkState++;
    else if (e.keyCode == 40 && walkState > -1)
        walkState--;
    else if (e.keyCode == 37 && turnState > -1)
        turnState--;
    else if (e.keyCode == 39 && turnState < 1)
        turnState++;
}

// Handles a keyup event.
function handleKeyUp(e) {
    if (e.keyCode == 38 && walkState > -1)
        walkState--;
    else if (e.keyCode == 40 && walkState < 1)
        walkState++;
    else if (e.keyCode == 37 && turnState < 1)
        turnState++;
    else if (e.keyCode == 39 && turnState > -1)
        turnState--;
}

// Updates the player's position.
function updatePosition() {
    const WALK_SPEED = 0.1;
    const TURN_SPEED = Math.PI / 100;
    
    playerX += Math.cos(playerAngle) * WALK_SPEED * walkState;
    playerY += Math.sin(playerAngle) * WALK_SPEED * walkState;
    
    playerAngle += TURN_SPEED * turnState;
}

// Updates the information in the info box.
function updateInfoBox() {
    const ROUND_TO = 3;
    var xElement = document.getElementById("player-x");
    var yElement = document.getElementById("player-y");
    var angleElement = document.getElementById("player-angle");
    
    xElement.innerHTML = "X: " + round(playerX, ROUND_TO);
    yElement.innerHTML = "Y: " + round(playerY, ROUND_TO);
    angleElement.innerHTML = "Angle: " + round(playerAngle, ROUND_TO);
}

// Draws the player's view to the canvas.
function draw() {
    var canvas = document.getElementById("render-window");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    
    // Draw background - sky
    context.fillStyle = "lightblue"
    context.fillRect(0, 0, canvas.width, canvas.height / 2);
    
    // Draw background - ground
    context.fillStyle = "darkgreen"
    context.fillRect(0, canvas.height / 2, canvas.width, canvas.height);
}

// Updates everything - forms the "game loop".
function gameLoop() {
    updatePosition();
    updateInfoBox();
    draw();
    requestAnimationFrame(gameLoop);
}

// Main - when page loaded:
window.onload = function() {
    document.getElementById("render-window").onkeydown = handleKeyDown
    document.getElementById("render-window").onkeyup = handleKeyUp
    requestAnimationFrame(gameLoop);
}
