import React, { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react"; // Thêm icon để hiển thị nhóm

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
      const { senderId, receiverId, conversationId } = message;

      let targetConversation = conversations.find(
        (conv) =>
          conv._id === conversationId ||
          (Array.isArray(conv.participants) &&
            conv.participants.includes(senderId) &&
            conv.participants.includes(receiverId))
      );

      if (!targetConversation) {
        console.warn("Conversation not found. Refetching...");
        fetchConversations();
        return;
      }

      message.conversationId = targetConversation._id;

      if (selectedConversation && selectedConversation._id === targetConversation._id) {
        setMessages((prev) => [...prev, message]);
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conv) =>
          conv._id === targetConversation._id ? { ...conv, lastMessage: message } : conv
        );
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
      const accessToken = localStorage.getItem("accessToken");
      socketRef.current = io(baseUrl, {
        transports: ["websocket"],
        reconnection: true,
        auth: { token: accessToken },
      });

      socketRef.current.on("connect", () => {
        console.log("[Client] Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("new_message", handleMessage);
      socketRef.current.on("receiveMessage", handleMessage);

      // Lắng nghe sự kiện cập nhật thông tin nhóm
      socketRef.current.on("groupInfoUpdated", ({ group }) => {
        const updated = group.conversation || group;

        console.log("[Client] Nhận groupInfoUpdated:", updated);

        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === updated._id
              ? {
                ...conv,
                groupName: updated.groupName || conv.groupName,
                groupAvatar: updated.groupAvatar || conv.groupAvatar,
              }
              : conv
          )
        );
        // Cập nhật selectedConversation nếu nó là nhóm đã cập nhật
        setSelectedConversation((prev) =>
          prev && prev._id === updated._id
            ? {
              ...prev,
              groupName: updated.groupName || prev.groupName,
              groupAvatar: updated.groupAvatar || prev.groupAvatar,
            }
            : prev
        );
        // Cập nhật selectedGroup nếu nó là nhóm đã cập nhật
        if (selectedGroup && selectedGroup.id === updated._id) {
          onSelectGroup((prev) => ({
            ...prev,
            name: updated.groupName || prev.name,
            avatar: updated.groupAvatar || prev.avatar,
          }));
        }

      });

      // Lăng nghe sự kiện thành viên được thêm vào nhóm
      socketRef.current.on("membersAdded", ({ group }) => {
        console.log("[Client] Nhận membersAdded:", group);
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === group._id ? { ...conv, participants: group.participants } : conv
          )
        );
        // Cập nhật selectedConversation nếu nó là nhóm đã cập nhật
        setSelectedConversation((prev) =>
          prev && prev._id === group._id ? { ...prev, participants: group.participants } : prev
        );

        if (selectedGroup && selectedGroup.id === group._id) {
          onSelectGroup((prev) => ({
            ...prev,
            participants: group.participants,
          }));
        }
      });
      // Lắng nghe sự kiện thành viên bị xóa khỏi nhóm
      socketRef.current.on("membersRemoved", ({ group }) => {
        console.log("[Client] Nhận membersRemoved:", group);
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === group._id ? { ...conv, participants: group.participants } : conv
          )
        );
        // Cập nhật selectedConversation nếu nó là nhóm đã cập nhật
        setSelectedConversation((prev) =>
          prev && prev._id === group._id ? { ...prev, participants: group.participants } : prev
        );
      });
      // Lắng nghe sự kiện tạo nhóm mới
      socketRef.current.on("groupCreated", (group) => {
        console.log("[Client] Nhận groupCreated:", group);
        setConversations((prev) => [...prev, group]);
      });


    }

    if (user?._id) {
      fetchConversations();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new_message", handleMessage);
        socketRef.current.off("receiveMessage", handleMessage);
        socketRef.current.off("groupInfoUpdated");

        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id, fetchConversations]);

  const handleUserClick = async (userObj, event) => {
    try {
      const res = await fetch(`${baseUrl}/chat/conversations/user/${userObj._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const conv = await res.json();

      if (Array.isArray(conv) && conv.length > 0) {
        selectConversation(conv[0], event);
      } else {
        const tempConversation = {
          _id: `temp_${userObj._id}`,
          participants: [user._id, userObj._id],
          nameConversation: userObj.name,
          groupAvatar: userObj.avatar || "/placeholder.svg",
          type: "private",
          lastMessage: null,
        };

        setSelectedConversation(tempConversation);
        onSelectUser({
          id: userObj._id,
          name: userObj.name,
          avatar: userObj.avatar || "/placeholder.svg",
          conversationId: tempConversation._id,
        });
      }
    } catch (err) {
      console.error("Lỗi khi lấy conversation từ người dùng search:", err);
      navigate("/login");
    }
  };

  const selectConversation = (conv, event) => {
    if (!conv || !conv._id) {
      console.warn("Dữ liệu conversation không hợp lệ:", conv);
      return;
    }

    setSelectedConversation(conv);

    // Thêm class active cho giao diện
    if (event) {
      document.querySelectorAll(".conversation-item").forEach((el) =>
        el.classList.remove("active")
      );
      event.target.closest(".conversation-item")?.classList.add("active");
    }

    // Xử lý dựa trên type của conversation
    if (conv.type === "group") {
      onSelectGroup({
        id: conv._id,
        name: conv.groupName,
        avatar: conv.groupAvatar || "/placeholder.svg",
        conversationId: conv._id,
        participants: conv.participants || [], // ✅ Thêm dòng này
      });
    } else {
      // Nếu là chat cá nhân, tìm receiverId
      const receiverId = Array.isArray(conv.participants) && conv.participants.length >= 2
        ? conv.participants.find((p) => p !== user._id)
        : null;

      if (!receiverId) {
        console.warn("Không tìm thấy receiverId trong conversation:", conv);
        return;
      }

      onSelectUser({
        id: receiverId,
        name: conv.nameConversation || "Unknown",
        avatar: conv.groupAvatar || "/placeholder.svg",
        conversationId: conv._id,
      });
    }

    // Chỉ fetch tin nhắn nếu không phải conversation tạm
    if (!conv._id.startsWith("temp_")) {
      fetch(`${baseUrl}/chat/messages/${conv._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Error fetching messages:", err));
    } else {
      setMessages([]);
    }
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage?.text && !lastMessage?.content) return "Chưa có tin nhắn";
    const content = lastMessage.text || lastMessage.content;

    if (typeof content !== "string") return "Đã gửi một tin nhắn";
    if (content.startsWith("<image")) return "Đã gửi một hình ảnh";
    if (content.startsWith("<file"))
      return `Đã gửi một tệp: ${content.match(/name='(.*?)'/)?.[1] || "tệp"}`;
    if (content.startsWith("<sticker")) return "Đã gửi một nhãn dán";
    if (content.startsWith("http")) return "Đã gửi một liên kết";

    const div = document.createElement("div");
    div.innerHTML = content;
    const plainText = div.textContent || div.innerText || content;
    const prefix = lastMessage.sender === user._id ? "Bạn: " : "Người khác: ";

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
          Tin nhắn trực tiếp
        </h3>

        {filteredUsers && !Array.isArray(filteredUsers) ? (
          <UserItem
            user={filteredUsers}
            selectedUser={selectedUser}
            onClick={(e) => handleUserClick(filteredUsers, e)}
          />
        ) : Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              selectedUser={selectedUser}
              onClick={(e) => handleUserClick(user, e)}
            />
          ))
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className={`conversation-item cursor-pointer p-4 hover:bg-gray-200 ${selectedConversation && selectedConversation._id === conv._id ? "bg-gray-100" : ""}`}
              onClick={(e) => selectConversation(conv, e)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conv.groupAvatar || "/placeholder.svg"}
                    alt={conv.type === "group" ? conv.groupName : conv.nameConversation}
                    className="h-12 w-12 rounded-full"
                  />
                  {conv.type === "group" && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {conv.type === "group" ? conv.groupName : conv.nameConversation}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getLastMessagePreview(conv.lastMessage)}
                  </p>
                </div>

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
      className={`conversation-item cursor-pointer p-4 hover:bg-gray-100 ${selectedUser && selectedUser.id === user._id ? "bg-gray-200" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">Nhấn để trò chuyện</p>
        </div>
      </div>
    </div>
  );
}