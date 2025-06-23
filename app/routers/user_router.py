from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Annotated

from app.db.session import get_db
from app.routers.email_router import send_mail, EmailSchema, EmailUser
from app.shemas.user import UserCreate, UserResponse
from app.services.user_service import UserService
from app.security import create_access_token, get_current_user
from app.models.user import User

router = APIRouter()
user_service = UserService()

@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),

):
    user = user_service.find_by_email(form_data.username, db) #it is actually the email
    if not user or not user_service.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.isactivated:
        raise HTTPException(status_code=403, detail="Account not activated. Please check your email.")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.post("/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with hashed password and default role.
    """
    try:
        user_registered = user_service.register_user(user, db)
        email_data = EmailSchema(
            receiver_mail=user.email,
            user=EmailUser(name=user.name, surname=user.surname)
        )
        send_mail(email_data)
        return user_registered
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    user = user_service.find_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = user_service.find_by_username(username, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    try:
        return user_service.find_all(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/activate/{email}")
def activate_user(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.isactivated:
        user.isactivated = True
        db.commit()
    # Redirect to frontend homepage
    return RedirectResponse(url="http://localhost:3000/")