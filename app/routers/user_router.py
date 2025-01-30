from fastapi import APIRouter, HTTPException, Depends
from app.shemas.user import UserCreate, UserResponse
from app.models.user import User
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()


@router.get("/users/")
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users
