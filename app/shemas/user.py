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
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    password: Optional[str] = None
    confirm_password: Optional[str] = None 

# Schema for returning user data
class UserResponse(UserBase):
    id: int
    isactivated: bool
    # roles: List[RoleResponse]  
    address: str
    datecreated: datetime
    lastlogin: Optional[datetime]

    class Config:
        from_attributes = True

class UserResponseWithLocation(UserBase):
    id: int
    isactivated: bool
    # roles: List[RoleResponse]  
    address: str
    datecreated: datetime
    lastlogin: Optional[datetime]
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True

class UserAdminResponse(BaseModel):
    id: int
    username: str
    name: Optional[str]
    surname: Optional[str]
    email: EmailStr
    address: Optional[str]
    posts_count: int
    following: int
    followers: int

    class Config:
        from_attributes = True




