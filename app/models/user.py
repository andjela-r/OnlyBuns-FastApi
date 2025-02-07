from sqlalchemy import Column, Integer, String, Boolean, Text, TIMESTAMP
from app.db.base import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "registereduser"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(50))
    surname = Column(String(50))
    email = Column(String(100), unique=True, nullable=False)
    address = Column(Text)
    followers = Column(Integer, default=0)
    posts = Column(Integer, default=0)
    following = Column(Integer, default=0)
    isactivated = Column(Boolean, default=False)
    datecreated = Column(TIMESTAMP)
    lastlogin = Column(TIMESTAMP)
    isadmin = Column(Boolean, default=False)

    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")