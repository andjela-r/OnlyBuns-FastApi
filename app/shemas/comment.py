from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    userid: int
    postid: int

class CommentCreate(CommentBase):
    pass  

class CommentRead(CommentBase):
    id: int
    timecreated: datetime

    class Config:
        from_attributes = True

class RegisteredUserSchema(BaseModel):
    id: int
    name: str
    surname: str
    username: str

    class Config:
        from_attributes = True

class PostSchema(BaseModel):
    id: int

    class Config:
        from_attributes = True

class CommentWithUserAndPost(BaseModel):
    id: int
    content: str
    user: RegisteredUserSchema
    post: PostSchema
    timecreated: datetime

    class Config:
        from_attributes = True