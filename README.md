# AI Pong Lab

An interactive Machine Learning playground where a Neural Network learns to play Pong from human gameplay data.
Built for portfolio demonstration — not a game, but a real-time ML research dashboard.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## Current Status

Deployment Note: The codebase is fully functional locally. The trained TensorFlow.js model is included in the repository (web_model/).

However, due to a known TensorFlow.js + Vercel caching quirk, the model currently fails to fetch on the live hosted version. The browser correctly locates the file, but a WebGL/context parser error prevents the final activation.

This is a deployment bug, not a logic or dataset issue. Running the project locally bypasses this entirely.

---

## Features

- Play vs AI: The opponent paddle is driven by a Neural Network trained on recorded human gameplay.
- Local Multiplayer: 2-player mode (Player 1: W/S, Player 2: Arrow Keys).
- Data Collection System: While you play, the game records every decision frame into a CSV. Click Export Data to download the training set.
- Live AI Dashboard: See what the model is "thinking" in real-time (Current Action, Win Rate, Games Played).
- Neural Network Visualization: Real-time visualization of how the input layer connects to the output decisions (UP / DOWN / STAY).
- Customizable UI: Change paddle, ball, and background colors via the Settings menu.

---

## The Machine Learning Pipeline

This project demonstrates the full ML lifecycle:

1. Data Collection: A human plays Pong. The browser captures ball_x, ball_y, ball_dx, ball_dy, paddle_y, and the action taken into a CSV.
2. Training: The CSV is processed in Google Colab. A Multi-Layer Perceptron (MLP) Neural Network is trained to mimic human decisions using TensorFlow / Keras.
3. Deployment: The trained model is converted to TensorFlow.js format and embedded into the browser via Vercel.
4. Inference: During gameplay, the current state passes through the Neural Network in real-time to move the AI paddle.

---

## Built With

Technology | Description
--- | ---
HTML5, CSS3, JavaScript | Frontend UI and game engine
HTML5 Canvas | 2D rendering for the Pong arena
TensorFlow.js | Browser-based AI inference engine
Python, TensorFlow, Keras | Training the neural network in Google Colab
Vercel | Live deployment and hosting

---

## Project Structure

Pong-game/
├── index.html          # Main HTML layout
├── style.css           # Dark-mode research lab UI
├── script.js           # Game engine, ML inference, and dashboard logic
├── web_model/          # Trained TensorFlow.js model files
│   ├── model.json
│   └── group1-shard1of1.bin
└── README.md

---

## Screenshot

![AI Pong Lab Screenshot](link-to-your-screenshot-here)

Upload your screenshot to GitHub and replace the link above.

---

## Getting Started (Run Locally)

1. Clone the repository:
   git clone https://github.com/furged/Pong-game.git

2. Open the folder and double-click index.html.

3. Choose Play vs AI or Multiplayer from the main menu.

Note: Running locally bypasses the Vercel caching bug. The model will load instantly.

---

## What I Learned

- Extracting structured gameplay data (CSV) from a live browser game.
- Training a Neural Network (MLP) using Keras and Google Colab.
- Converting Python-trained models to TensorFlow.js.
- Debugging real-world deployment issues: CORS, WebGL engine failures, and Vercel cache mismatches.

---

## Known Issues & Future Improvements

Known Issue:
- TensorFlow.js fails to parse the web_model on Vercel due to a GraphModel / LayersModel format mismatch and aggressive caching. Fix in progress.

Planned Improvements:
- Switch from GraphModel to LayersModel to fix browser deployment.
- Add Q-Learning / Reinforcement Learning agent.
- Integrate real-time accuracy tracking for the AI.
- Add a "Play Against Human" version and compare statistics.

---

## Author

Built as a Machine Learning engineering portfolio project.
GitHub: furged
