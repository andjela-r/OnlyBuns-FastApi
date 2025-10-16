from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Query, Body
from sqlalchemy.orm import Session
from typing import Dict, Set, List
from app.db.session import get_db
from app.security import get_current_user, decode_access_token
from app.models.chat import Chat, ChatMember, Message
from app.models.user import User
from app.shemas.chat import ChatCreate, ChatOut,MessageCreate, MessageOut, AddMemberIn, RemoveMemberIn
from sqlalchemy import select, desc, func
from app.services.chat_service import ChatMember, ChatService
import asyncio

router = APIRouter()
manager = ChatService()

active_connections: dict[int, list[WebSocket]] = {}

@router.post("/", response_model=ChatOut)
def create_chat(
    payload: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not payload.is_group:
        other_user_id = next((uid for uid in payload.members if uid != current_user.id), None)
        if not other_user_id:
            raise HTTPException(status_code=400, detail="Missing other user ID")

        existing_chat = (
            db.query(Chat)
            .filter(
                Chat.is_group == False,
                Chat.members.any(User.id == current_user.id),
                Chat.members.any(User.id == other_user_id),
            )
            .first()
        )
        if existing_chat:
            return existing_chat

    chat = Chat(
        name=payload.name if payload.is_group else None,
        is_group=payload.is_group,
        created_by=current_user.id,
    )
    db.add(chat)
    db.flush()

    db.add(ChatMember(chat_id=chat.id, user_id=current_user.id, is_group_admin=True))

    for member in set(payload.members or []):
        if isinstance(member, str):
            user = db.query(User).filter(User.username == member).first()
            if not user:
                raise HTTPException(status_code=404, detail=f"User '{member}' not found")
            user_id = user.id
        else:
            user_id = member

        if user_id == current_user.id:
            continue

        exists = db.query(ChatMember).filter_by(chat_id=chat.id, user_id=user_id).first()
        if exists:
            continue

        db.add(ChatMember(chat_id=chat.id, user_id=user_id, is_group_admin=False))

    db.commit()
    db.refresh(chat)
    return chat


@router.get("/", response_model=List[ChatOut])
def my_chats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chats = (
        db.query(Chat)
        .join(ChatMember, ChatMember.chat_id == Chat.id)
        .filter(ChatMember.user_id == current_user.id)
        .order_by(desc(Chat.created_at))
        .all()
    )

    result = []
    for chat in chats:
        members = [
            {"id": u.id, "username": u.username}
            for u in db.query(User)
                    .join(ChatMember, ChatMember.user_id == User.id)
                    .filter(ChatMember.chat_id == chat.id)
                    .all()
        ]

        result.append({
            "id": chat.id,
            "name": chat.name,
            "is_group": chat.is_group,
            "created_by": chat.created_by,
            "created_at": chat.created_at,
            "members": members
        })

    return result

@router.post("/{chat_id}/members")
async def add_member(chat_id: int, payload: AddMemberIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    member = ChatService.ensure_member(db, chat_id, current_user.id)
    if not member.is_group_admin:
        raise HTTPException(status_code=403, detail="Only chat admin can add members")

    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    existing_member = (
        db.query(ChatMember)
        .filter(ChatMember.chat_id == chat_id, ChatMember.user_id == user.id)
        .first()
    )
    if existing_member:
        raise HTTPException(status_code=400, detail=f"User '{user.username}' is already in the chat")

    new_member = ChatMember(chat_id=chat_id, user_id=user.id, is_group_admin=False)
    db.add(new_member)
    db.commit()

    sys = Message(
        chat_id=chat_id,
        sender_id=current_user.id,
        content=f"User '{user.username}' added to chat"
    )
    db.add(sys)
    db.commit()
    db.refresh(sys)

    payload_msg = {
        "type": "message",
        "message": {
            "id": sys.id,
            "chat_id": chat_id,
            "sender_id": current_user.id,
            "sender_username": current_user.username,
            "content": sys.content,
            "created_at": sys.created_at.isoformat(),
        },
    }
    await manager.broadcast(chat_id, payload_msg)
    asyncio.create_task(manager.broadcast(chat_id, payload_msg))

    return {"message": f"Member '{user.username}' added successfully"}


@router.delete("/{chat_id}/members")
def remove_member(chat_id: int, payload: RemoveMemberIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    member = ChatService.ensure_member(db, chat_id, current_user.id)
    if not member.is_group_admin:
        raise HTTPException(status_code=403, detail="Only chat admin can remove members")

    if payload.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Admin cannot remove themselves")

    cm = db.query(ChatMember).filter_by(chat_id=chat_id, user_id=payload.user_id).first()
    if not cm:
        raise HTTPException(status_code=404, detail="Not a member")

    db.delete(cm); db.commit()
    sys = Message(chat_id=chat_id, sender_id=current_user.id, content=f"User {payload.user_id} removed from chat")
    db.add(sys); db.commit()
    return {"message": "Member removed"}

@router.get("/{chat_id}/messages", response_model=List[MessageOut])
def get_messages(chat_id: int, limit: int = 50, before_id: int | None = None,
                 db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ChatService.ensure_member(db, chat_id, current_user.id)
    q = db.query(Message).filter(Message.chat_id == chat_id)
    if before_id:
        # uzmi starije od poruke X
        anchor = db.query(Message).filter(Message.id == before_id, Message.chat_id == chat_id).first()
        if anchor:
            q = q.filter(Message.created_at < anchor.created_at)
    msgs = q.order_by(desc(Message.created_at)).limit(min(limit, 100)).all()
    return list(reversed(msgs))

@router.post("/{chat_id}/messages", response_model=MessageOut)
def send_message(
    chat_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not message.content.strip():
        raise HTTPException(status_code=400, detail="Message content required")
    msg = Message(chat_id=chat_id, sender_id=current_user.id, content=message.content.strip())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return MessageOut(
        id=msg.id,
        chat_id=msg.chat_id,
        sender_id=msg.sender_id,
        content=msg.content,
        created_at=msg.created_at,
        sender_username=current_user.username
    )

@router.post("/direct/{user_id}", response_model=ChatOut)
def create_direct_chat(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="User not found")
    existing_chat = (
        db.query(Chat)
        .join(ChatMember)
        .filter(Chat.is_group == False)
        .filter(ChatMember.user_id.in_([current_user.id, user_id]))
        .group_by(Chat.id)
        .having(func.count(ChatMember.user_id) == 2)
        .first()
    )

    if existing_chat:
        return existing_chat

    chat = Chat(is_group=False, created_by=current_user.id)
    db.add(chat)
    db.commit()
    db.refresh(chat)

    db.add_all([
        ChatMember(chat_id=chat.id, user_id=current_user.id, is_group_admin=True),
        ChatMember(chat_id=chat.id, user_id=user_id, is_group_admin=False),
    ])
    db.commit()

    return chat

@router.websocket("/ws/chats/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int, db: Session = Depends(get_db)):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION); return
    try:
        payload = decode_access_token(token) 
        user_id = int(payload.get("sub"))
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION); return

    try:
        ChatService.ensure_member(db, chat_id, user_id)
    except HTTPException:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION); return

    await manager.connect(chat_id, websocket)

    last10 = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(desc(Message.created_at))
        .limit(10).all()
    )
    await websocket.send_json({
        "type": "history",
        "messages": [
            {"id": m.id, "chat_id": m.chat_id, "sender_id": m.sender_id, "content": m.content, "created_at": m.created_at.isoformat()}
            for m in reversed(last10)
        ]
    })

    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "message":
                content = (data.get("content") or "").strip()
                if not content:
                    continue
                msg = Message(chat_id=chat_id, sender_id=user_id, content=content)
                db.add(msg); db.commit(); db.refresh(msg)

                payload = {
                    "type": "message",
                    "message": {
                        "id": msg.id,
                        "chat_id": chat_id,
                        "sender_id": user_id,
                        "sender_username": db.query(User).filter(User.id == user_id).first().username,
                        "content": msg.content,
                        "created_at": msg.created_at.isoformat()
                    }
                }
                await manager.broadcast(chat_id, payload)
    except WebSocketDisconnect:
        manager.disconnect(chat_id, websocket)


