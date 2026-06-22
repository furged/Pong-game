const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu-overlay');
const settingsMenu = document.getElementById('settings-overlay');
const wrapper = document.getElementById('gameWrapper');

let settings = { colorA: '#00f3ff', colorB: '#ff0040', colorBall: '#ffffff', colorBg: '#000000', colorBorder: '#ff0040' };

let scoreA = 0, scoreB = 0, WIN_SCORE = 5;
let gameActive = false, gamePaused = false, isAI = false;
let paddleWidth = 20, paddleHeight = 100;
const PADDLE_A_X = 50, PADDLE_B_X = 750;
let paddleAY = 0, paddleBY = 0;
let ballX = 400, ballY = 300, ballRadius = 10;
let ballDX = 7, ballDY = 7;
let baseSpeed = 7, maxSpeed = 18;
let wPressed = false, sPressed = false, upPressed = false, downPressed = false;
let PLAYER_SPEED = 8;

let mlModel = null;
let modelLoaded = false;
const MAX_INPUTS = [800, 600, 18, 18, 250];

let gameplayData = [];
let frameCount = 0;
let currentAction = 'STAY';
let gamesPlayed = 0;
let currentRally = 0;
let totalRallies = 0;
let longestRally = 0;
let winCount = 0;

async function loadModel() {
    try {
        // 1. Explicitly initialize the WebGL backend (GPU)
        await tf.setBackend('webgl');
        console.log("WebGL backend initialized successfully.");
    } catch (webglError) {
        // 2. If WebGL fails, gracefully fall back to CPU
        console.warn("WebGL failed to initialize. Falling back to CPU backend.", webglError);
        try {
            await tf.setBackend('cpu');
            console.log("CPU backend initialized successfully.");
        } catch (cpuError) {
            // 3. If even CPU fails, the device is completely broken
            console.error("Critical error: Neither WebGL nor CPU backend could be initialized.", cpuError);
            document.getElementById('model-status').innerText = '● ENGINE FAILED';
            document.getElementById('model-status').style.color = '#ff0040';
            return; // Stop execution so the game doesn't freeze
        }
    }

    // 4. Now that the engine is alive, load the model (Graph Model)
    try {
        const modelUrl = window.location.origin + '/web_model/model.json';        
        mlModel = await tf.loadLayersModel(modelUrl);
        modelLoaded = true;
        
        document.getElementById('model-status').innerText = '● MODEL ACTIVE';
        document.getElementById('model-status').style.color = '#00ff00';
        console.log("AI Model loaded successfully!");
    } catch (error) {
        document.getElementById('model-status').innerText = '● MODEL LOAD FAILED';
        document.getElementById('model-status').style.color = '#ff0040';
        console.error("Model load error:", error);
    }
}

function recordFrame() {
    if (!gameActive || gamePaused || !isAI) return;
    if (upPressed) currentAction = 'UP';
    else if (downPressed) currentAction = 'DOWN';
    else currentAction = 'STAY';

    gameplayData.push({
        ball_x: Math.round(ballX), ball_y: Math.round(ballY),
        ball_dx: Math.round(ballDX), ball_dy: Math.round(ballDY),
        paddle_y: Math.round(paddleBY), action: currentAction
    });
    frameCount++;
    document.getElementById('frames-processed').innerText = frameCount;
}

