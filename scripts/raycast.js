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
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
    else if (e.keyCode == 37 && turnState < 1)
        turnState++;
    else if (e.keyCode == 39 && turnState > -1)
        turnState--;
}

// Handles a keyup event.
function handleKeyUp(e) {
    if (e.keyCode == 38 && walkState > -1)
        walkState--;
    else if (e.keyCode == 40 && walkState < 1)
        walkState++;
    else if (e.keyCode == 37 && turnState > -1)
        turnState--;
    else if (e.keyCode == 39 && turnState < 1)
        turnState++;
}

// Updates the player's position.
function updatePosition() {
    const WALK_SPEED = 0.03;
    const TURN_SPEED = Math.PI / 100;
    
    playerX += Math.cos(playerAngle) * WALK_SPEED * walkState;
    playerY += -Math.sin(playerAngle) * WALK_SPEED * walkState;
    
    playerAngle += TURN_SPEED * turnState;
    if (playerAngle > (Math.PI * 2))
        playerAngle -= Math.PI * 2;
    else if (playerAngle < 0)
        playerAngle += Math.PI * 2;
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
    /* Reduce angle to smallest equal */
    if (angle > Math.PI * 2)
        angle -= Math.PI * 2;
    else if (angle < 0)
        angle += Math.PI * 2;
    
    // Moving right/up?
    var up = angle < Math.PI;
    var left = (angle < Math.PI * 1.5) && (angle > Math.PI * 0.5);
    
    // Find change in x/y necessary to check at horizontal grid lines
    var dy = up ? -1 : 1;
    var dx = dy / Math.tan(angle);
    
    // Ray's position
    var rayY = up ? Math.floor(playerY): Math.ceil(playerY);
    var rayX = playerX + (rayY - playerY) / Math.tan(angle);
    
    // Distance to wall
    var distHoriz, distVert;
    
    // Send ray out, check at horizontal intersections
    while (rayX >= 0 && rayX < map.length
            && rayY >= 0 && rayY < map[0].length) {
        var wallX = Math.floor(rayX);
        var wallY = Math.floor(rayY + (up ? -1 : 0));
        if (map[wallY][wallX] > 0) {
            distHoriz = Math.sqrt((rayX - playerX) * (rayX - playerX)
                    + (rayY - playerY) * (rayY - playerY));
            break;
        } else {
            // Move the ray by a unit
            rayX += dx;
            rayY += dy;
        }
    }
    
    // Find change in x/y necessary to check at vertical grid lines
    dx = left ? -1 : 1;
    dy = dx * Math.tan(angle);
    
    // Ray's position
    rayX = left ? Math.floor(playerX) : Math.ceil(playerX);
    rayY = playerY + (rayX - playerX) / Math.tan(angle);
    
    // Send ray out, check at vertical intersections
    while (rayX >= 0 && rayX < map.length
            && rayY >= 0 && rayY < map[0].length) {
        wallX = Math.floor(rayX + (left ? -1 : 0));
        wallY = Math.floor(rayY);
        if (map[wallY][wallX] > 0) {
            distVert = Math.sqrt((rayX - playerX) * (rayX - playerX)
                    + (rayY - playerY) * (rayY - playerY));
            break;
        } else {
            // Move the ray by a unit
            rayX += dx;
            rayY += dy;
        }
    }
    
    return Math.min(distHoriz, distVert);
}

// Draws the player's view to the canvas.
function draw() {
    const FOV = Math.PI / 2;
    
    var canvas = document.getElementById("render-window");
    var context = canvas.getContext("2d");
    var rayAngle = playerAngle + (FOV / 2);
    
    // Draw background - sky
    context.fillStyle = "lightblue"
    context.fillRect(0, 0, canvas.width, canvas.height / 2);
    
    // Draw background - ground
    context.fillStyle = "darkgreen"
    context.fillRect(0, canvas.height / 2, canvas.width, canvas.height);
    
    // Draw walls (the fun part)
    context.fillStyle = "grey"
    for (var i = 0; i < canvas.width; i++) {
        var distProjPlane = canvas.width / 2 * Math.tan(FOV / 2);
        var colHeight = (1 / castRay(rayAngle)) * distProjPlane;
        context.fillRect(i, (canvas.height - colHeight) / 2, 1, colHeight);
        rayAngle -= FOV / canvas.width;
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
