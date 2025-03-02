import gym
import torch
import numpy as np
from stable_baselines3 import DQN, PPO
from honeypot_env import HoneypotEnv

# Initialize honeypot environment
env = HoneypotEnv()

# Choose RL algorithm (DQN or PPO)
MODEL_TYPE = "DQN"  # Change to "PPO" if needed

if MODEL_TYPE == "DQN":
    model = DQN("MlpPolicy", env, verbose=1, learning_rate=0.001, buffer_size=10000, batch_size=32, gamma=0.99, train_freq=4, target_update_interval=1000)
elif MODEL_TYPE == "PPO":
    model = PPO("MlpPolicy", env, verbose=1, learning_rate=0.0003, gamma=0.99, batch_size=64, n_steps=2048)
else:
    raise ValueError("Invalid MODEL_TYPE. Choose 'DQN' or 'PPO'.")

# Train the model
TIMESTEPS = 10000
print(f"Training {MODEL_TYPE} model for {TIMESTEPS} timesteps...")
model.learn(total_timesteps=TIMESTEPS)

# Save trained model
MODEL_PATH = f"models/{MODEL_TYPE}_honeypot_model.zip"
model.save(MODEL_PATH)
print(f"Model saved at {MODEL_PATH}")
