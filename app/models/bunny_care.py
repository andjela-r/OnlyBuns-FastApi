from sqlalchemy import Column, Integer, String, Float
from app.db.base import Base

class BunnyCare(Base):
    __tablename__ = "bunny_care"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)