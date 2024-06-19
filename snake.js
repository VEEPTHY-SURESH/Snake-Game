const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // size of each square
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box }; // initial position of the snake
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
};
let score = 0;
let d;

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Function to draw a striped circle
    function drawStripedCircle(x, y, radius, fillColor, strokeColor, stripeColor) {
        // Draw the circle
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    
        // Draw the stripes
        ctx.strokeStyle = stripeColor;
        ctx.lineWidth = 2;
        let numberOfStripes = 4;
        for (let i = 1; i < numberOfStripes; i++) {
            let angle = (Math.PI * 2 / numberOfStripes) * i;
            ctx.beginPath();
            ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
            ctx.lineTo(x - radius * Math.cos(angle), y - radius * Math.sin(angle));
            ctx.stroke();
        }
    }
    
    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        let fillColor = (i == 0) ? "gold" : "red";
        let stripeColor = "black";
        drawStripedCircle(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, fillColor, "gold", stripeColor);
    }
    
    // Draw the food
    drawStripedCircle(food.x + box / 2, food.y + box / 2, box / 2, "green", "gold", "rgb(162, 160, 160)");
    
    // Draw the score
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}


document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        d = "UP";
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (key == 40 && d != "UP") {
        d = "DOWN";
    }
}

function updateSnakePosition() {
    // Get the head position of the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // Update the position based on the direction
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;
    
    // Check if the snake has eaten the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        };
    } else {
        // Remove the tail
        snake.pop();
    }
    
    // Add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    };
    
    // Game over conditions
    if (snakeX < 0*box || snakeY < 0 * box || snakeX > 19 * box || snakeY > 19 * box || collision(newHead, snake)) {
        newHead  =  actOnCollision();
        // Here you can call a function to handle game over
    }
    
    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}
function  actOnCollision() {
	d  =  "STOP";
	snake  = [];
	score  =  0;
	return { x:  9  *  box, y:  10  *  box };
}

function  game() {
	setTimeout(function  onTick(){
		draw();
		updateSnakePosition();
		game();
	},150);
}
game();

if (!localStorage.getItem('leaderboard')) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}
let  leaderboard  =  JSON.parse(localStorage.getItem('leaderboard'));

function  updateLeaderboard(score,name) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: name, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    
    if (leaderboard[0].name === name) {
        alert("Congratulations "+name+"! You are the new leader with a score of " + score + "!");
    } else { 
        alert("Your score is " + score + ". Better luck next time!");
    }
    
    if (leaderboard.length > 10) {
        leaderboard.pop();
    }
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
}

    function displayLeaderboard() {
        // Retrieve the high scores from local storage
        let leaderboard  =  JSON.parse(localStorage.getItem('leaderboard'));
        
        // Get the leaderboard element
        let  leaderboardElement  =  document.getElementById('leaderboard-body');
        
        // Clear existing list items
        leaderboardElement.innerHTML = '';
        
        // Create a list item for each high score and append it to the list
        leaderboard.forEach((entry,index) => {
            let  row  =  document.createElement('tr');
            row.innerHTML  =  `<td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td>`;
            leaderboardElement.appendChild(row);
        });
    }

    function  onGameOver(score) {
        playerName  =  prompt("Game Over! Enter your name:");
        if(!playerName){
            playerName = "Unknown";
        }
        updateLeaderboard(score, playerName);
        displayLeaderboard();
    }
    function  actOnCollision() {
        d  =  "STOP";
        snake  = [];
        onGameOver(score)
        score  =  0;
        return { x:  9  *  box, y:  10  *  box };
    }
        // Call displayHighScores when the window loads
        window.onload = function() {
            displayLeaderboard();
        };