# AI Pong Lab

An interactive Machine Learning playground where users play Pong against a Neural Network trained on human gameplay data.

Built as a Machine Learning engineering portfolio project.

---

## Features

- Play vs AI: Compete against a Neural Network trained on real human gameplay.
- Local Multiplayer: 2-player mode (Player 1: W/S, Player 2: Arrow Keys).
- Data Collection System: While you play, the game records your decisions. Click Export Data (CSV) to download the dataset for further ML training.
- Live AI Dashboard: See what the Neural Network is thinking in real-time (Current Action, Confidence Bars, Win Rate, Games Played).
- Neural Network Visualization: Watch inputs (Ball X, Y, Velocity) connect to outputs (UP, DOWN, STAY) with live activation lines.
- Customizable UI: Change paddle colors, ball color, background, and neon border color through the Settings menu.

---

## The Machine Learning Pipeline

This project demonstrates the full ML lifecycle:

1. Data Collection: A human plays Pong. The browser collects ball_x, ball_y, ball_dx, ball_dy, paddle_y, and the action taken (UP/DOWN/STAY) into a CSV file.
2. Training: The CSV is fed into a Python script using TensorFlow / Keras to train a Multi-Layer Perceptron (MLP) Neural Network that mimics human decision-making.
3. Deployment: The trained model is converted to TensorFlow.js format and loaded directly into the browser.
4. Inference: When you play, the game state is passed through the Neural Network in real-time to control the AI paddle.

---

## Built With

| Technology | Description |
| :--- | :--- |
| HTML5, CSS3, JavaScript | Frontend UI and game engine |
| HTML5 Canvas | 2D rendering for the Pong arena |
| TensorFlow.js | Browser-based AI inference engine |
| Python, TensorFlow, Keras | Training the neural network in Google Colab |
| Vercel | Live deployment and hosting |

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

## Preview

![AI Pong Lab Screenshot](link-to-your-screenshot-here)

---

## Getting Started (Run Locally)

1. Clone the repository:

    git clone https://github.com/furged/Pong-game.git

2. Open the folder and double-click `index.html` to launch the game in your browser.

3. Choose Play vs AI or Multiplayer from the main menu.

*Note: The AI model loads best in a modern browser with hardware acceleration enabled.*

---

## What I Learned

- Extracting structured gameplay data (CSV) from a live browser game.
- Training a Neural Network (MLP) using Keras and Google Colab.
- Exporting models to TensorFlow.js and deploying them to the web.
- Debugging real-world issues like CORS, WebGL failures, and deployment path mismatches.

---

## Future Improvements

- Switch from GraphModel to LayersModel for easier browser compatibility.
- Add Q-Learning / Reinforcement Learning agent.
- Integrate real-time accuracy tracking for the AI.
- Add a Play Against Human version and compare statistics.

---

## Author

Built as a Machine Learning engineering portfolio project.

GitHub: [furged](https://github.com/furged)
