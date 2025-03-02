import { Container, Typography, Card, CardContent } from "@mui/material";
import Navbar from "./Navbar";

export default function About() {
  return (
    <>
      <Container maxWidth="100%" sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Card sx={{ maxWidth: '100%', p: 3, textAlign: "left" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              About This Project
            </Typography>
            <Typography variant="body1" paragraph>
              <Typography fontWeight="bold">AI-Powered Honeypot</Typography> is an advanced cybersecurity system designed to detect and deceive cyber threats dynamically. This project enhances security by simulating real-world attack scenarios and using AI-driven responses to track, analyze, and confuse attackers.
            </Typography>
            <Typography variant="h5" sx={{ mt: 3 }}>
              Features
            </Typography>
            <Typography variant="body1" paragraph>
              - <Typography fontWeight="bold">Dynamic Honeypot:</Typography> Uses Reinforcement Learning (RL) to adapt to cyber threats in real-time.
              - <Typography fontWeight="bold">Attack Simulation:</Typography> Allows users to launch simulated cyberattacks (SQL Injection, XSS, RCE) to test defenses.
              - <Typography fontWeight="bold">Deception-Based Defense:</Typography> AI generates misleading system responses to confuse attackers.
              - <Typography fontWeight="bold">Threat Intelligence Reports:</Typography> Generates forensic logs and insights for cybersecurity research.
              - <Typography fontWeight="bold">Real-Time Monitoring:</Typography> A dashboard provides live logs of attacks and responses.
            </Typography>
            <Typography variant="h5" sx={{ mt: 3 }}>
              Technology Stack
            </Typography>
            <Typography variant="body1" paragraph>
              - <Typography fontWeight="bold">Frontend:</Typography> React.js (Material UI for styling)
              - <Typography fontWeight="bold">Backend:</Typography> FastAPI/Flask (Handles AI processing and API requests)
              - <Typography fontWeight="bold">AI Engine:</Typography> Reinforcement Learning (DQN/PPO) & LLM-based deception system
              - <Typography fontWeight="bold">Database:</Typography> MongoDB/PostgreSQL for storing attack logs and system responses
              - <Typography fontWeight="bold">Deployment:</Typography> Cloud-based setup on AWS/GCP
            </Typography>
            <Typography variant="h5" sx={{ mt: 3 }}>
              How It Works
            </Typography>
            <Typography variant="body1" paragraph>
              1. A simulated attacker attempts an attack (e.g., SQL Injection, XSS, RCE).
              2. The AI-Powered Honeypot detects the attempt and generates a misleading response.
              3. Attack logs are recorded and analyzed for intelligence gathering.
              4. A real-time dashboard visualizes attacks and AI responses.
            </Typography>
            <Typography variant="h5" sx={{ mt: 3 }}>
              Future Enhancements
            </Typography>
            <Typography variant="body1" paragraph>
              - Integrating a threat intelligence sharing system with cybersecurity organizations.
              - Enhancing AI deception capabilities using advanced NLP models.
              - Deploying a multi-layered honeypot network for enterprise security solutions.
            </Typography>
            <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
              Author: Venkata Sai Krishna Aditya Vatturi
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}