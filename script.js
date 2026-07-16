// PONG - Pure Classic Pong

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu-overlay');
const settingsMenu = document.getElementById('settings-overlay');
const wrapper = document.getElementById('gameWrapper');

let settings = { 
    colorA: '#00f3ff', 
    colorB: '#ff0040', 
    colorBall: '#ffffff', 
    colorBg: '#000000' 
};

// Game state
let scoreA = 0, scoreB = 0;
const WIN_SCORE = 5;
let gameActive = false;
let gamePaused = false;
let isAI = false;

// Paddles
const PADDLE_W = 12;
const PADDLE_H = 100;
const PADDLE_A_X = 50;
const PADDLE_B_X = 750;
let paddleAY = 0;
let paddleBY = 0;
const PLAYER_SPEED = 7;

// Ball
let ballX = 400;
let ballY = 300;
const BALL_RADIUS = 10;
let ballDX = 6;
let ballDY = 6;
let baseSpeed = 6;
let maxSpeed = 16;

// Input
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// Stats
let gamesPlayed = 0;
let currentRally = 0;
let longestRally = 0;
let totalRallies = 0;

function resetBallSpeed() {
    let angle = (Math.random() * 1.2) - 0.6;
    while (Math.abs(angle) < 0.15) {
        angle = (Math.random() * 1.2) - 0.6;
    }
    let speed = baseSpeed;
    let direction = Math.random() > 0.5 ? 1 : -1;
    ballDX = speed * Math.cos(angle) * direction;
    ballDY = speed * Math.sin(angle);
    if (Math.abs(ballDY) < 1.5) {
        ballDY = (ballDY > 0 ? 1 : -1) * 1.5;
    }
}

function resetGame() {
    scoreA = 0;
    scoreB = 0;
    paddleAY = 0;
    paddleBY = 0;
    ballX = 400;
    ballY = 300;
    resetBallSpeed();
    gameActive = true;
    gamePaused = false;
    currentRally = 0;
    updateScoreDisplay();
    document.getElementById('game-status').innerText = '● PLAYING';
    document.getElementById('game-status').style.color = '#00ff00';
}

function startGame(mode) {
    menu.style.display = 'none';
    settingsMenu.style.display = 'none';
    isAI = (mode === 'single');
    document.getElementById('game-mode').innerText = isAI ? 'VS BOT' : '2 PLAYER';
    document.getElementById('controls-info').innerText = isAI ? 'P1: W/S | BOT' : 'P1: W/S | P2: ↑/↓';
    resetGame();
    document.getElementById('game-status').innerText = '● PLAYING';
}

function goToMainMenu() {
    gameActive = false;
    menu.style.display = 'flex';
    document.getElementById('game-status').innerText = '● MENU';
    document.getElementById('game-status').style.color = '#ffaa00';
}

function updateScoreDisplay() {
    document.getElementById('score-display').innerText = `P1: ${scoreA} | P2: ${scoreB}`;
}

function handleGameEnd() {
    gamesPlayed++;
    document.getElementById('games-played').innerText = gamesPlayed;
    
    if (currentRally > longestRally) {
        longestRally = currentRally;
        document.getElementById('longest-rally').innerText = longestRally;
    }
    
    totalRallies += currentRally;
    currentRally = 0;
    
    document.getElementById('game-status').innerText = `● GAME OVER`;
    document.getElementById('game-status').style.color = '#ff0040';
}

function update() {
    if (!gameActive || gamePaused) return;
    
    // P1 Controls (W/S)
    if (wPressed) paddleAY = Math.max(-250, paddleAY - PLAYER_SPEED);
    if (sPressed) paddleAY = Math.min(250, paddleAY + PLAYER_SPEED);
    
    // P2 / Bot Controls
    if (isAI) {
        // Simple AI that follows the ball with slight imperfection
        let targetY = ballY + (Math.random() - 0.5) * 30;
        let diffY = targetY - (300 + paddleBY);
        let aiSpeed = Math.min(6, Math.abs(diffY) * 0.12 + 2);
        
        if (diffY > 8) {
            paddleBY = Math.min(250, paddleBY + aiSpeed);
        } else if (diffY < -8) {
            paddleBY = Math.max(-250, paddleBY - aiSpeed);
        }
    } else {
        // P2 Controls (Arrow keys)
        if (upPressed) paddleBY = Math.max(-250, paddleBY - PLAYER_SPEED);
        if (downPressed) paddleBY = Math.min(250, paddleBY + PLAYER_SPEED);
    }
    
    // Move ball
    ballX += ballDX;
    ballY += ballDY;
    
    // Wall collisions (top/bottom)
    if (ballY + BALL_RADIUS > 590) {
        ballY = 590 - BALL_RADIUS;
        ballDY *= -1;
    }
    if (ballY - BALL_RADIUS < 10) {
        ballY = 10 + BALL_RADIUS;
        ballDY *= -1;
    }
    
    // Paddle A collision (left)
    let paddleA_abs_y = 300 + paddleAY;
    if (ballX - BALL_RADIUS < PADDLE_A_X + PADDLE_W/2 && 
        ballX + BALL_RADIUS > PADDLE_A_X - PADDLE_W/2 &&
        ballY > paddleA_abs_y - PADDLE_H/2 && 
        ballY < paddleA_abs_y + PADDLE_H/2) {
        ballX = PADDLE_A_X + PADDLE_W/2 + BALL_RADIUS;
        ballDX = Math.abs(ballDX);
        increaseSpeed();
        currentRally++;
    }
    
    // Paddle B collision (right)
    let paddleB_abs_y = 300 + paddleBY;
    if (ballX + BALL_RADIUS > PADDLE_B_X - PADDLE_W/2 && 
        ballX - BALL_RADIUS < PADDLE_B_X + PADDLE_W/2 &&
        ballY > paddleB_abs_y - PADDLE_H/2 && 
        ballY < paddleB_abs_y + PADDLE_H/2) {
        ballX = PADDLE_B_X - PADDLE_W/2 - BALL_RADIUS;
        ballDX = -Math.abs(ballDX);
        increaseSpeed();
        currentRally++;
    }
    
    // Scoring
    if (ballX > 790) {
        scoreA++;
        updateScoreDisplay();
        resetRound();
        if (scoreA >= WIN_SCORE) {
            gameActive = false;
            handleGameEnd();
        }
    }
    if (ballX < 10) {
        scoreB++;
        updateScoreDisplay();
        resetRound();
        if (scoreB >= WIN_SCORE) {
            gameActive = false;
            handleGameEnd();
        }
    }
}

