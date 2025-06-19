from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

table_name = "comment"

class Comment(Base):
    __tablename__ = table_name
    __table_args__ = {"schema": "public"} 

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    content = Column(String, nullable=False)
    userid = Column(Integer, ForeignKey("registereduser.id"), primary_key=True)
    postid = Column(Integer, ForeignKey("post.id"), primary_key=True)
    timecreated = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")

