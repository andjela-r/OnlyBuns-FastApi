from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP, text, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.db.base import Base

class ChatMember(Base):
    __tablename__ = "chat_member"

    chat_id = Column(Integer, ForeignKey("chat.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, ForeignKey("registereduser.id", ondelete="CASCADE"), primary_key=True)
    is_group_admin = Column(Boolean, default=False)
    joined_at = Column(TIMESTAMP, server_default=text("NOW()"))

    chat = relationship("Chat", back_populates="chat_members", overlaps="chats, members")
    user = relationship("User", back_populates="chat_members", overlaps="chats, members")

    __table_args__ = (
        UniqueConstraint("chat_id", "user_id", name="uq_chat_member"),
        Index("ix_chat_member_user", "user_id"),
    )


class Chat(Base):
    __tablename__ = "chat"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120))
    is_group = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("registereduser.id"))
    created_at = Column(TIMESTAMP, server_default=text("NOW()"))

    chat_members = relationship("ChatMember", back_populates="chat", cascade="all, delete-orphan")
    members = relationship("User", secondary="chat_member", viewonly=True)
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "message"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chat.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("registereduser.id"), nullable=False)
    content = Column(String(2000), nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("NOW()"))

    chat = relationship("Chat", back_populates="messages")
