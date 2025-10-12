import uvicorn
from fastapi import FastAPI
from app.routers.user_router import router as user_router
from app.db.session import engine
from app.db.base import Base
from app.routers.like_router import router as like_router
from app.routers.comment_router import router as comment_router
from app.routers.post_router import router as post_router
from app.routers.email_router import router as email_router
from app.routers.location_router import router as location_router
from app.routers.stats_router import router as stats_router
from app.routers.bunny_care_router import router as bunny_care_router
from fastapi.middleware.cors import CORSMiddleware
from app.services.user_service import populate_username_bloom
from app.db.session import SessionLocal

from contextlib import asynccontextmanager
from app.workers.receive_bunny_locations import start_consumer_in_background

@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    start_consumer_in_background()
    yield
    # on shutdown: (BlockingConnection stops when process exits; no action needed for this simple demo)


# Initialize FastAPI app

app = FastAPI(title="OnlyBuns API", description="API for OnlyBuns, the rabbit social network", lifespan=lifespan)
db = SessionLocal()
populate_username_bloom(db)  # This fills the global username_bloom in user_service.py
db.close()

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(like_router, prefix="/likes", tags= ["Likes"])
app.include_router(comment_router, prefix="/comments", tags= ["Comment"])
app.include_router(post_router, prefix="/posts", tags= ["Post"])
app.include_router(email_router, prefix="/email", tags=["Email"])
app.include_router(location_router, prefix="/locations", tags=["Location"])
app.include_router(stats_router, prefix="/stats", tags=["Stats"])
app.include_router(bunny_care_router, prefix="/bunny-care", tags=["Bunny Care"])


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to OnlyBuns API!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
