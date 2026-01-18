from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from routers import workout, job
from db.database import create_tables

create_tables()

app = FastAPI(
    title = "Progressive Overload API",
    description = "very good workout tracker",
    version = "0.1.0",
    docs_url = "/docs",
    redoc_url = "/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(workout.router, prefix = settings.API_PREFIX)
app.include_router(job.router, prefix = settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host = "0.0.0.0", port = 8000, reload = True)