from pydantic import BaseModel, EmailStr
from app.shemas.role import RoleResponse
from typing import Optional, List
from datetime import datetime

# Base User Schema
class UserBase(BaseModel):
    username: str
    email: EmailStr
    name: Optional[str]
    surname: Optional[str]
    address: Optional[str]

# Schema for creating a new user
class UserCreate(UserBase):
    password: str
    confirm_password: str

# Schema for updating an existing user
class UserUpdate(BaseModel):
    name: Optional[str]
    surname: Optional[str]
    address: Optional[str]
    password: Optional[str] 
    confirm_password: Optional[str] 

# Schema for returning user data
class UserResponse(UserBase):
    id: int
    #followers: int
    #posts_count: int
    #following: int
    isactivated: bool
    roles: List[RoleResponse]  # Include roles in response
    datecreated: datetime
    lastlogin: Optional[datetime]

    class Config:
        from_attributes = True



