from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.models.following import Following
from app.shemas.user import UserCreate, UserUpdate
from app.services.role_service import RoleService
from app.services.location_service import LocationService
from pybloom_live import BloomFilter
from passlib.context import CryptContext
import time 
from fastapi import HTTPException
from sqlalchemy.orm import Session #glavna veza između tvoje aplikacije i baze podataka.
from app.models.post import Post
from sqlalchemy import func

username_bloom = BloomFilter(capacity=10000, error_rate=0.001)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

location_service = LocationService()

def populate_username_bloom(db: Session):
    for user in db.query(User.username).all():
        username_bloom.add(user.username)

class UserService:
    def __init__(self):
        self.role_service = RoleService()

    def find_by_username(self, username: str, db: Session):
        return db.query(User).filter(User.username == username).first()

    def find_by_email(self, email: str, db: Session):
        return db.query(User).filter(User.email == email).first()
    
    def find_by_id(self, user_id: int, db: Session):
        return db.query(User).filter(User.id == user_id).first()

    def find_all(self, db: Session):
        return db.query(User).all()

    def register_user(self, user_data: UserCreate, db: Session):
        time.sleep(2)  # For simulating a delay 

        if user_data.username in username_bloom:
            raise HTTPException(status_code=400, detail="Username is **probably** already taken")
        try:
        #with db.begin():  # Start a transaction
            hashed_password = pwd_context.hash(user_data.password)
            user = User(
                name=user_data.name,
                surname=user_data.surname,
                address=user_data.address,
                email=user_data.email,
                username=user_data.username,
                password=hashed_password,
                isactivated=False
            )
            role = self.role_service.find_by_name("ROLE_USER", db)
            if not role:
                raise ValueError("Default role 'ROLE_USER' not found")
            user.roles = [role]
            db.add(user)
            db.commit()
            username_bloom.add(user.username)  # Add username to Bloom filter
            db.refresh(user)
            return user
        
        except IntegrityError as e:
            db.rollback()
            if "username" in str(e.orig):
                raise HTTPException(status_code=400, detail="Username is already taken")
            elif "email" in str(e.orig):
                raise HTTPException(status_code=400, detail="Email is already registered")
            else:
                raise HTTPException(status_code=400, detail="Registration failed due to a database error")
            
    def activate_user(self, email: str, db: Session):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return False
        user.isactivated = True
        db.commit()
        return True
    
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_user_posts(self, user_id: int, db: Session):
        user = self.find_by_id(user_id, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user.posts if user.posts else []
    
    def get_user_followers(self, user_id: int, db: Session):
        user = self.find_by_id(user_id, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.followers:
            return [self.find_by_id(following.idfollower, db) for following in user.followers]
        return []

    def get_user_following(self, user_id: int, db: Session):
        user = self.find_by_id(user_id, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.following:
            return [self.find_by_id(following.idfollowing, db) for following in user.following]
        return []
    
    def follow_user(self, db: Session, idfollower: int, idfollowing: int):
        user = self.find_by_id(idfollowing, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        exists = db.query(Following).filter_by(idfollower=idfollower, idfollowing=idfollowing).first()
        if exists:
            return exists
        follow = Following(idfollower=idfollower, idfollowing=idfollowing)
        db.add(follow)
        db.commit()
        db.refresh(follow)
        return follow

    def unfollow_user(self, db: Session, idfollower: int, idfollowing: int):
        follow = db.query(Following).filter_by(idfollower=idfollower, idfollowing=idfollowing).first()
        if not follow:
            raise HTTPException(status_code=404, detail="Not following this user")
        db.delete(follow)
        db.commit()
        return {"message": "Unfollowed"}
    
    def get_followers_count(self, db: Session, user_id: int):
        return db.query(Following).filter_by(idfollowing=user_id).count()

    def get_following_count(self, db: Session, user_id: int):
        return db.query(Following).filter_by(idfollower=user_id).count()

    def update_user(self, user_id: int, user_data: UserUpdate, db: Session):
        user = self.find_by_id(user_id, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user_data.password and user_data.confirm_password:
            if user_data.password != user_data.confirm_password:
                raise HTTPException(status_code=400, detail="Passwords do not match")
            
            user.password = self.get_password_hash(user_data.password)
        
        user.name = user_data.name or user.name
        user.surname = user_data.surname or user.surname
        user.address = user_data.address or user.address
        
        location = location_service.get_location_by_name(db, user.address)

        if location:
            location.latitude = user_data.latitude if user_data.latitude is not None else location.latitude
            location.longitude = user_data.longitude if user_data.longitude is not None else location.longitude
        
        db.commit()
        db.refresh(user)
        return user
    def find_all_with_counts(self, db: Session):
        post_count_subq = (
            db.query(Post.registereduserid, func.count(Post.id).label("posts_count"))
            .group_by(Post.registereduserid)
            .subquery()
        )

        following_subq = (
            db.query(Following.idfollower, func.count(Following.idfollowing).label("following"))
            .group_by(Following.idfollower)
            .subquery()
        )

        followers_subq = (
            db.query(Following.idfollowing, func.count(Following.idfollower).label("followers"))
            .group_by(Following.idfollowing)
            .subquery()
        )

        query = (
            db.query(
                User.id,
                User.username,
                User.name,
                User.surname,
                User.email,
                User.address,
                func.coalesce(post_count_subq.c.posts_count, 0).label("posts_count"),
                func.coalesce(following_subq.c.following, 0).label("following"),
                func.coalesce(followers_subq.c.followers, 0).label("followers"),
            )
            .outerjoin(post_count_subq, post_count_subq.c.registereduserid == User.id)
            .outerjoin(following_subq, following_subq.c.idfollower == User.id)
            .outerjoin(followers_subq, followers_subq.c.idfollowing == User.id)
        )

        result = [dict(r._mapping) for r in query.all()]
        return result


def delete_inactive_users(db: Session):
    db.query(User).filter(User.isactivated == False).delete()
    db.commit()



    