function exportCSV() {
    if (gameplayData.length === 0) { alert("No data collected yet!"); return; }
    let csv = "ball_x,ball_y,ball_dx,ball_dy,paddle_y,action\n";
    gameplayData.forEach(row => { csv += `${row.ball_x},${row.ball_y},${row.ball_dx},${row.ball_dy},${row.paddle_y},${row.action}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pong_training_data.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Exported ${gameplayData.length} frames!`);
}

// --- HONEST NN VISUALIZATION (NO FAKE HIDDEN LAYER) ---
const nnCanvas = document.getElementById('nnViz');
const nnCtx = nnCanvas.getContext('2d');

function drawNNViz(inputs, outputs) {
    const w = nnCanvas.width, h = nnCanvas.height;
    nnCtx.fillStyle = '#050508'; nnCtx.fillRect(0, 0, w, h);
    
    const inputCount = 5;
    const outputCount = 3;
    const layerPos = [50, 270];
    const neuronRadius = 8;

    // Connect Input -> Output
    for (let i = 0; i < inputCount; i++) {
        for (let j = 0; j < outputCount; j++) {
            let x1 = layerPos[0], y1 = (h / (inputCount + 1)) * (i + 1);
            let x2 = layerPos[1], y2 = (h / (outputCount + 1)) * (j + 1);
            nnCtx.beginPath(); nnCtx.moveTo(x1, y1); nnCtx.lineTo(x2, y2);
            // Real alpha based on input and output activations
            let alpha = (inputs[i] * outputs[j]) * 0.8 + 0.1;
            nnCtx.strokeStyle = `rgba(0, 243, 255, ${Math.min(1, Math.max(0.05, alpha))})`;
            nnCtx.lineWidth = 1.5; nnCtx.stroke();
        }
    }

    // Draw Input Layer (Real: Ball X, Y, dX, dY, Paddle Y)
    for (let i = 0; i < inputCount; i++) {
        let x = layerPos[0], y = (h / (inputCount + 1)) * (i + 1);
        let val = inputs[i];
        let glow = Math.max(2, val * 15);
        let gradient = nnCtx.createRadialGradient(x, y, 0, x, y, neuronRadius + glow);
        gradient.addColorStop(0, `rgba(0, 243, 255, ${val * 0.9 + 0.1})`);
        gradient.addColorStop(1, `rgba(0, 243, 255, 0)`);
        nnCtx.beginPath(); nnCtx.arc(x, y, neuronRadius + glow, 0, Math.PI * 2);
        nnCtx.fillStyle = gradient; nnCtx.fill();
        nnCtx.beginPath(); nnCtx.arc(x, y, neuronRadius, 0, Math.PI * 2);
        nnCtx.fillStyle = val > 0.5 ? '#ffffff' : '#334';
        nnCtx.fill();
    }

    // Draw Output Layer (Real: UP, DOWN, STAY Probabilities)
    for (let j = 0; j < outputCount; j++) {
        let x = layerPos[1], y = (h / (outputCount + 1)) * (j + 1);
        let val = outputs[j];
        let glow = Math.max(2, val * 15);
        let gradient = nnCtx.createRadialGradient(x, y, 0, x, y, neuronRadius + glow);
        gradient.addColorStop(0, `rgba(255, 0, 64, ${val * 0.9 + 0.1})`);
        gradient.addColorStop(1, `rgba(255, 0, 64, 0)`);
        nnCtx.beginPath(); nnCtx.arc(x, y, neuronRadius + glow, 0, Math.PI * 2);
        nnCtx.fillStyle = gradient; nnCtx.fill();
        nnCtx.beginPath(); nnCtx.arc(x, y, neuronRadius, 0, Math.PI * 2);
        nnCtx.fillStyle = val > 0.5 ? '#ffffff' : '#334';
        nnCtx.fill();
    }

    let up = outputs[0], down = outputs[1], stay = outputs[2];
    document.getElementById('conf-up').style.width = `${up * 100}%`;
    document.getElementById('conf-down').style.width = `${down * 100}%`;
    document.getElementById('conf-stay').style.width = `${stay * 100}%`;
}

function draw() {
    ctx.fillStyle = settings.colorBg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333'; ctx.setLineDash([10, 15]); ctx.beginPath(); ctx.moveTo(400, 0); ctx.lineTo(400, 600); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = settings.colorA; ctx.shadowColor = settings.colorA; ctx.shadowBlur = 10;
    ctx.fillRect(PADDLE_A_X - paddleWidth/2, 300 + paddleAY - paddleHeight/2, paddleWidth, paddleHeight);
    ctx.fillStyle = settings.colorB; ctx.shadowColor = settings.colorB; ctx.shadowBlur = 10;
    ctx.fillRect(PADDLE_B_X - paddleWidth/2, 300 + paddleBY - paddleHeight/2, paddleWidth, paddleHeight); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = settings.colorBall; ctx.shadowColor = settings.colorBall; ctx.shadowBlur = 20; ctx.fill(); ctx.closePath(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'white'; ctx.font = '20px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    
    // FIXED LABELS: P1/P2 for Multiplayer, BOT/YOU for AI
    if (isAI) {
        ctx.fillText(`BOT: ${scoreA}`, 200, 50);
        ctx.fillText(`YOU: ${scoreB}`, 600, 50);
    } else {
        ctx.fillText(`P1: ${scoreA}`, 200, 50);
        ctx.fillText(`P2: ${scoreB}`, 600, 50);
    }
    ctx.font = '10px "JetBrains Mono", monospace'; ctx.fillStyle = '#666';
    ctx.fillText("↑/↓ (You) | P: Pause | R: Restart | M: Menu", 400, 580);
    
    if (gamePaused) { ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = 'white'; ctx.font = '36px "JetBrains Mono", monospace'; ctx.fillText("PAUSED", 400, 300); }
    if (!gameActive && !gamePaused && menu.style.display === 'none') { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#ff0040'; ctx.font = '36px "JetBrains Mono", monospace'; let winner = scoreA >= WIN_SCORE ? 'P1 WINS!' : 'P2 WIN!'; ctx.fillText(winner, 400, 300); }
}

function resetBallSpeed() {
    let angle = (Math.random() * 0.5) - 0.25;
    // FIXED 90-DEGREE LAUNCH: Prevent angle from being exactly 0
    while (Math.abs(angle) < 0.1) {
        angle = (Math.random() * 0.5) - 0.25;
    }
    let speed = baseSpeed;
    ballDX = speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
    ballDY = speed * Math.sin(angle);
    // Guarantee vertical movement so it never runs horizontally forever
    if (Math.abs(ballDY) < 1.5) {
        ballDY = (ballDY > 0 ? 1 : -1) * 1.5;
    }
}

function resetGame() {
    scoreA = 0; scoreB = 0; paddleAY = 0; paddleBY = 0; ballX = 400; ballY = 300;
    resetBallSpeed(); gameActive = true; gamePaused = false;
}

// NEW: Accurate Game End Handler
function handleGameEnd() {
    gamesPlayed++;
    if (scoreB >= WIN_SCORE) winCount++; // Only count a win if YOU (P2) won
    document.getElementById('games-played').innerText = gamesPlayed;
    document.getElementById('win-rate').innerText = Math.round((winCount/gamesPlayed)*100) + '%';
    updateRallyStats();
}

function goToMainMenu() { gameActive = false; menu.style.display = 'flex'; }

function startGame(mode) { menu.style.display = 'none'; isAI = (mode === 'single'); resetGame(); }

function update() {
    if (!gameActive || gamePaused) return;
    let mag = Math.sqrt(ballDX*ballDX + ballDY*ballDY);
    let paddleA_abs_y = 300 + paddleAY;

    if (isAI && modelLoaded) {
        let mirroredX = 800 - ballX;
        let inputs = [mirroredX/MAX_INPUTS[0], ballY/MAX_INPUTS[1], 
                      -ballDX/MAX_INPUTS[2], ballDY/MAX_INPUTS[3], 
                      paddleAY/MAX_INPUTS[4]];
        let inputTensor = tf.tensor2d([inputs]);
        let outputTensor = mlModel.predict(inputTensor);
        let probs = outputTensor.dataSync();
        inputTensor.dispose();
        outputTensor.dispose();

        let maxProb = Math.max(probs[0], probs[1], probs[2]);
        let actionIdx = probs.indexOf(maxProb);
        let actions = ['UP', 'DOWN', 'STAY'];
        let predictedAction = actions[actionIdx];
        document.getElementById('current-action').innerText = predictedAction;

        if (predictedAction === 'UP') paddleAY = Math.max(-250, paddleAY - 6);
        else if (predictedAction === 'DOWN') paddleAY = Math.min(250, paddleAY + 6);

        drawNNViz(inputs, probs);

    } else if (isAI && !modelLoaded) {
        let currentAISpeed = Math.min(9, 2 + mag * 0.5);
        let targetY = ballY + (Math.random() - 0.5) * 20;
        let diffY = targetY - paddleA_abs_y;
        if (diffY > 10) paddleAY = Math.min(250, paddleAY + currentAISpeed);
        else if (diffY < -10) paddleAY = Math.max(-250, paddleAY - currentAISpeed);
    } else if (!isAI) {
        // --- FIXED MULTIPLAYER CONTROLS (W/S for P1, Arrows for P2) ---
        if (wPressed) paddleAY = Math.max(-250, paddleAY - PLAYER_SPEED);
        if (sPressed) paddleAY = Math.min(250, paddleAY + PLAYER_SPEED);
    }

    // Player 2 / You (Always controlled by Arrows)
    if (upPressed) paddleBY = Math.max(-250, paddleBY - PLAYER_SPEED);
    if (downPressed) paddleBY = Math.min(250, paddleBY + PLAYER_SPEED);

    ballX += ballDX; ballY += ballDY;
    if (ballY + ballRadius > 590) { ballY = 590 - ballRadius; ballDY *= -1; }
    if (ballY - ballRadius < 10) { ballY = 10 + ballRadius; ballDY *= -1; }
    
    let paddleB_abs_y = 300 + paddleBY;
    if (ballX - ballRadius < PADDLE_A_X + paddleWidth/2 && ballX + ballRadius > PADDLE_A_X - paddleWidth/2 && ballY > paddleA_abs_y - paddleHeight/2 && ballY < paddleA_abs_y + paddleHeight/2) {
        ballX = PADDLE_A_X + paddleWidth/2 + ballRadius; ballDX *= -1; increaseSpeed(); currentRally++;
    }
    if (ballX + ballRadius > PADDLE_B_X - paddleWidth/2 && ballX - ballRadius < PADDLE_B_X + paddleWidth/2 && ballY > paddleB_abs_y - paddleHeight/2 && ballY < paddleB_abs_y + paddleHeight/2) {
        ballX = PADDLE_B_X - paddleWidth/2 - ballRadius; ballDX *= -1; increaseSpeed(); currentRally++;
    }
    if (ballX > 790) { scoreA++; resetRound(); if (scoreA >= WIN_SCORE) { gameActive = false; handleGameEnd(); } }
    if (ballX < 10) { scoreB++; resetRound(); if (scoreB >= WIN_SCORE) { gameActive = false; handleGameEnd(); } }
    
    recordFrame();
}

function updateRallyStats() {
    totalRallies += currentRally; 
    if (currentRally > longestRally) longestRally = currentRally;
    if (gamesPlayed > 0) {
        document.getElementById('avg-rally').innerText = Math.round(totalRallies / gamesPlayed);
    }
    currentRally = 0;
}

function increaseSpeed() { let mag = Math.sqrt(ballDX*ballDX + ballDY*ballDY); if (mag < maxSpeed) { let angle = Math.atan2(ballDY, ballDX); mag += 0.4; ballDX = Math.cos(angle) * mag; ballDY = Math.sin(angle) * mag; } }
function resetRound() { ballX = 400; ballY = 300; let mag = Math.sqrt(ballDX*ballDX + ballDY*ballDY); let ang = Math.atan2(ballDY, ballDX); ballDX = Math.cos(ang) * mag; ballDY = Math.sin(ang) * mag; }

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') wPressed = true; if (e.key === 's' || e.key === 'S') sPressed = true;
    if (e.key === 'ArrowUp') { upPressed = true; e.preventDefault(); } if (e.key === 'ArrowDown') { downPressed = true; e.preventDefault(); }
    if (e.key === 'p' || e.key === 'P') togglePauseMobile(); if (e.key === 'r' || e.key === 'R') restartMobile(); if (e.key === 'm' || e.key === 'M') menuMobile();
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W') wPressed = false; if (e.key === 's' || e.key === 'S') sPressed = false;
    if (e.key === 'ArrowUp') { upPressed = false; e.preventDefault(); } if (e.key === 'ArrowDown') { downPressed = false; e.preventDefault(); }
});

function togglePauseMobile() { if (gameActive) gamePaused = !gamePaused; }
function restartMobile() { resetGame(); gamePaused = false; }
function menuMobile() { goToMainMenu(); }

function toggleSettings() {
    if (settingsMenu.style.display === 'none') {
        menu.style.display = 'none'; settingsMenu.style.display = 'flex';
        document.getElementById('colorPaddleA').value = settings.colorA; document.getElementById('colorPaddleB').value = settings.colorB;
        document.getElementById('colorBall').value = settings.colorBall; document.getElementById('colorBg').value = settings.colorBg;
        document.getElementById('colorBorder').value = settings.colorBorder;
    } else {
        settingsMenu.style.display = 'none'; menu.style.display = 'flex';
        settings.colorA = document.getElementById('colorPaddleA').value; settings.colorB = document.getElementById('colorPaddleB').value;
        settings.colorBall = document.getElementById('colorBall').value; settings.colorBg = document.getElementById('colorBg').value;
        settings.colorBorder = document.getElementById('colorBorder').value;
        wrapper.style.borderColor = settings.colorBorder; wrapper.style.boxShadow = `0 0 20px ${settings.colorBorder}`;
    }
}

setTimeout(loadModel, 1000);
gameLoop();