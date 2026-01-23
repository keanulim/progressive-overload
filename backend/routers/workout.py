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

@router.get("/all")
def get_all_workouts(db: Session = Depends(get_db)):
    workouts = db.query(Workout).all()
    return [{"id": w.id, "name": w.title} for w in workouts]

@router.post("/create")
def create_workout(
        request: CreateWorkoutRequest,
        db: Session = Depends(get_db),
):
    new_workout = Workout(
        title=request.name,  
    )
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return {"id": new_workout.id, "name": new_workout.title}

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
        created_at=request.created_at 
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log
