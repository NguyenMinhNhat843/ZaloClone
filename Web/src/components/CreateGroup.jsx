import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import io from "socket.io-client";

export default function CreateGroup({ onClose }) {
  const [activeItem, setActiveItem] = useState("all");
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUser();
  const BaseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  // URL mặc định cho ảnh đại diện nhóm
  const DEFAULT_GROUP_AVATAR =
    "https://res.cloudinary.com/dz1nfbpra/image/upload/v1748070240/ZaloClone/chat_uploads/fb1_680131751578d0dca33bdebe.jpg.jpg";

  const userId = user?._id;
  let accessToken = localStorage.getItem("accessToken");

  // Hàm làm mới token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Không có refresh token. Vui lòng đăng nhập lại.");
    }

    try {
      const response = await axios.post(`${BaseURL}/auth/refresh`, {
        refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      const expiresInMinutes = 30;
      const expirationTime =
        new Date().getTime() + expiresInMinutes * 60 * 1000;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("tokenExpiry", expirationTime);

      return newAccessToken;
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
      throw new Error("Không thể làm mới token. Vui lòng đăng nhập lại.");
    }
  };

  // Hàm kiểm tra và làm mới token nếu cần
  const getValidToken = async () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (!accessToken) {
      throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
    }

    if (tokenExpiry && currentTime > tokenExpiry) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        throw error;
      }
    }

    return accessToken;
  };

  // Thiết lập kết nối Socket.IO và lắng nghe sự kiện groupCreated
  useEffect(() => {
    const newSocket = io(BaseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
      reconnection: true,
    });
    setSocket(newSocket);

    // Lắng nghe sự kiện groupCreated
    newSocket.on("groupCreated", ({ group }) => {
      console.log("[Client] Nhận groupCreated:", group);
      setIsLoading(false);
      navigate("/home"); // Điều hướng về trang chính
      onClose(); // Đóng modal
    });

    // Xử lý lỗi kết nối
    newSocket.on("connect_error", (error) => {
      setErrorMessage("Lỗi kết nối với server. Vui lòng thử lại.");
      setIsLoading(false);
      if (error.message.includes("đăng nhập")) {
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpiry");
          localStorage.removeItem("userId");
          navigate("/login");
        }, 2000);
      }
    });

    // Xử lý lỗi từ server (nếu server emit lỗi)
    newSocket.on("createGroupChatError", ({ message }) => {
      setErrorMessage(message || "Không thể tạo nhóm. Vui lòng thử lại.");
      setIsLoading(false);
    });

    return () => {
      newSocket.off("groupCreated");
      newSocket.off("connect_error");
      newSocket.off("createGroupChatError");
      newSocket.disconnect();
    };
  }, [accessToken, navigate, onClose]);

  // Lấy danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) {
        setErrorMessage(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        );
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const token = await getValidToken();

        const friendsResponse = await axios.post(
          `${BaseURL}/friendship/friends`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const friendships = friendsResponse.data;
        const friendIds = friendships.map((friendship) =>
          friendship.requester === userId
            ? friendship.recipient
            : friendship.requester,
        );

        const friendDetails = await Promise.all(
          friendIds.map(async (friendId) => {
            try {
              const userResponse = await axios.get(
                `${BaseURL}/users/${friendId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              const userData = userResponse.data;
              return {
                id: friendId,
                name: userData.name || "Unknown",
                avatar: userData.avatar || "/placeholder.svg",
              };
            } catch (error) {
              console.error(
                `Lỗi khi lấy thông tin người dùng ${friendId}:`,
                error,
              );
              return {
                id: friendId,
                name: "Unknown",
                avatar: "/placeholder.svg",
              };
            }
          }),
        );

        setFriends(friendDetails);
      } catch (error) {
        if (error.message.includes("đăng nhập")) {
          setErrorMessage(error.message);
          setTimeout(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("userId");
            navigate("/login");
          }, 2000);
        } else if (error.response?.status === 401) {
          setErrorMessage(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          );
          setTimeout(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("userId");
            navigate("/login");
          }, 2000);
        } else {
          setErrorMessage(
            error.response?.data?.message ||
              "Không thể tải danh sách bạn bè. Vui lòng thử lại.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [userId, navigate]);

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setGroupAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setErrorMessage("Vui lòng chọn một file ảnh hợp lệ (JPG, PNG, v.v.).");
      setGroupAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length < 2) {
      setErrorMessage("Vui lòng nhập tên nhóm và chọn ít nhất hai thành viên.");
      return;
    }

    if (!socket) {
      setErrorMessage("Không thể kết nối với server. Vui lòng thử lại.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      let groupAvatarUrl = DEFAULT_GROUP_AVATAR;

      // Upload ảnh đại diện nếu có
      if (groupAvatar && groupAvatar instanceof File) {
        const token = await getValidToken();
        const formData = new FormData();
        formData.append("groupAvatar", groupAvatar);

        const uploadResponse = await axios.post(
          `${BaseURL}/chat/conversations/group`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (uploadResponse.data.status === "success") {
          groupAvatarUrl =
            uploadResponse.data.data.groupAvatar || DEFAULT_GROUP_AVATAR;
        } else {
          setErrorMessage(
            "Không thể upload ảnh đại diện. Sử dụng ảnh mặc định.",
          );
        }
      }

      // Emit sự kiện createGroupChat
      socket.emit("createGroupChat", {
        groupName,
        members: selectedMembers,
        groupAvatar: groupAvatarUrl,
      });
    } catch (error) {
      setIsLoading(false);
      if (error.message.includes("đăng nhập")) {
        setErrorMessage(error.message);
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpiry");
          localStorage.removeItem("userId");
          navigate("/login");
        }, 2000);
      } else if (error.response?.status === 401) {
        setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpiry");
          localStorage.removeItem("userId");
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Không thể tạo nhóm. Vui lòng thử lại.",
        );
      }
    }
  };

  const filteredFriends = friends
    .filter((friend) => {
      if (activeItem === "all") return true;
      if (activeItem === "person1") return friend.name.includes("Nhân2");
      if (activeItem === "person2")
        return friend.name.includes("NguyenTrongBao");
      return true;
    })
    .filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-700">Tạo nhóm</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 flex items-center space-x-4">
            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#2a2a2a]">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Group Avatar Preview"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <img
                  src={DEFAULT_GROUP_AVATAR}
                  alt="Default Group Avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
            </label>
            <input
              type="text"
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 rounded bg-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded bg-gray-200 py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <h3 className="mb-2 text-sm text-gray-400">Danh sách bạn bè</h3>
            {errorMessage && (
              <p className="mb-2 text-red-500">{errorMessage}</p>
            )}
            {isLoading ? (
              <p className="text-white">Đang tải...</p>
            ) : filteredFriends.length === 0 && !errorMessage ? (
              <p className="text-white">Không tìm thấy bạn bè nào.</p>
            ) : (
              filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center space-x-3 py-2"
                >
                  <input
                    type="checkbox"
                    id={`friend-${friend.id}`}
                    checked={selectedMembers.includes(friend.id)}
                    onChange={() => toggleMember(friend.id)}
                    className="h-5 w-5 rounded-full border-gray-300 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />

                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <label
                    htmlFor={`friend-${friend.id}`}
                    className="cursor-pointer text-gray-700"
                  >
                    {friend.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleCreateGroup}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={!groupName || selectedMembers.length === 0 || isLoading}
          >
            {isLoading ? "Đang tạo..." : "Tạo nhóm"}
          </button>
        </div>
      </div>
    </div>
  );
}
