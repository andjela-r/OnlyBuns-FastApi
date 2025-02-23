from sqlalchemy import Column, Integer, String, Boolean, Text, Table, ForeignKey, TIMESTAMP
from app.db.base import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

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
    followers = Column(Integer, default=0)
    posts_count = Column(Integer, name="posts", default=0) # number of posts
    following = Column(Integer, default=0)
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