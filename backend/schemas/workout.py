from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel

class CreateWorkoutRequest(BaseModel):
    name: str

class CreateWorkoutLogRequest(BaseModel):
    workout_id: int
    weight: float
    reps: int
    created_at: Optional[datetime] = None  # Add this line

class ProgressPoint(BaseModel):
    created_at: datetime
    weight: float

    class Config:
        from_attributes = True

class CompleteWorkoutResponse(BaseModel):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WorkoutLogResponse(BaseModel):
    id: int
    weight: float
    reps: int
    workout_id: int  # Ensure this matches your DB type (int)
    created_at: datetime

