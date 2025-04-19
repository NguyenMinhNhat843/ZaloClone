import { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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

  // ================== Lấy danh sách cuộc trò chuyện ==================
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

  useEffect(() => {
    if (user?._id) {
      fetchConversations();
    } else {
      console.warn(
        "[Client] User ID is not available. Fetching conversations failed.",
      );
    }
  }, [user?._id]);

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
            conv.participants.includes(receiverId)),
      );

      if (!targetConversation) {
        console.warn("Conversation not found. Refetching...");
        fetchConversations();
        return;
      }

      message.conversationId = targetConversation._id;

      if (
        selectedConversation &&
        selectedConversation._id === targetConversation._id
      ) {
        setMessages((prev) => [...prev, message]);
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conv) =>
          conv._id === targetConversation._id
            ? { ...conv, lastMessage: message }
            : conv,
        );
        return updatedConversations.sort(
          (a, b) =>
            new Date(b.lastMessage?.createdAt || 0) -
            new Date(a.lastMessage?.createdAt || 0),
        );
      });
    },
    [conversations, selectedConversation],
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
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new_message", handleMessage);
        socketRef.current.off("receiveMessage", handleMessage);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // }, [user?._id, fetchConversations, handleMessage]);
  }, [user?._id]);

  const handleUserClick = async (userObj, event) => {
    try {
      const res = await fetch(
        `${baseUrl}/chat/conversations/user/${userObj._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

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

    // Kiểm tra participants an toàn
    const receiverId =
      Array.isArray(conv.participants) && conv.participants.length >= 2
        ? conv.participants.find((p) => p !== user._id)
        : null;

    if (!receiverId) {
      console.warn("Không tìm thấy receiverId trong conversation:", conv);
      return;
    }

    if (event) {
      document
        .querySelectorAll(".conversation-item")
        .forEach((el) => el.classList.remove("active"));
      event.target.closest(".conversation-item")?.classList.add("active");
    }

    onSelectUser({
      id: receiverId,
      name: conv.name || "Unknown",
      avatar: conv.avatar || "/placeholder.svg",
      conversationId: conv._id,
    });

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

Messages.propTypes = {
  onSelectUser: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onSelectGroup: PropTypes.func.isRequired,
  selectedGroup: PropTypes.object,
  filteredUsers: PropTypes.array.isRequired,
  setNumOfConversations: PropTypes.func.isRequired,
};
