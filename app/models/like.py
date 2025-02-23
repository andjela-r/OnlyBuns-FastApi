from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.db.base import Base

class Like(Base):
    __tablename__ = "like"

    userid = Column(Integer, ForeignKey("registereduser.id"), primary_key=True)
    postid = Column(Integer, ForeignKey("post.id"), primary_key=True)

    #many to one
    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")