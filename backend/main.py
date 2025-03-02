from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from ai_engine import ai_deception
from database import SessionLocal, AttackLog, get_db
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from sqlalchemy.orm import Session
from sqlalchemy.sql import func  # ✅ Import SQLAlchemy function for timestamps


app = FastAPI()

# CORS setup for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend origin if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connections for real-time updates
connections = []

class AttackRequest(BaseModel):
    type: str
import random

def generate_fake_ip():
    """Generate a random fake IP address."""
    return ".".join(str(random.randint(1, 255)) for _ in range(4))

@app.post("/attack")
async def simulate_attack(attack_data: AttackRequest, db: Session = Depends(get_db)):
    """Handles attack simulation and logs deceptive response."""
    try:
        attack_type = attack_data.type
        ip_address = generate_fake_ip()  # ✅ Generate a new fake IP
        print(f"🔥 Attack detected: {attack_type} from {ip_address}")

        # ✅ Call AI to generate response
        ai_response = ai_deception.generate_deceptive_response(attack_type)
        print(f"🤖 AI Response: {ai_response}")

        # ✅ Check if attacker already exists
        existing_attack = db.query(AttackLog).filter_by(ip_address=ip_address, attack_type=attack_type).first()

        if existing_attack:
            # ✅ Update attack log
            existing_attack.attack_count += 1
            existing_attack.response = ai_response  # ✅ Update response with AI-generated text
            existing_attack.last_attempt = func.now()
            db.commit()
            db.refresh(existing_attack)
            print(f"🔄 Updated attack log for {ip_address}: {existing_attack.attack_count} attacks.")
            new_log = existing_attack  # ✅ Update reference
        else:
            # ✅ Create new attack log
            new_attack = AttackLog(
                attack_type=attack_type,
                response=ai_response,  # ✅ Store AI-generated response
                ip_address=ip_address
            )
            db.add(new_attack)
            db.commit()
            db.refresh(new_attack)
            print(f"✅ New attack logged: {attack_type} from {ip_address}")
            new_log = new_attack  # ✅ Store the new log

        # ✅ Trigger WebSocket update
        await broadcast_new_log(new_log)

        return {"message": "Attack recorded", "ip": ip_address, "ai_response": ai_response}

    except Exception as e:
        print(f"❌ Error in /attack: {e}")
        raise HTTPException(status_code=500, detail=str(e))

        # ✅ Trigger WebSocket update
        await broadcast_new_log(new_log)

        return {"message": "Attack recorded", "ip": ip_address}

    except Exception as e:
        print(f"❌ Error in /attack: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/logs")
def get_logs():
    """Fetches attack logs from the database."""
    db = SessionLocal()
    try:
        logs = db.query(AttackLog).order_by(AttackLog.last_attempt.desc()).all()  # ✅ FIXED: Use `last_attempt`
        return [
            {
                "id": log.id,
                "attack_type": log.attack_type,
                "response": log.response,
                "ip_address": log.ip_address,
                "timestamp": log.last_attempt  # ✅ FIXED: Use `last_attempt`
            }
            for log in logs
        ]
    except Exception as e:
        print(f"❌ Error in /logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@app.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time attack logs."""
    await websocket.accept()
    connections.append(websocket)
    print("✅ WebSocket client connected.")

    # ✅ Send an initial test message
    await websocket.send_json({"message": "WebSocket Connected"})

    try:
        while True:
            await asyncio.sleep(1)  # Keep connection alive
    except WebSocketDisconnect:
        print("⚠️ WebSocket client disconnected.")
        connections.remove(websocket)  # ✅ Remove disconnected clients properly

async def broadcast_new_log(log):
    """Send a new log update to all connected WebSocket clients."""
    log_data = {
        "id": log.id,
        "attack_type": log.attack_type,
        "response": log.response,
        "ip_address": log.ip_address,
        "timestamp": str(log.last_attempt)
    }
    for connection in connections:
        try:
            await connection.send_json(log_data)
            print(f"📡 Broadcasting Log: {log_data}")
        except Exception as e:
            print(f"❌ WebSocket Broadcast Error: {e}")

@app.get("/")
def home():
    """Simple API home route."""
    return {"message": "AI-Powered Honeypot Backend is running."}
