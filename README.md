# 🕸️ Spider-Pong: The Neural Net Fusion

A behavioral cloning experiment where a Neural Network gets bitten by a radioactive Pong ball, learns everything you do, and fights you in the arena.

This is not a game. This is a multiverse training ground for AI agents.


## 🛠️ The Arsenal

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0+-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![TF.js](https://img.shields.io/badge/TF.js-4.22+-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Prototype-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

> 🕷️ **Web-Slinger Note:** The live deployment is currently glitching due to a TensorFlow.js symbiote bug. The AI refuses to wake up on Vercel. But run it locally — and the web-slinging begins instantly.

---

## 🧬 The Origin Story

You play Pong. The game watches. Every frame, it writes down a diary:  
*"Ball at X, moving Y, paddle at Z… Human pressed UP."*

That diary becomes data. The data becomes a Neural Network.  
The Neural Network becomes your opponent — a perfect clone of your playstyle.

It’s a Spider-Verse crossover between **Classic Gaming** and **Behavioral Cloning**.

---

## ⚡ Superpowers

- **Spider-Sense AI:** The opponent paddle is driven by a neural network that mimics your own reflexes.
- **Local Co-op Mode:** 2-player brawls. Player 1: W/S. Player 2: Arrow Keys.
- **The Data Webbing:** Every match generates a CSV file. Hit Export, and you hold the raw training data in your hands.
- **Live Brain Scan:** Watch the model's confidence, current action, and win rate update in real-time on the AI Dashboard.
- **Neural Web Visualizer:** See the input nodes (Ball X, Y, Velocity) physically *webbing* into the output decisions (UP / DOWN / STAY).
- **Unlimited Suit Colors:** Change every color in the game. Paddles, ball, background, neon glow — customize the lab.

---

## 🧪 The Fusion Pipeline

1. **You train the clone.** The browser logs `ball_x`, `ball_y`, `ball_dx`, `ball_dy`, `paddle_y`, and your `action` into a CSV.
2. **The lab runs the math.** Google Colab takes the CSV and trains a Multi-Layer Perceptron (MLP) neural network using TensorFlow and Keras.
3. **The symbiote jumps to the web.** The trained model converts to TensorFlow.js and deploys via Vercel.
4. **The AI awakens.** The model reads live game state and decides: UP, DOWN, or STAY.

---

## 🖼️ The Multiverse Screenshot

![Spider-Pong Screenshot](Screenshot.png)

---

## 🏃 How To Enter The Arena

1. Clone:
   `git clone https://github.com/furged/Pong-game.git`
2. Double-click `index.html`.
3. Choose **Play vs AI** or **Multiplayer**.

*Pro tip: Running locally bypasses the Vercel web-glitch. The AI will spawn instantly.*

---

## 🧠 What The Lab Taught Me

- Building a full data pipeline: browser → CSV → Colab → TF.js.
- Training an MLP neural net using Keras.
- Converting Python models to browser-ready TensorFlow.js.
- Fighting real-world deployment bugs: CORS, WebGL failures, and caching goblins.

---

## 🩹 Known Symbiote Glitch

The live Vercel deployment throws a GraphModel / LayersModel parsing error. It’s a known TensorFlow.js quirk. I’m working on fixing the web-swing. For now, run it locally.

---

## 🔮 Next Mutation

- Switch from GraphModel to LayersModel for proper deployment.
- Add Q-Learning / DQN (true Reinforcement Learning).
- Real-time accuracy tracking.
- Pit "Human Trained" vs "RL Trained" opponents.

---

## 🕸️ Author

A Machine Learning multiverse project by [furged](https://github.com/furged).