function increaseSpeed() {
    let mag = Math.sqrt(ballDX*ballDX + ballDY*ballDY);
    if (mag < maxSpeed) {
        let angle = Math.atan2(ballDY, ballDX);
        mag += 0.3;
        ballDX = Math.cos(angle) * mag;
        ballDY = Math.sin(angle) * mag;
    }
}

function resetRound() {
    ballX = 400;
    ballY = 300;
    let mag = Math.sqrt(ballDX*ballDX + ballDY*ballDY);
    let angle = Math.atan2(ballDY, ballDX);
    let direction = ballDX > 0 ? -1 : 1;
    ballDX = Math.cos(angle) * mag * direction;
    ballDY = Math.sin(angle) * mag;
}

function draw() {
    // Background
    ctx.fillStyle = settings.colorBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Center line
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Center circle
    ctx.beginPath();
    ctx.arc(400, 300, 60, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();
    
    // Paddle A
    ctx.fillStyle = settings.colorA;
    ctx.shadowColor = settings.colorA;
    ctx.shadowBlur = 15;
    ctx.fillRect(PADDLE_A_X - PADDLE_W/2, 300 + paddleAY - PADDLE_H/2, PADDLE_W, PADDLE_H);
    
    // Paddle B
    ctx.fillStyle = settings.colorB;
    ctx.shadowColor = settings.colorB;
    ctx.shadowBlur = 15;
    ctx.fillRect(PADDLE_B_X - PADDLE_W/2, 300 + paddleBY - PADDLE_H/2, PADDLE_W, PADDLE_H);
    ctx.shadowBlur = 0;
    
    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = settings.colorBall;
    ctx.shadowColor = settings.colorBall;
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
    
    // Score
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '48px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(scoreA, 180, 80);
    ctx.fillText(scoreB, 620, 80);
    
    // Labels
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText(isAI ? 'BOT' : 'P1', 180, 110);
    ctx.fillText(isAI ? 'YOU' : 'P2', 620, 110);
    
    // Rally count
    if (currentRally > 5) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillText(`RALLY: ${currentRally}`, 400, 570);
    }
    
    // Pause overlay
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '36px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', 400, 300);
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Press P to resume', 400, 350);
    }
    
    // Game over overlay
    if (!gameActive && !gamePaused && menu.style.display === 'none') {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f3ff';
        ctx.font = '48px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        let winner = scoreA >= WIN_SCORE ? 'P1 WINS!' : 'P2 WINS!';
        ctx.fillText(winner, 400, 280);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '16px "JetBrains Mono", monospace';
        ctx.fillText('Press M for menu or R to restart', 400, 340);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Toggle functions
function togglePause() {
    if (gameActive) gamePaused = !gamePaused;
}

function restartGame() {
    if (gameActive || !gameActive) {
        resetGame();
        gamePaused = false;
    }
}

function toggleSettings() {
    if (settingsMenu.style.display === 'none') {
        menu.style.display = 'none';
        settingsMenu.style.display = 'flex';
        document.getElementById('colorPaddleA').value = settings.colorA;
        document.getElementById('colorPaddleB').value = settings.colorB;
        document.getElementById('colorBall').value = settings.colorBall;
        document.getElementById('colorBg').value = settings.colorBg;
    } else {
        settingsMenu.style.display = 'none';
        menu.style.display = 'flex';
        settings.colorA = document.getElementById('colorPaddleA').value;
        settings.colorB = document.getElementById('colorPaddleB').value;
        settings.colorBall = document.getElementById('colorBall').value;
        settings.colorBg = document.getElementById('colorBg').value;
    }
}

// Keyboard events
document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') wPressed = true;
    if (e.key === 's' || e.key === 'S') sPressed = true;
    if (e.key === 'ArrowUp') {
        upPressed = true;
        e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
        downPressed = true;
        e.preventDefault();
    }
    if (e.key === 'p' || e.key === 'P') togglePause();
    if (e.key === 'r' || e.key === 'R') restartGame();
    if (e.key === 'm' || e.key === 'M') goToMainMenu();
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W') wPressed = false;
    if (e.key === 's' || e.key === 'S') sPressed = false;
    if (e.key === 'ArrowUp') {
        upPressed = false;
        e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
        downPressed = false;
        e.preventDefault();
    }
});

// Start
gameLoop();