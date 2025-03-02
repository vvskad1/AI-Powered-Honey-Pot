from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# ✅ Database Connection
DATABASE_URL = "sqlite:///./honeypot.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ Attack Log Model
class AttackLog(Base):
    __tablename__ = "attack_logs"

    id = Column(Integer, primary_key=True, index=True)
    attack_type = Column(String, index=True)
    response = Column(String)
    ip_address = Column(String, index=True)
    first_attempt = Column(DateTime, default=datetime.utcnow)
    last_attempt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    attack_count = Column(Integer, default=1)

# ✅ Reinitialize the Database
def init_db():
    print("🔄 Reinitializing Database...")
    Base.metadata.drop_all(bind=engine)  # ✅ Drop old tables
    Base.metadata.create_all(bind=engine)  # ✅ Create new tables
    print("✅ Database Initialized Successfully!")

# ✅ Run Database Initialization when script is executed
if __name__ == "__main__":
    init_db()

# ✅ Database Dependency for FastAPI
def get_db():
    """Dependency function for database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()