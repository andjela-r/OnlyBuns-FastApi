from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Boolean, ForeignKey
from app.db.base import Base
from sqlalchemy import func
from sqlalchemy.orm import relationship

class Post(Base):
    __tablename__ = "post"

    id = Column(Integer, primary_key=True, index=True)
    registereduserid = Column(Integer, ForeignKey("registereduser.id"), nullable=False)
    description = Column(Text)
    image = Column(String)
    compressedimage = Column(String)
    location = Column(String)
    timecreated = Column(TIMESTAMP, default=func.now())
    likes_count = Column(Integer, name="likes", default=0) 
    comments_count = Column(Integer, name="comments", default=0)
    isdeleted = Column(Boolean, default=False)
    isforad = Column(Boolean, default=False)

    #Many to one
    user = relationship("User", back_populates="posts")
    #One to many
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")