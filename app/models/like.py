from sqlalchemy import Column, ForeignKey, Integer, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import timedelta

class Like(Base):
    __tablename__ = "like"

    userid = Column(Integer, ForeignKey("registereduser.id"), primary_key=True)
    postid = Column(Integer, ForeignKey("post.id"), primary_key=True)
    timecreated = Column(TIMESTAMP, default=func.now() - timedelta(days=10))

    #many to one
    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")