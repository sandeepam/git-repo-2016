/* Constants declaration */

// Colors needed
const BASE_COLOR = "Brown";
const PADDLE_COLOR = "Black";
const BALL_COLOR = "Cyan";
const LINE_COLOR = "White";
const TEXT_COLOR = "White";

//Fonts
const PRIMARY_FONT = "12px Verdana";
const SECONDARY_FONT = "11px Verdana";

// Radius of the ball
const BALL_RADIUS = 10;

// Width and height of the paddles
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

// Winning score
const WIN_SCORE = 1;



/* Variables declaration */

// Holds the HTML5 canvas element
var canvas;

// Holds the context of the canvas element
var context;

// Initial positions/co-ordinates for drawing the ball
var ballX;
var ballY;

// Initial speed for ball movement
var speedX = 5; 
var speedY = 3;

// Initial vertical positions/co-ordinates for the paddles
var paddle1Y = 250;
var paddle2Y = 250;

// Player Information
var player1 = "Player 1";
var player2 = "Player 2";
var player1Score = 0;
var player2Score = 0;
var winningPlayer;
var startGame = false;
var gameOver = false;



/* Code Starts Here */

// Code fires only after the page is loaded fully
window.onload = function() {
    
    // Get the canvas element and it's context
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    
    // Set frames per second for ball movement
    var fps = 60;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    
    // Call methods to move and draw shapes for the set interval    
    setInterval(
        function() {
            drawShapes();
            moveShapes();
        }, 1000/fps
    );
    
    // Add event listener for mouse move event. This moves the left paddle as per the mouse movement
    canvas.addEventListener("mousemove", function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
    
    // Add event listener for mouse click event. This starts the new game on mmouse click on the Game Over screen
    canvas.addEventListener("mousedown", function(evt) {
        if(gameOver) {
            // reset player scores
            player1Score = 0;
            player2Score = 0;
            gameOver = false;
            
            speedX = 5;
            speedY = 3;
        }
        
        //setTimeout(function(){startGame = true;}, 3000);
        startGame = true;
    });
}

// Code to move the shapes, ball, paddles etc.
function moveShapes() {
    
    // If game over, do nothing. Else continue
    if(gameOver || startGame == false) {
        return;
    }
    
    // Movement of the right paddle by computer
    computerMovement();
    
    // Change position of the ball by appending the speeds respectively
    ballX += speedX;
    ballY += speedY;
    
    // Change ball course/ lose the ball at the canvas edges based on certain conditions
    // If ball goes past the right most edge
    if(ballX > canvas.width) {
        
        // If ball is within the right paddle area, bounce back (change course/ reverse direction) and increase speedY
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            speedX = -speedX;            
            
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            speedY = deltaY * 0.15;
        }
        
        // Else lose the ball and reset
        else {
            // Increment player 1 score by 1
            player1Score++;
            ballReset();
        }
    }
    // If ball goes past the left most edge
    else if(ballX < 0) {
        
        // If ball is within the left paddle area, bounce back (change course/ reverse direction) and increase speedY
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            // Reverse ball horizontal direction
            speedX = -speedX;
            
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            speedY = deltaY * 0.35;
        }
        
        // Else lose the ball and reset
        else {
            // Increment player 1 score by 1
            player2Score++;
            ballReset();
        }
    }
    
    // If ball encounters top and bottom of canvas, bouce back
    if(ballY <= 0 || ballY > canvas.height) {
        // Reverse ball vertical direction
        speedY = -speedY;
    }
}

// Code for computer AI for right paddle movement
function computerMovement() {
    // Get the center of the right paddle
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    
    // If right paddle center is less than the ball's verticle position when the ball is nearing
    if(paddle2YCenter < ballY - 35) {
        
        // Increase verticle co-ord by 6
        paddle2Y += 6;
    }
    
    // If right paddle center is more than the ball's verticle position when the ball is moving away
    else if(paddle2YCenter > ballY + 35) {
        
        // Decrease verticle co-ord by 6
        paddle2Y -= 6;
    }
}

// Draw the required shapes on the canvas
function drawShapes() {
    console.log(startGame);
    // Draw base with black bg
    drawRectangle(0, 0, canvas.width, canvas.height, BASE_COLOR);
    
    // If game over, show respective message and stop. Do not proceed
    if(gameOver) {
        context.fillStyle = TEXT_COLOR;
        context.font = PRIMARY_FONT;
        context.textAlign = "center";
        context.fillText("GAME OVER!  " + winningPlayer + " Wins", canvas.width/2, 60);
        context.font = SECONDARY_FONT;
        context.textAlign = "center";
        context.fillText("Click to begin new game", canvas.width/2, 100);
        return;
    }
    
    // Show Begin screen if game not started
    if(startGame == false) {
        context.fillStyle = TEXT_COLOR;
        context.font = PRIMARY_FONT;
        context.textAlign = "center";
        context.fillText("Welcome to Tennis game", canvas.width/2, 60);
        context.font = SECONDARY_FONT;
        context.textAlign = "center";
        context.fillText("Click to Begin", canvas.width/2, 100);
        return;
    }
    
    // If game has been started
    else {
        // Draw left paddle, colored white
        drawRectangle(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

        // Draw right paddle, colored white
        drawRectangle(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

        // Draw Ball, colored white
        drawCircle(ballX, ballY, BALL_RADIUS, BALL_COLOR);

        // Show players and scores for each side
        context.fillStyle = TEXT_COLOR;
        context.font = PRIMARY_FONT;
        context.textAlign = "center";
        context.fillText(player1 + ": " + player1Score, canvas.width/4, 20);
        context.fillText(player2 + ": " + player2Score, canvas.width*3/4, 20);

        // Draw net
        drawLine();
    }
}

// Generic function for drawing the rectangle for the given parameters
function drawRectangle(leftX, topY, width, height, color) {
    context.fillStyle = color;
    context.fillRect(leftX, topY, width, height);
}

// Generic function for drawing the circle for the given parameters
function drawCircle(centerX, centerY, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    context.fill();
}

// Generic function for drawing the line
function drawLine() {
    // Define the start and end points of the line
    var startX = canvas.width/2;
    var endX = canvas.width/2; 
    
    // Begin the path
    context.beginPath();
    
    // Draw the lines for the along height of the canvas to show up as a dashed line/Net
    for(var i = 0; i <= canvas.height; i += 20) {
        context.moveTo(startX, i);
        context.lineTo(endX, i + 10);
        context.strokeStyle = LINE_COLOR;
        context.stroke();
    }
}

// Reset ball position to center of screen
function ballReset() {
    // If either of the player reaches the WIN_SCORE, game over
    if(player1Score >= WIN_SCORE || player2Score >= WIN_SCORE) {
        gameOver = true;
        startGame = false;
        
        // Lambda Expression for IF-ELSE
        // Set the winningPlayer based the top score
        player1Score == WIN_SCORE ? winningPlayer = player1 : winningPlayer = player2;
    }
    
    // Reset the ball position and speed
    speedX = -speedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

// Gets the mouse position for every move event
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left  - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    
    return {
        x: mouseX,
        y: mouseY
    }
}