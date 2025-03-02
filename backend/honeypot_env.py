import gym
from gym import spaces
import numpy as np

class HoneypotEnv(gym.Env):
    def __init__(self):
        super(HoneypotEnv, self).__init__()
        
        # Define action space: AI chooses a deceptive response (0, 1, 2)
        self.action_space = spaces.Discrete(3)
        
        # Define observation space: Attack types (SQL Injection, XSS, RCE)
        self.observation_space = spaces.Discrete(3)
        
        # Attack types
        self.attacks = ["SQL Injection", "XSS", "RCE"]
        
        # Deceptive responses
        self.responses = {
            0: "Error 1054: Unknown column",
            1: "Invalid input detected, script blocked",
            2: "Permission denied: Cannot execute"
        }

        # Reward system
        self.attack_counter = 0
        
    def reset(self):
        """Resets environment for new episode."""
        self.attack_counter = np.random.choice([0, 1, 2])  # Random attack type
        return self.attack_counter
    
    def step(self, action):
        """Performs an action and returns the next state, reward, done flag."""
        
        # Reward function: AI gets +1 if response is misleading, -1 if detected
        if action == self.attack_counter:
            reward = -1  # AI failed (attacker detected deception)
        else:
            reward = 1  # AI successfully deceived attacker
        
        # New state (random next attack)
        next_state = np.random.choice([0, 1, 2])
        done = False  # Infinite training episodes
        
        return next_state, reward, done, {}
    
    def render(self):
        """(Optional) Display environment status."""
        print(f"Current Attack: {self.attacks[self.attack_counter]}")
