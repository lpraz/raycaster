/*
 * raycast.js
 * Draws a raycasted view of a map to the canvas.
 */

var playerX = 0;
var playerY = 0;
var playerAngle = 0;

// Rounds to the nearest decimal point based on exp.
function round(val, exp) {
    return +(Math.round(val * Math.pow(10, exp)) / Math.pow(10, exp));
}

// Updates the player's position.
function updatePosition() {
    const SPEED = 0.1;
    playerX += Math.cos(playerAngle) * SPEED;
    playerY += Math.sin(playerAngle) * SPEED;
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
    requestAnimationFrame(gameLoop);
}
