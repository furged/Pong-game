# 🕸️ AI Pong Lab

An interactive behavioral cloning experiment where a Neural Network learns to play Pong from human gameplay data.

![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0%2B-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![TF.js](https://img.shields.io/badge/TF.js-4.22%2B-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Prototype-yellow?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> **Warning:** This is an active research prototype. The codebase is intended for experimentation, not production deployment.

---

## What is this?

You play Pong. The game records your decisions. A Neural Network learns from your data and fights you in real-time.

It's a simple demonstration of behavioral cloning — watching a human, then imitating them.

---

## Features

- **Play vs AI** – The opponent is driven by a trained Neural Network.
- **Local Multiplayer** – 2 players (W/S and Arrow Keys).
- **Data Collection** – Export every frame as a CSV for further training.
- **Live Dashboard** – See AI confidence, action, and win rate update in real-time.
- **Neural Network Visualizer** – Watch inputs (ball position, velocity) flow into outputs (UP/DOWN/STAY).
- **Customizable UI** – Change paddle, ball, and background colors.

---

## Tech Stack

- HTML5, CSS3, JavaScript (Frontend & Game Engine)
- HTML5 Canvas (2D rendering)
- TensorFlow.js (Browser-based inference)
- Python, TensorFlow, Keras (Training in Google Colab)
- Vercel (Live deployment)

---

## Screenshot

![AI Pong Lab Screenshot](Screenshot.png)

---

## Run Locally

1. Clone the repository:
   git clone https://github.com/furged/Pong-game.git

2. Open the folder and double-click `index.html`.
3. Choose **Play vs AI** or **Multiplayer**.

> **Note:** The live deployment has a known TensorFlow.js parser bug. Running locally bypasses this issue and loads the model instantly. The fix is tracked [here](https://github.com/furged/Pong-game/issues/1).

---

## Author

Built as a Machine Learning portfolio project by [furged](https://github.com/furged).
