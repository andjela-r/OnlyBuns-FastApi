from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime
from pydantic import BaseModel

class LikeBase(BaseModel):
    postid: int
    userid: int

class LikeCreate(LikeBase):
    pass

class LikeRead(LikeBase):
    postid: int
    userid: int
    timecreated: datetime
    
    class Config:
        from_attributes = True

