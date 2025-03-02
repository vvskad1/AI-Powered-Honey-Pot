import requests
import os
from dotenv import load_dotenv

# Load .env file explicitly
load_dotenv()

class AIDeceptionEngine:
    def __init__(self):
        """Initialize AI deception engine using Hugging Face API."""
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")
        self.api_url = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"  # ✅ Using Falcon-7B

        if not self.api_key:
            raise ValueError("❌ Hugging Face API Key Missing! Ensure `.env` is correctly loaded.")

    def generate_deceptive_response(self, attack_type: str):
        """Generates a misleading response using Hugging Face API."""
        prompt = f"You are a cybersecurity honeypot AI. A hacker attempted a {attack_type} attack. Generate a misleading but realistic system response to confuse them."

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(self.api_url, headers=headers, json={
                "inputs": prompt,
                "parameters": {"max_length": 100, "temperature": 0.7, "top_p": 0.9}
            })

            # ✅ Check if response is valid
            if response.status_code == 200:
                json_response = response.json()

                # ✅ Properly extract the generated text
                if isinstance(json_response, list) and "generated_text" in json_response[0]:
                    generated_text = json_response[0]["generated_text"].strip()

                    # ✅ Remove the prompt from response (if included)
                    if generated_text.startswith(prompt):
                        generated_text = generated_text[len(prompt):].strip()

                    return generated_text

                else:
                    return "❌ AI generated an unexpected response format."

            else:
                return f"AI Deception Error: {response.status_code} - {response.text}"

        except Exception as e:
            print(f"❌ Error calling Hugging Face API: {e}")
            return f"API Request Failed: {str(e)}"

# ✅ Initialize deception engine
ai_deception = AIDeceptionEngine()
