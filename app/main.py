from fastapi import FastAPI
from app.routers.user_router import router as user_router
from app.db.session import engine
from app.db.base import Base

# Initialize FastAPI app
app = FastAPI(title="OnlyBuns API", description="API for OnlyBuns, the rabbit social network")

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(user_router, tags=["Users"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to OnlyBuns API!"}
