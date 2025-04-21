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
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { user } = useUser();
  const token = localStorage.getItem("accessToken");
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Xử lý tin nhắn từ socket
  const handleMessage = useCallback(
    (message) => {
      console.log("[Client] 📩 Nhận được tin nhắn:", message);
      const { senderId, receiverId, conversationId } = message;

      let targetConversation = conversations.find(
        (conv) =>
          conv._id === conversationId ||
          (Array.isArray(conv.participants) &&
            conv.participants.includes(senderId) &&
            conv.participants.includes(receiverId))
      );

      if (!targetConversation) {
        console.warn("Không tìm thấy cuộc hội thoại. Tải lại...");
        fetchAllConversations();
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
            new Date(b.lastMessage?.createdAt || 0) -
            new Date(a.lastMessage?.createdAt || 0)
        );
      });
    },
    [conversations, selectedConversation]
  );

  // Fetch tất cả conversation và bạn bè
  const fetchAllConversations = useCallback(async () => {
    try {
      // Fetch danh sách conversation từ API
      const convRes = await fetch(`${baseUrl}/chat/conversations/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convData = await convRes.json() || [];

      // Fetch danh sách bạn bè
      const friendRes = await fetch(`${baseUrl}/friendship/friends`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!friendRes.ok) throw new Error("Lỗi khi lấy danh sách bạn bè");
      const friendsData = await friendRes.json();

      // Chuyển đổi bạn bè thành conversation
      const friendConversations = await Promise.all(
        friendsData.map(async (friendship) => {
          console.log("Friends: ",friendship);
          const friendId = friendship.requester === user._id ? friendship.recipient : friendship.requester;

          const userRes = await fetch(`${baseUrl}/users/${friendId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!userRes.ok) {
            console.error(`Lỗi khi lấy thông tin người dùng ${friendId}`);
            return null;
          }

          const userInfo = await userRes.json();
          console.log("Info User Friend: ",userInfo);
          return {
            _id: `${friendId}`,
            participants: [user._id, friendId],
            nameConversation: userInfo.name || "Không xác định",
            groupAvatar: userInfo.avatar || "/placeholder.svg",
            type: "private",
            lastMessage: null,
            createdAt: friendship.createdAt,
            updatedAt: friendship.updatedAt,
          };
        })
      );

      console.log("List Convs: ",convData);friendConversations
      console.log("List friendConversations: ",friendConversations);
      
      const mergedConversations = [
        ...convData,
        ...friendConversations
      ].sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || b.updatedAt || 0) -
          new Date(a.lastMessage?.createdAt || a.updatedAt || 0)
      );
      console.log("List mergedConversations: ",mergedConversations);
      setConversations(mergedConversations);
      setNumOfConversations(mergedConversations.length);
    } catch (err) {
      console.error("[Client] Lỗi khi lấy danh sách hội thoại hoặc bạn bè:", err);
      navigate("/login");
    }
  }, [user, token, navigate, setNumOfConversations]);

  // Khởi tạo socket
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    socketRef.current = io(baseUrl, {
      transports: ["websocket"],
      reconnection: true,
      auth: { token: accessToken },
    });

    socketRef.current.on("connect", () => {
      console.log("[Client] Socket đã kết nối:", socketRef.current.id);
    });

    socketRef.current.on("friendshipUpdated", async () => {
      console.log("[Client] Sự kiện friendshipUpdated được nhận, cập nhật danh sách bạn bè...");
      try {
        const friendRes = await fetch(`${baseUrl}/friendship/friends`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!friendRes.ok) throw new Error("Lỗi khi lấy danh sách bạn bè");
        const friendsData = await friendRes.json();

        const uniqueFriendships = [];
        const seenPairs = new Set();
        for (const friendship of friendsData) {
          if (friendship.requester === friendship.recipient) continue;
          const pairKey = [friendship.requester, friendship.recipient].sort().join("-");
          if (!seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);
            uniqueFriendships.push(friendship);
          }
        }

        const friendConversations = await Promise.all(
          uniqueFriendships.map(async (friendship) => {
            const friendId =
              friendship.requester === user._id ? friendship.recipient : friendship.requester;

            const userRes = await fetch(`${baseUrl}/users/${friendId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!userRes.ok) {
              console.error(`Lỗi khi lấy thông tin người dùng ${friendId}`);
              return null;
            }

            const userInfo = await userRes.json();
            return {
              _id: `friend_${friendId}`,
              participants: [user._id, friendId],
              nameConversation: userInfo.name || "Không xác định",
              groupAvatar: userInfo.avatar || "/placeholder.svg",
              type: "private",
              lastMessage: null,
              createdAt: friendship.createdAt,
              updatedAt: friendship.updatedAt,
            };
          })
        );

        const validFriendConversations = friendConversations.filter((conv) => conv !== null);

        setConversations((prevConversations) => {
          const updatedConversations = [
            ...prevConversations.filter((conv) => !conv._id.startsWith("friend_")),
            ...validFriendConversations.filter(
              (friendConv) =>
                !prevConversations.some((conv) =>
                  conv.participants.includes(friendConv.participants[1])
                )
            ),
          ].sort(
            (a, b) =>
              new Date(b.lastMessage?.createdAt || b.updatedAt || 0) -
              new Date(a.lastMessage?.createdAt || a.updatedAt || 0)
          );

          return updatedConversations;
        });
      } catch (err) {
        console.error("[Client] Lỗi khi cập nhật danh sách bạn bè từ socket:", err);
      }
    });

    socketRef.current.on("message", handleMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("friendshipUpdated");
        socketRef.current.off("message");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id, fetchConversations]);

  // Fetch conversation khi user._id thay đổi
  useEffect(() => {
    if (user?._id) {
      fetchAllConversations();
    }
  }, [user?._id, fetchAllConversations,handleMessage]);

  // Xử lý khi click vào user
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
      console.error("Lỗi khi lấy hội thoại từ người dùng tìm kiếm:", err);
      navigate("/login");
    }
  };

  // Chọn conversation
  const selectConversation = (conv, event) => {
    if (!conv || !conv._id) {
      console.warn("Dữ liệu hội thoại không hợp lệ:", conv);
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

      if (!receiverId) {
        console.warn("Không tìm thấy receiverId trong hội thoại:", conv);
        return;
      }

      onSelectUser({
        id: receiverId,
        name: conv.nameConversation || "Không xác định",
        avatar: conv.groupAvatar || "/placeholder.svg",
        conversationId: conv._id,
      });
    }

    if (!conv._id.startsWith("temp_") && !conv._id.startsWith("friend_")) {
      fetch(`${baseUrl}/chat/messages/${conv._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Lỗi khi lấy tin nhắn:", err));
    } else {
      setMessages([]);
    }
  };

  // Lấy nội dung preview của tin nhắn cuối
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

  // Cuộn chat box xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Debug danh sách conversation
  useEffect(() => {
    console.log("[Client] Conversations updated:", conversations);
  }, [conversations]);

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
              className={`conversation-item cursor-pointer p-4 hover:bg-gray-200 ${
                selectedConversation && selectedConversation._id === conv._id ? "bg-gray-100" : ""
              }`}
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