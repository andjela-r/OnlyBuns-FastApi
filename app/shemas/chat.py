from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    content: str
    created_at: datetime
    sender_username: Optional[str] = None

    class Config:
         from_attributes = True

class ChatCreate(BaseModel):
    name: Optional[str] = None
    is_group: bool = False
    members: List[int] = []  

class AddMemberIn(BaseModel):
    user_id: int

class RemoveMemberIn(BaseModel):
    user_id: int

class ChatMemberOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes   = True

class ChatOut(BaseModel):
    id: int
    name: Optional[str]
    is_group: bool
    created_by: int
    created_at: datetime
    members: List[UserOut] = []
    messages: List[MessageOut] = []

    class Config:
        from_attributes   = True

