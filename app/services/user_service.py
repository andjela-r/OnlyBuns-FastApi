from sqlalchemy.orm import Session
from app.models.user import User
from app.shemas.user import UserCreate
from app.services.role_service import RoleService
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self):
        self.role_service = RoleService()

    def find_by_username(self, username: str, db: Session):
        return db.query(User).filter(User.username == username).first()

    def find_by_id(self, user_id: int, db: Session):
        return db.query(User).filter(User.id == user_id).first()

    def find_all(self, db: Session):
        return db.query(User).all()

    def register_user(self, user_data: UserCreate, db: Session):
        if db.query(User).filter(User.email == user_data.email).first():
            raise ValueError("Email is already registered")

        if db.query(User).filter(User.username == user_data.username).first():
            raise ValueError("Username is already taken")

        if user_data.password != user_data.confirm_password:
            raise ValueError("Passwords do not match")

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

        user.roles = [role]  # Ensure roles is a list

        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def activate_user(self, email: str, db: Session):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return False
        user.isactivated = True
        db.commit()
        return True
