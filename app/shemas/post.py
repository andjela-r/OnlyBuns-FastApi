from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.shemas.like import LikeBase
from typing import List
from app.shemas.comment import CommentWithUserAndPost

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
    compressedimage: Optional[str] = None
    location_name: Optional[str] = None

    class Config:
        from_attributes = True

class PostWLikes(PostResponse):
    likes: list[LikeBase]

class PostDetailWithCounts(PostResponse):
    comments: List[CommentWithUserAndPost]  # prva 3 komentara
    like_count: int
    comment_count: int
    is_owner: bool  # da frontend zna da prikaže dugmad za edit/delete

    class Config:
        from_attributes = True

class PostUpdate(BaseModel):
    description: Optional[str]
    location_name: Optional[str]

    model_config = {
        "from_attributes": True
    }