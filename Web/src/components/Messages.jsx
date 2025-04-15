import React, { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Messages({
  onSelectUser,
  selectedUser,
  onSelectGroup,
  selectedGroup,
  filteredUsers,
  setNumOfConversations,
}) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const baseUrl = "http://localhost:3000";
  const { user } = useUser();
  const token = localStorage.getItem("accessToken");
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/chat/conversations/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(data);
      setNumOfConversations(data.length);
    } catch (err) {
      navigate("/login");
      console.error("[Client] Error fetching conversations:", err);
    }
  }, [user, token, navigate, setNumOfConversations]);

  // Handle message socket
  const handleMessage = useCallback(
    (message) => {
      console.log("[Client] 📩 Received message:", message);
      const { senderId, receiverId } = message;

      const conversation = conversations.find((conv) =>
        conv.participants.includes(senderId) && conv.participants.includes(receiverId)
      );

      const conversationId = conversation?._id;
      if (!conversationId) {
        console.warn("Conversation not found. Refetching...");
        fetchConversations();
        return;
      }

      message.conversationId = conversationId;

      // Cập nhật messages nếu đang ở đúng conversation
      if (selectedConversation && selectedConversation._id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // Cập nhật conversations để hiển thị tin nhắn mới nhất bên trái
      setConversations((prev) => {
        const updatedConversations = prev.map((conv) =>
          conv._id === conversationId ? { ...conv, lastMessage: message } : conv
        );
        // Sắp xếp lại để cuộc trò chuyện mới nhất lên đầu
        return updatedConversations.sort(
          (a, b) =>
            new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)
        );
      });
    },
    [conversations, selectedConversation, fetchConversations]
  );

  // Setup socket
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(baseUrl, {
        transports: ["websocket"],
        reconnection: false,
      });

      socketRef.current.on("connect", () => {
      });

      socketRef.current.on("new_message", handleMessage);
      socketRef.current.on("receiveMessage", handleMessage);
    }

    if (user?._id) {
      fetchConversations();
    }

    // Cleanup: Gỡ các sự kiện khi component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("new_message", handleMessage);
        socketRef.current.off("receiveMessage", handleMessage);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id, fetchConversations, handleMessage]);

  const selectConversation = (conv, event) => {
    setSelectedConversation(conv);
    const receiverId = conv.participants.find((p) => p !== user._id);

    if (event) {
      document.querySelectorAll(".conversation-item").forEach((el) =>
        el.classList.remove("active")
      );
      event.target.closest(".conversation-item")?.classList.add("active");
    }

    onSelectUser({
      id: receiverId,
      name: conv.nameConversation || "Unknown",
      avatar: conv.groupAvatar || "/placeholder.svg",
      conversationId: conv._id,
    });

    fetch(`${baseUrl}/chat/messages/${receiverId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage?.text && !lastMessage?.content) return "No messages yet";
    const content = lastMessage.text || lastMessage.content;
  
    if (typeof content !== "string") return "Sent a message";
    if (content.startsWith("<image")) return "Sent an image";
    if (content.startsWith("<file"))
      return `Sent a file: ${content.match(/name='(.*?)'/)?.[1] || "file"}`;
    if (content.startsWith("<sticker")) return "Sent a sticker";
    if (content.startsWith("http")) return "Sent a link";
    
    const div = document.createElement("div");
    div.innerHTML = content;
    const plainText = div.textContent || div.innerText || content;
    const prefix = lastMessage.sender === user._id ? "You: " : "Other: ";
  
    return prefix + (plainText.length > 50 ? plainText.slice(0, 47) + "..." : plainText);
  };
  

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mb-4">
        <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">
          Direct Messages
        </h3>

        {filteredUsers && !Array.isArray(filteredUsers) ? (
          <UserItem user={filteredUsers} selectedUser={selectedUser} onClick={selectConversation} />
        ) : Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserItem key={user.id} user={user} selectedUser={selectedUser} onClick={selectConversation} />
          ))
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className={`conversation-item cursor-pointer p-4 hover:bg-gray-200 ${selectedConversation && selectedConversation._id === conv._id ? "bg-gray-100" : ""}`}
              onClick={(e) => selectConversation(conv, e)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={conv.groupAvatar || "/placeholder.svg"}
                  alt={conv.nameConversation}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{conv.nameConversation}</p>
                  <p className="text-sm text-gray-500">
                    {getLastMessagePreview(conv.lastMessage)}
                  </p>
                </div>
                
                {/* Hiển thị số tin nhắn chưa đọc nếu có */}
                {conv.unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-gray-500">Không có cuộc trò chuyện nào</p>
        )}
      </div>
    </div>
  );
}

function UserItem({ user, selectedUser, onClick }) {
  return (
    <div
      className={`conversation-item cursor-pointer p-4 hover:bg-gray-100 ${selectedUser && selectedUser.id === user.id ? "bg-gray-200" : ""}`}
      onClick={(e) => onClick(user, e)}
    >
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">Click to chat</p>
        </div>
      </div>
    </div>
  );
}
