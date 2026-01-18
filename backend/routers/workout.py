import uuid
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, BackgroundTasks
from sqlalchemy.orm import Session

from db.database import get_db, SessionLocal
from models.workout import Workout, WorkoutLog
from models.job import WorkoutJob
from schemas.workout import(
    CreateWorkoutRequest, CreateWorkoutLogRequest, ProgressPoint, WorkoutLogResponse,
)
from schemas.job import WorkoutJobResponse

router = APIRouter(
    prefix="/workout",
    tags=["workout"],
)

def get_session_id(session_id: Optional[str] = Cookie(None)):
    if not session_id:
        return str(uuid.uuid4())
    return session_id


# 1. Add the "all" endpoint correctly
@router.get("/all")
def get_all_workouts(db: Session = Depends(get_db)):
    workouts = db.query(Workout).all()
    # Transform the data so 'title' becomes 'name' for the frontend
    return [{"id": w.id, "name": w.title} for w in workouts]


# 2. Fix the Create endpoint to save to the Workout table
@router.post("/create")
def create_workout(
        request: CreateWorkoutRequest,
        db: Session = Depends(get_db),
):
    # Create the actual workout category
    new_workout = Workout(
        title=request.name,  # Your model uses 'title', React sends 'name'
    )
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    # Return the new workout so React can do setID(res.data.id)
    return {"id": new_workout.id, "name": new_workout.title}


# 3. The Progress endpoint (this one looks great!)
@router.get("/{workout_id}/progress", response_model=List[ProgressPoint])
def get_progress(workout_id: int, db: Session = Depends(get_db)):
    logs = db.query(WorkoutLog).filter(
        WorkoutLog.workout_id == workout_id
    ).order_by(WorkoutLog.created_at.asc()).all()
    return logs



@router.post("/log", response_model=WorkoutLogResponse)
def log_workout(request: CreateWorkoutLogRequest, db: Session = Depends(get_db)):
    new_log = WorkoutLog(
        workout_id=request.workout_id,
        weight=request.weight,
        reps=request.reps,
        created_at=request.created_at # Pass the custom time here
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log
