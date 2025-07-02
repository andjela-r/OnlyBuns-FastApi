from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.shemas.like import LikeBase

class PostBase(BaseModel):
    description: Optional[str]
    image: Optional[str]
    compressedimage: Optional[str]
    location_name: Optional[str]  

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

class PostWLikes(PostResponse):
    likes: list[LikeBase]