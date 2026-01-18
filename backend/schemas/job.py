from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class WorkoutJobBase(BaseModel):
    name: str

class WorkoutJobResponse(BaseModel):
    job_id: str
    created_at: datetime
    workout_id: Optional[int] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None

    class Config:
        from_attributes = True

class WorkoutJobCreate(WorkoutJobBase):
    pass