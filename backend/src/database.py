

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base
import os

# Veritabanı dosya yolu
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./plantpods.db")

# SQLite için connect_args gerekli
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Veritabanı tablolarını oluşturur."""
    Base.metadata.create_all(bind=engine) 