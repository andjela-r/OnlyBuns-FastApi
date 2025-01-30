from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Boolean, ForeignKey
from app.db.base import Base

class Post(Base):
    __tablename__ = "post"

    id = Column(Integer, primary_key=True, index=True)
    registereduserid = Column(Integer, ForeignKey("registereduser.id"), nullable=False)
    description = Column(Text)
    image = Column(String)
    compressedimage = Column(String)
    location = Column(String)
    timecreated = Column(TIMESTAMP)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    isdeleted = Column(Boolean, default=False)
    isforad = Column(Boolean, default=False)
