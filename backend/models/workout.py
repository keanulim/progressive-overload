from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from db.database import Base


class Workout(Base):
    __tablename__ = "workout"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)  # React uses this as "name"
    session_id = Column(String, index=True, nullable=True)  # Optional
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    logs = relationship("WorkoutLog", back_populates="workout")


class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    id = Column(Integer, primary_key=True)

    weight = Column(Float)
    reps = Column(Integer)
    created_at = Column(DateTime, default=datetime.now)

    # FIX: Changed String to Integer to match Workout.id
    workout_id = Column(Integer, ForeignKey("workout.id"))
    workout = relationship("Workout", back_populates="logs")