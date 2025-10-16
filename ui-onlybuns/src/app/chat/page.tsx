"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { myChats, createGroupChat, addMember, removeMember, fetchHistory, sendMessage as sendMessageApi, createPrivateChat } from "../lib/api";
import { RegisteredUser  } from "../types/Post";
import { Chat, Message } from "../types/Chat";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userIdToAdd, setUserIdToAdd] = useState<number | "">("");
  const [userIdToRemove, setUserIdToRemove] = useState<number | "">("");
  const wsRef = useRef<WebSocket | null>(null);
  const [groupName, setGroupName] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("access_token") ?? "" : ""), []);

  useEffect(() => {
    (async () => {
      try {
        setChats(await myChats(token));
      } catch (e) {
        console.error("Failed to load chats:", e);
      }
    })();
  }, [token]);

  //izabereš chat — učitaj istoriju i otvori WS
  useEffect(() => {
    if (!activeChat || !token) return;

    (async () => {
      try {
        const hist = await fetchHistory(token, activeChat.id, 50);
        setMessages(hist);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    })();

    const ws = new WebSocket(`ws://localhost:8000/chats/ws/chats/${activeChat.id}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => console.log(`Connected to chat ${activeChat.id}`);
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.type === "message") {
        setMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
    });      }
    };
    ws.onclose = () => {
      console.log("WebSocket closed");
      wsRef.current = null;
    };

    return () => ws.close();
  }, [activeChat, token]);
 
  const handleCreatePrivateChat = async () => {
  if (!userIdInput.trim()) return alert("Enter user ID.");
  try {
    await createPrivateChat(Number(userIdInput), token);
    const updated = await myChats(token);
    setChats(updated);
    const newChat = updated.find((c: Chat) =>
      !c.is_group &&
      c.members?.some((m: RegisteredUser) => m.id === Number(userIdInput))
    );
    if (newChat) setActiveChat(newChat);
    setUserIdInput("");
  } catch (err) {
    console.error(err);
    alert("Failed to create private chat.");
  }
};

    const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket not open, retrying in 500ms...");
        setTimeout(sendMessage, 500);        
        return;
    }
    ws.send(JSON.stringify({ type: "message", content: input.trim() }));
    setInput("");
    };


  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert("Enter group name first.");
    try {
        await createGroupChat(groupName, [], token);
        const updated = await myChats(token);
        setChats(updated);
        const newChat = updated.find((c: Chat) => c.name === groupName);
        if (newChat) setActiveChat(newChat);
        setGroupName("");
    } catch (err) {
        console.error("Failed to create group:", err);
        alert("Failed to create group chat.");
    }
    };

  const handleAddMember = async () => {
    if (!activeChat || userIdToAdd === "") return;
    await addMember(activeChat.id, Number(userIdToAdd), token);
    setUserIdToAdd("");
    const updatedChats = await myChats(token);
    const updatedChat = updatedChats.find((c: Chat) => c.id === activeChat.id);
    if (updatedChat) setActiveChat(updatedChat);
    alert("Member added");
  };

  const handleRemoveMember = async () => {
    if (!activeChat || userIdToRemove === "") return;
    await removeMember(activeChat.id, Number(userIdToRemove), token);
    setUserIdToRemove("");
    alert("Member removed");
  };

  function getCurrentUserId(): number | null {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return Number(payload.sub);
    } catch {
        return null;
      }
    }

return (
  <div className="min-h-screen bg-green-50 text-green-900 p-6">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Sidebar — Groups & Private Chats */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col">
        <div className="space-y-4 mb-4">
          {/* Create group */}
          <div>
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-2"
            />
            <button
              onClick={handleCreateGroup}
              className="w-full px-3 py-2 bg-green-200 rounded hover:bg-green-300"
            >
              + Create Group
            </button>
          </div>

          {/* Private chat */}
          <div>
            <input
              type="number"
              placeholder="User ID"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-2"
            />
            <button
              onClick={handleCreatePrivateChat}
              className="w-full px-3 py-2 bg-blue-200 rounded hover:bg-blue-300"
            >
              ✉️ Private Chat
            </button>
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map((c: Chat) => (
            <button
              key={c.id}
              onClick={() => setActiveChat(c)}
              className={`w-full text-left p-3 rounded transition ${
                activeChat?.id === c.id
                  ? "bg-green-100"
                  : "hover:bg-green-50"
              }`}
            >
              <div className="font-semibold truncate">
                {c.is_group
                  ? c.name ?? `Group #${c.id}`
                  : c.members?.find(
                      (m: RegisteredUser) =>
                        Number(m.id) !== getCurrentUserId()
                    )?.username ?? "Direct"}
              </div>
              <div className="text-xs text-gray-500">
                {c.is_group ? "Group" : "Direct"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="md:col-span-2 bg-white rounded-xl shadow p-4 flex flex-col">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between border-b pb-3 mb-3 gap-2">
              <div>
                <div className="text-xl font-bold">
                  {activeChat.is_group
                    ? activeChat.name ?? `Group #${activeChat.id}`
                    : activeChat.members?.find(
                        (m) => m.id !== getCurrentUserId()
                      )?.username ?? "Direct chat"}
                </div>
                {activeChat.is_group && (
                    <div className="text-sm text-gray-500 mt-1">
                    Members:{" "}
                    {activeChat.members
                        ?.map((m) => m.username)
                        .join(", ") || "No members"}
                    </div>
                )}
              </div>

              {activeChat.is_group && (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    placeholder="User ID to add"
                    value={userIdToAdd}
                    onChange={(e) =>
                      setUserIdToAdd(e.target.value ? Number(e.target.value) : "")
                    }
                    className="border rounded px-2 py-1 w-32"
                  />
                  <button
                    onClick={handleAddMember}
                    className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
                  >
                    Add
                  </button>

                  <input
                    type="number"
                    placeholder="User ID to remove"
                    value={userIdToRemove}
                    onChange={(e) =>
                      setUserIdToRemove(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="border rounded px-2 py-1 w-32"
                  />
                  <button
                    onClick={handleRemoveMember}
                    className="px-3 py-1 bg-red-200 rounded hover:bg-red-300"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 border rounded p-3">
            {messages.map((m) => (
                <div key={m.id} className="p-2 rounded border bg-gray-50">
                <div className="text-xs text-gray-500">
                    {activeChat ? resolveSenderUsername(m.sender_id, activeChat) : `User ${m.sender_id}`} •{" "}
                    {new Date(m.created_at).toLocaleString()}
                </div>
                <div className="mt-1">{m.content}</div>
                </div>
            ))}
            </div>

            {/* Message input */}
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-green-200 rounded hover:bg-green-300"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 grid place-items-center text-gray-500">
            Select a chat or create a group
          </div>
        )}
      </div>
    </div>
  </div>
);


}

function resolveSenderUsername(senderId: number, chat: Chat): string {
  const sender = chat.members?.find((u) => u.id === senderId);
  return sender ? sender.username : `User ${senderId}`;
}

