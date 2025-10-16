from app.db.base import Base
from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str