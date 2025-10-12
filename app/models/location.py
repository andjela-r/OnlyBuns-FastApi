from app.db.base import Base
from sqlalchemy import Column, Float, Integer, String, UniqueConstraint

class Location(Base):
    __tablename__ = "location"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    __table_args__ = (
        UniqueConstraint('latitude', 'longitude', name='unique_lat_long'),
    )

