from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Query
from sqlalchemy.orm import Session
from typing import Dict, Set, List
from app.models.chat import Chat, ChatMember, Message

class ChatService:
    def __init__(self):
        self.rooms: Dict[int, Set[WebSocket]] = {}

    async def connect(self, chat_id: int, websocket: WebSocket):
        await websocket.accept()
        self.rooms.setdefault(chat_id, set()).add(websocket)

    def disconnect(self, chat_id: int, websocket: WebSocket):
        if chat_id in self.rooms and websocket in self.rooms[chat_id]:
            self.rooms[chat_id].remove(websocket)
            if not self.rooms[chat_id]:
                del self.rooms[chat_id]

    async def broadcast(self, chat_id: int, message: dict):
        for ws in list(self.rooms.get(chat_id, [])):
            await ws.send_json(message)

    def ensure_member(db: Session, chat_id: int, user_id: int) -> ChatMember:
        member = db.query(ChatMember).filter_by(chat_id=chat_id, user_id=user_id).first()
        if not member:
            raise HTTPException(status_code=403, detail="Not a member of this chat")
        return member