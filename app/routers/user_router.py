from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.shemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()
user_service = UserService()

@router.post("/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with hashed password and default role.
    """
    try:
        return user_service.register_user(user, db)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a user by their ID.
    """
    user = user_service.find_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    """
    Retrieve a user by their username.
    """
    user = user_service.find_by_username(username, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """
    Retrieve all registered users.
    """
    try:
        users = user_service.find_all(db)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    

@router.put("/activate/{email}")
def activate_user(email: str, db: Session = Depends(get_db)):
    """
    Activate a user by their email.
    """
    success = user_service.activate_user(email, db)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"message": "User activated successfully"}
