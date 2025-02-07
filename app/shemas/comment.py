from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base
from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    userid: int
    postid: int

class CommentCreate(CommentBase):
    pass  

class CommentRead(CommentBase):
    id: int
    timecreated: datetime

    class Config:
        from_attributes = True