# AI Pong Lab

A live experiment where a Neural Network learns to play Pong by watching you play.
This is not a product. It is a research prototype.

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0+-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TF.js-4.22+-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Research_Prototype-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

> ⚠️ **Disclaimer:** This is an active research prototype. The AI opponent is currently broken on the live Vercel deployment due to a notorious TensorFlow.js parsing bug. It works perfectly locally. If you open the live link and the AI doesn't move, don't panic — it's the deployment, not your brain.

---

## What even is this?

You play Pong. The game watches you. It writes down exactly what you do (position, velocity, decisions). That data is fed into a tiny Neural Network. The Neural Network learns to copy you. Then, it plays against you.

It’s a behavioral cloning experiment disguised as a retro arcade game.

---

## What does it actually do?

- **Single Player (Behavioral Clone):** The opponent paddle is driven by a trained Neural Network that mimics your past gameplay.
- **Local Multiplayer:** Classic 2-player mode. Player 1 uses W/S. Player 2 uses Arrow Keys.
- **Data Exporter:** Every game generates a CSV file containing the exact state of every frame and the player's action. You can download it and retrain the model yourself.
- **Live Dashboard:** While playing, you can watch the model's confidence levels, current action (UP/DOWN/STAY), win rate, and rally stats update in real-time.
- **Neural Network Viz:** A live visualizer shows how the inputs (Ball X, Y, Velocity) flow into the output decisions.
- **Custom Themes:** Change the colors of everything in the settings menu. Make it look like a 1980s arcade or a 2099 cyberpunk terminal.

---

## How the brain works (The ML Pipeline)

1. **You play.** The browser captures `ball_x`, `ball_y`, `ball_dx`, `ball_dy`, `paddle_y`, and your `action` (UP/DOWN/STAY) every single frame.
2. **A CSV is born.** Click the "Export Data" button.
3. **Colab does the math.** The CSV is fed into a Multi-Layer Perceptron (MLP) Neural Network built with TensorFlow/Keras.
4. **The brain moves to the browser.** The trained model is converted to TensorFlow.js and deployed via Vercel.
5. **Real-time inference.** The AI uses the live game state to decide its next move.

---

## The Toolbox

- HTML5 / CSS3 / JavaScript
- HTML5 Canvas (for 2D rendering)
- TensorFlow.js (for in-browser AI inference)
- Python / TensorFlow / Keras (for training in Google Colab)
- Vercel (for hosting this chaos)

---
Pong-game/
├── index.html # The lab interface
├── style.css # Dark mode, neon edges, research lab aesthetic
├── script.js # Game engine, ML wrapper, dashboard updates
├── web_model/ # The trained brain
│ ├── model.json
│ └── group1-shard1of1.bin
└── README.md


---

## Let's see it (Screenshot)

![AI Pong Lab Screenshot](link-to-your-screenshot-here)

Drop your screenshot into the repo and replace the link above.

---

## How to run it (Local)

1. Clone the repo:
   `git clone https://github.com/furged/Pong-game.git`
2. Double-click `index.html`.
3. Pick your mode and break the AI's ego.

(Pro tip: Running locally bypasses the Vercel caching bug. The model will load instantly.)

---

## What I actually learned

- How to extract structured CSV data from a live browser canvas.
- How to train an MLP Neural Network using Keras.
- How to convert a Python-trained model to TensorFlow.js.
- How to handle real-world deployment problems: CORS, WebGL handshake failures, and Vercel's aggressive caching.

---

## The Known Bug (Don't ignore this)

- The live Vercel build throws a `GraphModel`/`LayersModel` parsing error. It's a known TF.js quirk. The fix is in progress. For now, run it locally.

---

## What's next (If I get bored)

- Switch from GraphModel to LayersModel to fix the deployment.
- Add a Q-Learning or DQN agent (true Reinforcement Learning, not just cloning).
- Real-time accuracy tracking for the AI.
- Compare stats between "Human Trained" and "RL Trained" opponents.

---

## Author

A Machine Learning engineering portfolio project.  
GitHub: [furged](https://github.com/furged)
## The Blueprint
