import torch
import numpy as np
from stable_baselines3 import DQN
from honeypot_env import HoneypotEnv

# Load trained DQN model
MODEL_PATH = "models/DQN_honeypot_model.zip"
env = HoneypotEnv()
model = DQN.load(MODEL_PATH)

def predict_attack(attack_type: str):
    """Predicts the best deceptive response using RL model."""
    attack_mapping = {"SQL Injection": 0, "XSS": 1, "RCE": 2}
    
    if attack_type not in attack_mapping:
        return "Unknown attack type"
    
    obs = np.array([attack_mapping[attack_type]])  # Convert attack to RL format
    action, _states = model.predict(obs, deterministic=True)  # Predict response
    
    action = int(action)  # Convert NumPy array to integer

    deceptive_responses = {
        0: "Error 1054: Unknown column",
        1: "Invalid input detected, script blocked",
        2: "Permission denied: Cannot execute"
    }
    
    return deceptive_responses.get(action, "Invalid response")
