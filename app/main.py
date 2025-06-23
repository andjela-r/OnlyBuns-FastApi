import uvicorn
from fastapi import FastAPI
from app.routers.user_router import router as user_router
from app.db.session import engine
from app.db.base import Base
from app.routers.like_router import router as like_router
from app.routers.comment_router import router as comment_router
from app.routers.post_router import router as post_router
from app.routers.email_router import router as email_router
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(title="OnlyBuns API", description="API for OnlyBuns, the rabbit social network")

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

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to OnlyBuns API!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
