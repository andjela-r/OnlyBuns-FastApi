from sqlalchemy import Column, Integer, String
from app.db.base import Base


class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)