import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useUser } from "../contexts/UserContext";

export default function Messages({
  onSelectUser,
  selectedUser,
  onSelectGroup,
  selectedGroup,
  filteredUsers,
  setNumOfConversations
}) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const baseUrl = "http://localhost:3000";
  const { user } = useUser();
  const token = localStorage.getItem("accessToken");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const socket = io(baseUrl, {
      transports: ["websocket"],
      reconnection: false,
    });

    socket.on("connect", () => {
      console.log(
        "[Client] ✅ Socket connected successfully with id:",
        socket.id,
      );
      console.log("User: ", user);
    });

    socket.on("new_message", (message) => {
      if (
        selectedConversation &&
        selectedConversation._id === message.conversationId
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    fetchConversations();
    return () => {
      socket.disconnect();
    };
  }, [selectedConversation, user]);
  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage?.text) return "No messages yet";
    if (lastMessage.text.startsWith("<image")) return "Sent an image";
    return lastMessage.text;
  };
  const fetchConversations = () => {
    fetch(`${baseUrl}/chat/conversations/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("[Client] Conversations fetched:", data);
        setConversations(data);
        setNumOfConversations(data.length);
      })
      .catch((err) =>
        console.error("[Client] Error fetching conversations:", err),
      );
  };

  const selectConversation = (conv, event) => {
    setSelectedConversation(conv);
    const receiverId = conv.participants.find((p) => p !== user._id);
    if (event) {
      document
        .querySelectorAll(".conversation-item")
        .forEach((el) => el.classList.remove("active"));
      event.target.closest(".conversation-item")?.classList.add("active");
    }

    // Pass the selected user to ChatArea
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
      .then((data) => {
        console.log("[Client] Messages:", data);
        setMessages(data);
      })
      .catch((err) => console.error("[Client] Error fetching messages:", err));
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
          <div
            key={filteredUsers.id}
            className={`conversation-item cursor-pointer p-4 hover:bg-gray-100 ${
              selectedUser && selectedUser.id === filteredUsers.id
                ? "bg-gray-200"
                : ""
            }`}
            onClick={(e) => {
              onSelectUser(filteredUsers);
              selectConversation(filteredUsers, e);
            }}
          >
            <div className="flex items-center space-x-3">
              <img
                src={filteredUsers.avatar || "/placeholder.svg"}
                alt={filteredUsers.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-medium">{filteredUsers.name}</p>
                <p className="text-sm text-gray-500">Click to chat</p>
              </div>
            </div>
          </div>
        ) : filteredUsers &&
          Array.isArray(filteredUsers) &&
          filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`conversation-item cursor-pointer p-4 hover:bg-gray-100 ${
                selectedUser && selectedUser.id === user.id ? "bg-gray-200" : ""
              }`}
              onClick={(e) => {
                onSelectUser(user);
                selectConversation(user, e);
              }}
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
          ))
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`conversation-item cursor-pointer p-4 hover:bg-gray-200 ${
                selectedConversation &&
                selectedConversation._id === conversation._id
                  ? "bg-gray-100"
                  : ""
              }`}
              onClick={(e) => selectConversation(conversation, e)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={conversation.groupAvatar || "/placeholder.svg"}
                  alt={conversation.nameConversation}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{conversation.nameConversation}</p>
                  <p className="text-sm text-gray-500">
                    {getLastMessagePreview(conversation.lastMessage)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-gray-500">
            Không có cuộc trò chuyện nào
          </p>
        )}
      </div>
    </div>
  );
}
