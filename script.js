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
let WIN_SCORE = 5; // Default, can be changed in settings
let INFINITE_MODE = false;
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
let baseSpeed = 5;
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
let frameCount = 0;

function resetBallSpeed() {
    let angle;
    let attempts = 0;
    do {
        angle = (Math.random() * 1.2) - 0.6;
        attempts++;
    } while ((Math.abs(angle) < 0.2 || Math.abs(angle) > 0.5) && attempts < 20);
    if (Math.abs(angle) < 0.2) angle = 0.3;
    if (Math.abs(angle) > 0.5) angle = 0.4;
    
    let speed = baseSpeed;
    let direction = Math.random() > 0.5 ? 1 : -1;
    ballDX = speed * Math.cos(angle) * direction;
    ballDY = speed * Math.sin(angle);
    
    if (Math.abs(ballDY) < 1.2) {
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
    frameCount = 0;
    updateScoreDisplay();
    document.getElementById('game-status').innerText = '● PLAYING';
    document.getElementById('game-status').style.color = '#00ff00';
    document.getElementById('frame-count').innerText = `Frames: 0`;
}

function startGame(mode) {
    // Get win score from settings
    const select = document.getElementById('winScoreSelect');
    WIN_SCORE = parseInt(select.value);
    INFINITE_MODE = (WIN_SCORE === 0);
    
    // Update display
    document.getElementById('win-target').innerText = INFINITE_MODE ? 'Target: ∞' : `Target: ${WIN_SCORE}`;
    
    menu.style.display = 'none';
    settingsMenu.style.display = 'none';
    isAI = (mode === 'single');
    document.getElementById('game-mode').innerText = isAI ? 'VS BOT' : '2 PLAYER';
    
    if (isAI) {
        document.getElementById('controls-info').innerHTML = 'YOU: ↑/↓ | BOT: Left';
    } else {
        document.getElementById('controls-info').innerHTML = 'P1: W/S | P2: ↑/↓';
    }
    
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

function checkWinCondition() {
    if (INFINITE_MODE) {
        // Never end in infinite mode - just keep playing
        return false;
    }
    return (scoreA >= WIN_SCORE || scoreB >= WIN_SCORE);
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
    
    gameActive = false;
    document.getElementById('game-status').innerText = `● GAME OVER`;
    document.getElementById('game-status').style.color = '#ff0040';
}

function update() {
    if (!gameActive || gamePaused) return;
    
    frameCount++;
    document.getElementById('frame-count').innerText = `Frames: ${frameCount}`;
    
    if (isAI) {
        let targetY = ballY + (Math.random() - 0.5) * 40;
        let diffY = targetY - (300 + paddleAY);
        let aiSpeed = Math.min(5, Math.abs(diffY) * 0.1 + 1.5);
        
        if (diffY > 8) {
            paddleAY = Math.min(250, paddleAY + aiSpeed);
        } else if (diffY < -8) {
            paddleAY = Math.max(-250, paddleAY - aiSpeed);
        }
        
        if (upPressed) paddleBY = Math.max(-250, paddleBY - PLAYER_SPEED);
        if (downPressed) paddleBY = Math.min(250, paddleBY + PLAYER_SPEED);
        
    } else {
        if (wPressed) paddleAY = Math.max(-250, paddleAY - PLAYER_SPEED);
        if (sPressed) paddleAY = Math.min(250, paddleAY + PLAYER_SPEED);
        if (upPressed) paddleBY = Math.max(-250, paddleBY - PLAYER_SPEED);
        if (downPressed) paddleBY = Math.min(250, paddleBY + PLAYER_SPEED);
    }
    
    ballX += ballDX;
    ballY += ballDY;
    
    if (ballY + BALL_RADIUS > 590) {
        ballY = 590 - BALL_RADIUS;
        ballDY *= -1;
    }
    if (ballY - BALL_RADIUS < 10) {
        ballY = 10 + BALL_RADIUS;
        ballDY *= -1;
    }
    
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
    
    if (ballX > 790) {
        scoreA++;
        updateScoreDisplay();
        resetRound();
        if (checkWinCondition()) {
            handleGameEnd();
        }
    }
    if (ballX < 10) {
        scoreB++;
        updateScoreDisplay();
        resetRound();
        if (checkWinCondition()) {
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
    
    let angle = Math.atan2(ballDY, ballDX);
    let direction = ballDX > 0 ? -1 : 1;
    let speed = baseSpeed;
    
    angle += (Math.random() - 0.5) * 0.4;
    
    if (Math.abs(angle) < 0.15) angle = (angle > 0 ? 1 : -1) * 0.25;
    
    ballDX = Math.cos(angle) * speed * direction;
    ballDY = Math.sin(angle) * speed;
    
    if (Math.abs(ballDY) < 1.2) {
        ballDY = (ballDY > 0 ? 1 : -1) * 1.5;
    }
}

function draw() {
    ctx.fillStyle = settings.colorBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.arc(400, 300, 60, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();
    
    ctx.fillStyle = settings.colorA;
    ctx.shadowColor = settings.colorA;
    ctx.shadowBlur = 15;
    ctx.fillRect(PADDLE_A_X - PADDLE_W/2, 300 + paddleAY - PADDLE_H/2, PADDLE_W, PADDLE_H);
    
    ctx.fillStyle = settings.colorB;
    ctx.shadowColor = settings.colorB;
    ctx.shadowBlur = 15;
    ctx.fillRect(PADDLE_B_X - PADDLE_W/2, 300 + paddleBY - PADDLE_H/2, PADDLE_W, PADDLE_H);
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = settings.colorBall;
    ctx.shadowColor = settings.colorBall;
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '48px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    
    if (isAI) {
        ctx.fillText(scoreA, 180, 80);
        ctx.fillText(scoreB, 620, 80);
        
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText('BOT', 180, 110);
        ctx.fillText('YOU', 620, 110);
    } else {
        ctx.fillText(scoreA, 180, 80);
        ctx.fillText(scoreB, 620, 80);
        
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText('P1', 180, 110);
        ctx.fillText('P2', 620, 110);
    }
    
    // Show target score in center
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText(INFINITE_MODE ? '∞' : `TO ${WIN_SCORE}`, 400, 560);
    
    if (currentRally > 5) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillText(`RALLY: ${currentRally}`, 400, 570);
    }
    
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
    
    if (!gameActive && !gamePaused && menu.style.display === 'none') {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f3ff';
        ctx.font = '48px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        let winner;
        if (isAI) {
            winner = scoreA >= WIN_SCORE ? 'BOT WINS!' : 'YOU WIN! 🎉';
        } else {
            winner = scoreA >= WIN_SCORE ? 'P1 WINS!' : 'P2 WINS!';
        }
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
        // Set the select to current value
        const select = document.getElementById('winScoreSelect');
        if (INFINITE_MODE) {
            select.value = '0';
        } else {
            select.value = WIN_SCORE.toString();
        }
    } else {
        settingsMenu.style.display = 'none';
        menu.style.display = 'flex';
        settings.colorA = document.getElementById('colorPaddleA').value;
        settings.colorB = document.getElementById('colorPaddleB').value;
        settings.colorBall = document.getElementById('colorBall').value;
        settings.colorBg = document.getElementById('colorBg').value;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        if (!isAI) wPressed = true;
    }
    if (e.key === 's' || e.key === 'S') {
        if (!isAI) sPressed = true;
    }
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

gameLoop();