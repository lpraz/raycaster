/*
 * raycast.js
 * Draws a raycasted view of a map to the canvas.
 */

var playerX = 0;
var playerY = 0;

// Updates the information in the info box.
function updateInfoBox() {
    var xElement = document.getElementById("player-x");
    var yElement = document.getElementById("player-y");
    
    xElement.innerHTML = "X: " + playerX;
    yElement.innerHTML = "Y: " + playerY;
}

// Main - when loaded:
window.onload = function() {
    updateInfoBox();
}
