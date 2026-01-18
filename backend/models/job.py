from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from db.database import Base

class WorkoutJob(Base):
    __tablename__ = "workout_job"

    id = Column(Integer, primary_key=True)
    job_id = Column(String, index=True, unique = True)
    session_id = Column(String, index = True)
    name = Column(String)
    status = Column(String)
    workout_id = Column(Integer, nullable = True)
    error = Column(String, nullable = True)
    created_at = Column(DateTime(timezone = True), default=func.now())
    completed_at = Column(DateTime(timezone = True), nullable = True)