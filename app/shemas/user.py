from pydantic import BaseModel, EmailStr
from typing import Optional
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

# Schema for updating an existing user
class UserUpdate(UserBase):
    name: Optional[str]
    surname: Optional[str]
    address: Optional[str]

# Schema for returning user data
class UserResponse(UserBase):
    id: int
    followers: int
    posts: int
    following: int
    isactivated: bool
    datecreated: datetime
    lastlogin: Optional[datetime]

    class Config:
        orm_mode = True
