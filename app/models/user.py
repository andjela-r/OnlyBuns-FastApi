from sqlalchemy import Column, Integer, String, Boolean, Text, Table, ForeignKey, TIMESTAMP
from app.db.base import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.following import Following

# Association table for Many-to-Many User-Role relationship
user_role_table = Table(
    "user_role",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("registereduser.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("role.id", ondelete="CASCADE"), primary_key=True),
)

class User(Base):
    __tablename__ = "registereduser"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(50))
    surname = Column(String(50))
    email = Column(String(100), unique=True, nullable=False)
    address = Column(Text)
    isactivated = Column(Boolean, default=False)
    datecreated = Column(TIMESTAMP, server_default=func.now())
    lastlogin = Column(TIMESTAMP)
    isadmin = Column(Boolean, default=False)

    # Many-to-Many relationship with Role
    roles = relationship("Role", secondary=user_role_table, backref="users")

    # One-to-Many relationships
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")

    following = relationship("Following", foreign_keys=[Following.idfollower], back_populates="follower")
    followers = relationship("Following", foreign_keys=[Following.idfollowing], back_populates="followed")