from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    description: Optional[str]
    image: Optional[str]
    compressedimage: Optional[str]
    location: Optional[str]

class PostCreate(PostBase):
    pass

class PostUpdate(PostBase):
    description: Optional[str]

class PostResponse(PostBase):
    id: int
    registereduserid: int
    timecreated: datetime
    likes: int
    comments: int
    isdeleted: bool
    isforad: bool

    class Config:
        orm_mode = True