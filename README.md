
---

## Let's see it (The Screenshot)

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
