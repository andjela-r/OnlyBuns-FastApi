from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from pydantic import BaseModel

class LikeBase(BaseModel):
    postid: int
    userid: int

class LikeCreate(LikeBase):
    pass

class LikeRead(LikeBase):
    postid: int
    userid: int

    class Config:
        from_attributes = True

