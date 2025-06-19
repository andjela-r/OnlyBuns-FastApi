import uvicorn
from fastapi import FastAPI
from app.routers.user_router import router as user_router
from app.db.session import engine
from app.db.base import Base
from app.routers.like_router import router as like_router
from app.routers.comment_router import router as comment_router
from app.routers.post_router import router as post_router

from fastapi.security import OAuth2PasswordBearer
#from passlib.context import CryptContext
#import jwt

# Initialize FastAPI app
app = FastAPI(title="OnlyBuns API", description="API for OnlyBuns, the rabbit social network")

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(like_router, prefix="/likes", tags= ["Likes"])

app.include_router(comment_router, prefix="/comments", tags= ["Comment"])

app.include_router(post_router, prefix="/posts", tags= ["Post"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to OnlyBuns API!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
''''
#*************************************************************
#DODATO ZA JWT

# Instanciraj OAuth2PasswordBearer za uzimanje tokena sa zahteva
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# U ovom primeru korisnici će biti jednostavno u memoriji
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "password": "$2b$12$U5vlPpn.Tn3E8vBvq1Zoz62mjz5tzvJ3ZzjK5uZrLZaJHVmOe8k76"  # bcrypt hash za lozinku 'testpassword'
    }
}



# Funkcija za autentifikaciju korisnika
def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user or not utilis.verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt 
'''