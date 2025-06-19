from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    registereduserid: int
    description: Optional[str]
    image: Optional[str]
    compressedimage: Optional[str]
    location: Optional[str]

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    description: Optional[str]
    image: Optional[str]
    compressedimage: Optional[str]
    location: Optional[str]

class RegisteredUserSchema(BaseModel):
    id: int
    name: str
    surname: str

    class Config:
        from_attributes = True

class PostResponse(PostBase):
    id: int
    user: RegisteredUserSchema
    timecreated: datetime
    likes_count: int = 0
    comments_count: int = 0
    isdeleted: bool
    isforad: bool

    class Config:
        from_attributes = True