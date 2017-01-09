/*
 * raycast.js
 * Draws a raycasted view of a map to the canvas.
 */

var playerX = 2;
var playerY = 2;
var playerAngle = 0;
var walkState = 0;
var turnState = 0;

const map = [
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

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
    const WALK_SPEED = 0.03;
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

// Casts a single ray from the player at a given angle, returns distance.
function castRay(angle) {
    const DRAW_DIST = 30;
    
    // Find change in x/y necessary to check at horizontal intersections
    angle %= (Math.PI * 2);
    var dx = Math.tan(angle);
    var dy = angle > Math.PI ? -1 : 1;
    
    // Ray's position
    var rayX = playerX;
    var rayY = playerY;
    
    // Distance to wall
    var distX;
    var distY;
    
    // Send ray out, check at horizontal intersections
    while (rayX >= 0 && rayX < map.length
            && rayY >= 0 && rayY < map[0].length) {
        if (map[Math.floor(rayX)][Math.floor(rayY)] > 0) {
            distX = rayX - playerX;
            distY = rayY - playerY;
            break;
        } else {
            // Move the ray up
            rayX += dx;
            rayY += dy;
        }
    }
    
    // Find change in x/y necessary to check at vertical intersections
    dy = Math.tan(angle);
    dx = (angle > Math.PI * 1.5) || (angle < Math.PI * 0.5) ? 1 : -1;
    
    // Ray's position
    rayX = playerX;
    rayY = playerY;
    
    // Send ray out, check at vertical intersections
    while (rayX >= 0 && rayX < map.length
            && rayY >= 0 && rayY < map[0].length) {
        if (map[Math.floor(rayX)][Math.floor(rayY)] > 0) {
            if (distX > rayX - playerX)
                distX = rayX - playerX;
            
            if (distY > rayY - playerY)
                distY = rayY - playerY;
            
            break;
        } else {
            // Move the ray up
            rayX += dx;
            rayY += dy;
        }
    }
   
    return Math.sqrt(distX * distX + distY * distY);
}

// Draws the player's view to the canvas.
function draw() {
    const FOV = Math.PI / 3;
    
    var canvas = document.getElementById("render-window");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    
    // Draw background - sky
    context.fillStyle = "lightblue"
    context.fillRect(0, 0, canvas.width, canvas.height / 2);
    
    // Draw background - ground
    context.fillStyle = "darkgreen"
    context.fillRect(0, canvas.height / 2, canvas.width, canvas.height);
    
    // Draw walls (the fun part)
    context.fillStyle = "grey"
    for (var i = 0; i < canvas.width; i++) {
        var colHeight = castRay(
            100 * (playerAngle + (FOV * (i / canvas.width)) - (FOV / 2))
        );
        context.fillRect(i, (canvas.height / 2) - (colHeight / 2),
                1, colHeight);
    }
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
    var canvas = document.getElementById("render-window");
    canvas.onkeydown = handleKeyDown;
    canvas.onkeyup = handleKeyUp;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    requestAnimationFrame(gameLoop);
}
