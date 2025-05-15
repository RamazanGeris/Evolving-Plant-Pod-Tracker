
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class Pod(Base):
    __tablename__ = "pods"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    planting_date = Column(Date, nullable=False)
    description = Column(String, nullable=True)

    images = relationship("Image", back_populates="pod", cascade="all, delete-orphan")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    pod_id = Column(Integer, ForeignKey("pods.id"), nullable=False)
    filename = Column(String, nullable=False, unique=True)
    upload_time = Column(DateTime, default=datetime.datetime.utcnow)
    description = Column(String, nullable=True)

    pod = relationship("Pod", back_populates="images") 