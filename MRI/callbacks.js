// =====================================================
// Mouse management
// =====================================================
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotY = 0;
var minY = 0;
var maxY = 0;
var rotX = 0;
var minX = 0;
var maxX = 0;
// =====================================================
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback,
            /* DOMElement Element */
            element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// ==========================================
function tick() {
    requestAnimFrame(tick);
    drawScene();
}

// =====================================================
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

// =====================================================
function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


// =====================================================
function handleMouseUp(event) {
    mouseDown = false;
}


// =====================================================
function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    rotY += degToRad(deltaX / 2);
    rotX += degToRad(deltaY / 2);

    mat4.identity(objMatrix);
    mat4.rotate(objMatrix, rotX, [1, 0, 0]);
    mat4.rotate(objMatrix, rotY, [0, 1, 0]);

    lastMouseX = newX
    lastMouseY = newY;

}