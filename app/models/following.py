from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.db.base import Base

class Following(Base):
    __tablename__ = "following"

    idfollower = Column(Integer, ForeignKey("registereduser.id"), primary_key=True)
    idfollowing = Column(Integer, ForeignKey("registereduser.id"), primary_key=True)

    #many to one
    follower = relationship("User", foreign_keys=[idfollower], back_populates="following")
    followed = relationship("User", foreign_keys=[idfollowing], back_populates="followers")