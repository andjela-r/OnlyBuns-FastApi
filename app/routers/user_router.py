from fastapi import Path, APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import InvalidRequestError
from typing import Annotated
import time
from app.db.session import get_db
from app.routers.email_router import send_mail, EmailSchema, EmailUser
from app.shemas.user import UserCreate, UserResponse, UserResponseWithLocation, UserUpdate, UserAdminResponse
from app.services.user_service import UserService, delete_inactive_users
from app.services.location_service import LocationService
from app.security import create_access_token, get_current_user
from app.models.user import User

login_attempts = {}

MAX_ATTEMPTS = 5
WINDOW_SECONDS = 60

router = APIRouter()
user_service = UserService()
location_service = LocationService()

def is_rate_limited(ip: str):
    now = time.time()
    attempts = login_attempts.get(ip, [])
    
    attempts = [t for t in attempts if now - t < WINDOW_SECONDS]
    login_attempts[ip] = attempts
    if len(attempts) >= MAX_ATTEMPTS:
        return True

    attempts.append(now)
    login_attempts[ip] = attempts
    return False

@router.post("/token")
async def login(
    request: Request,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),

):
    ip = request.client.host
    if is_rate_limited(ip):
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Please try again in a minute."
        )
    user = user_service.find_by_email(form_data.username, db) #it is actually the email
    if not user or not user_service.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.isactivated:
        raise HTTPException(status_code=403, detail="Account not activated. Please check your email.")

    from datetime import datetime, timezone

    user.lastlogin = datetime.now(timezone.utc)
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user_name": user.name, "is_admin": user.isadmin}


@router.get("/me", response_model=UserResponseWithLocation)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    latitude = None
    longitude = None
    if current_user.address:
        location = location_service.get_location_by_name(db, current_user.address)
        if location:
            latitude = location.latitude
            longitude = location.longitude
    
    result = UserResponseWithLocation(
        id=current_user.id,
        isactivated=current_user.isactivated,
        # roles=[role.name for role in current_user.roles],
        datecreated=current_user.datecreated,
        lastlogin=current_user.lastlogin,
        username=current_user.username,
        email=current_user.email,
        name=current_user.name,
        surname=current_user.surname,
        address=current_user.address,
        latitude=latitude,
        longitude=longitude
    )
    return result

@router.put("/me", response_model=UserResponse)
def update_user(
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):

    try:
        if  not location_service.get_location_by_name(db, user_update.address):
            location_service.create_location(db, user_update.address, None, None)
            
        updated_user = user_service.update_user(current_user.id, user_update, db)
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me/posts")
def get_my_posts(current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    return user_service.get_user_posts(current_user.id, db)

@router.get("/me/followers", response_model=list[UserResponse])
def get_my_followers(current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    return user_service.get_user_followers(current_user.id, db)

@router.get("/me/following", response_model=list[UserResponse])
def get_my_following(current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    return user_service.get_user_following(current_user.id, db)

@router.post("/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with hashed password and default role.
    """
    try:
        if  not location_service.get_location_by_name(db, user.address):
            location_service.create_location(db, user.address, None, None)
        
        user_registered = user_service.register_user(user, db)
        
        email_data = EmailSchema(
            receiver_mail=user.email,
            user=EmailUser(name=user.name, surname=user.surname)
        )
        send_mail(email_data)
        return user_registered
    
    except InvalidRequestError as e:
        db.close()
        raise HTTPException(status_code=500, detail="Database transaction error: " + str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/adminuserview", response_model=list[UserAdminResponse])
def get_all_users_count(db: Session = Depends(get_db)):
    try:
        return user_service.find_all_with_counts(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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


@router.get("/by-username/{username}", response_model=UserResponse)
async def get_user_by_username(username: str = Path(..., regex=r"^[A-Za-z0-9_]+$"), db: Session = Depends(get_db)):
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
    return RedirectResponse(url="http://localhost:3000/")

@router.delete("/users/inactive")
def delete_inactive(db: Session = Depends(get_db)):
    delete_inactive_users(db)
    return {"message": "Inactive users deleted"}

@router.post("/{user_id}/follow")
def follow(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return user_service.follow_user(db, current_user.id, user_id)

@router.delete("/{user_id}/unfollow")
def unfollow(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return user_service.unfollow_user(db, current_user.id, user_id)

@router.get("/{user_id}/followers/count")
def followers_count(user_id: int, db: Session = Depends(get_db)):
    return {"followers": user_service.get_followers_count(db, user_id)}

@router.get("/{user_id}/following/count")
def following_count(user_id: int, db: Session = Depends(get_db)):
    return {"following": user_service.get_following_count(db, user_id)}

