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
      console.error("[Client] Error fetching conversations:", err);
    }
  }, [user, token]);

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
    }

    if (user?._id) {
      fetchConversations();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchConversations, user]);

  const selectConversation = async (convOrUser, event) => {
    if (!convOrUser || !user?._id) {
      console.warn("Dữ liệu không hợp lệ hoặc người dùng chưa đăng nhập:", convOrUser);
      return;
    }

    let conv = convOrUser;

    // Trường hợp chọn người dùng từ tìm kiếm (filteredUsers)
    if (!conv._id) {
      console.log("[Messages] Xử lý người dùng từ tìm kiếm:", convOrUser);
      try {
        const res = await fetch(
          `${baseUrl}/chat/conversations/user/${convOrUser._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const conversations = await res.json();

        if (Array.isArray(conversations) && conversations.length > 0) {
          conv = conversations[0]; // Chọn cuộc trò chuyện đầu tiên
        } else {
          // Tạo cuộc trò chuyện tạm thời
          conv = {
            _id: `temp_${convOrUser._id}`,
            participants: [user._id, convOrUser._id],
            nameConversation: convOrUser.name || "Unknown User",
            groupAvatar: convOrUser.avatar || "/placeholder.svg",
            type: "private",
            lastMessage: null,
          };
        }
      } catch (err) {
        console.error("Lỗi khi lấy conversation từ người dùng tìm kiếm:", err);
        alert("Không thể tải cuộc trò chuyện. Vui lòng thử lại.");
        return;
      }
    }

    // Cập nhật trạng thái cuộc trò chuyện được chọn
    setSelectedConversation(conv);
    console.log("[selectConversation] conv:", conv);
    console.log("[selectConversation] conv.participants:", conv.participants);
    // Kiểm tra participants an toàn
    const receiverId =
      Array.isArray(conv.participants) && conv.participants.length >= 2
        ? conv.participants?.find((p) => p !== user._id)
        : null;
        console.log("[selectConversation] user._id:", user._id);
        console.log("[selectConversation] receiverId:", receiverId);
    if (!receiverId) {
      console.warn("Không tìm thấy receiverId trong conversation:", conv);
      return;
    }

    // Cập nhật giao diện
    if (event) {
      document
        .querySelectorAll(".conversation-item")
        .forEach((el) => el.classList.remove("active"));
      event.target.closest(".conversation-item")?.classList.add("active");
    }

    // Thông báo cho component cha về người dùng được chọn
    onSelectUser({
      id: receiverId,
      name: conv.nameConversation || conv.name || "Unknown User",
      avatar: conv.groupAvatar || conv.avatar || "/placeholder.svg",
      conversationId: conv._id,
    });

    // Lấy tin nhắn hoặc đặt messages rỗng
    if (!conv._id.startsWith("temp_")) {
      try {
        const res = await fetch(`${baseUrl}/chat/messages/${conv._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.warn("Dữ liệu tin nhắn không phải mảng:", data);
          setMessages([]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy tin nhắn:", err);
        setMessages([]);
      }
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

    return (
      prefix +
      (plainText.length > 50 ? plainText.slice(0, 47) + "..." : plainText)
    );
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

        {filteredUsers ? (
          <UserItem
            user={filteredUsers}
            selectedUser={selectedUser}
            onClick={(e) => selectConversation(filteredUsers, e)}
          />
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className={`conversation-item cursor-pointer p-4 hover:bg-gray-200 ${
                selectedConversation && selectedConversation._id === conv._id
                  ? "bg-gray-100"
                  : ""
              }`}
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

                {conv.unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {conv.unreadCount}
                  </span>
                )}
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

function UserItem({ user, selectedUser, onClick }) {
  return (
    <div
      className={`conversation-item cursor-pointer p-4 hover:bg-gray-100 ${
        selectedUser && selectedUser.id === user._id ? "bg-gray-200" : ""
      }`}
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