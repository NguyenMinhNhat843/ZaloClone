import React, { useState, useEffect } from "react";
import { AlertTriangle, Share2, Slash, Users, X } from "lucide-react";

export default function AddFriend({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("search");
  const [statusSend, setStatusSend] = useState(false);

  const currentUserPhone = localStorage.getItem("userPhone");
  const token = localStorage.getItem("accessToken");

  const handleSendRequest = async (userReceive) => {
    try {
      const res = await fetch(
        `http://localhost:3000/friendship/request/${userReceive?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Data user request add:", data);

      if (res.ok) {
        setStatusSend(true); // Update state on successful request
        alert("Đã gửi lời mời kết bạn.");
      } else {
        alert("Gửi lời mời kết bạn thất bại.");
      }
    } catch (error) {
      alert("Gửi lời mời kết bạn thất bại.");
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setFilteredUsers(null);
        return;
      }

      if (searchQuery === currentUserPhone) {
        setFilteredUsers(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Data user in Search:", data);

        if (res.ok && data && data.phone !== currentUserPhone) {
          setFilteredUsers(data);
        } else {
          setFilteredUsers(null);
        }
      } catch (err) {
        console.error("Lỗi khi tìm user theo sdt:", err);
        setFilteredUsers(null);
        setError("Không thể tìm kiếm người dùng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const formattedDOB = new Date(filteredUsers?.dateOfBirth).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value.trim());
  };

  const handleSearchClick = () => {
    console.log("[AddFriend] data:", filteredUsers);
    if (filteredUsers) {
      setView("profile");
    }
  };

  const handleBackToSearch = () => {
    setView("search");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg transition-transform duration-300">
        {view === "search" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-black">Thêm bạn</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            {/* Phone Input */}
            <div className="p-4">
              <div className="mb-6 flex items-center space-x-2">
                <div className="flex items-center space-x-1 rounded bg-gray-100 px-3 py-2 text-black">
                  <img src="/upload/logo-VN.jpg" alt="VN" className="h-7 w-7" />
                  <span>(+84)</span>
                </div>
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="flex-1 rounded bg-gray-100 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-2 border-t border-gray-200 p-4">
              <button
                onClick={onClose}
                className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSearchClick}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Tìm kiếm
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Profile View */}
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="text-xl font-semibold text-black">
                  Thông tin tài khoản
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-black"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Profile Info */}
              <div className="relative">
                {/* Avatar and Name */}
                <div className="flex w-full items-center p-4">
                  <img
                    src={filteredUsers.avatar || "/placeholder.svg"}
                    alt={filteredUsers.name}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                  />
                  <h3 className="text-xl font-semibold text-black">
                    {filteredUsers.name}
                  </h3>
                </div>

                {/* Buttons */}
                <div className="w-full border-b-[5px] border-gray-200 px-4 pb-4 text-center">
                  <div className="flex space-x-2">
                    {statusSend ? (
                      <button
                        className="flex-1 rounded bg-gray-200 px-4 py-2 font-bold text-black hover:bg-gray-300 opacity-50 cursor-not-allowed" disabled
                      >
                        Gỡ yêu cầu
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(filteredUsers)}
                        className="flex-1 rounded bg-gray-200 px-4 py-2 font-bold text-black hover:bg-gray-300"
                      >
                        Kết bạn
                      </button>
                    )}
                    <button className="flex-1 rounded bg-blue-200 px-4 py-2 font-bold text-blue-700 hover:bg-blue-300">
                      Nhắn tin
                    </button>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="border-b-[5px] border-gray-200 p-4">
                  <h4 className="mb-2 font-semibold text-black">
                    Thông tin cá nhân
                  </h4>
                  <div className="space-y-2 text-black">
                    <p className="text-sm">
                      <span className="text-gray-600">Giới tính: </span>
                      {filteredUsers.gender === "male" ? "Nam" : "Nữ"}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Ngày sinh: </span>
                      {formattedDOB || "10 tháng 05, 2004"}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Điện thoại: </span>
                      {filteredUsers.phone || "+84 865 953 977"}
                    </p>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="p-4 space-y-4 text-sm text-gray-500">
                  <div className="flex cursor-pointer items-center space-x-2 hover:text-black">
                    <Users className="h-4 w-4" />
                    <span>Nhóm chung (0)</span>
                  </div>
                  <div className="flex cursor-pointer items-center space-x-2 hover:text-black">
                    <Share2 className="h-4 w-4" />
                    <span>Chia sẻ danh thiếp</span>
                  </div>
                  <div className="flex cursor-pointer items-center space-x-2 hover:text-black">
                    <Slash className="h-4 w-4" />
                    <span>Chặn tin nhắn và cuộc gọi</span>
                  </div>
                  <div className="flex cursor-pointer items-center space-x-2 hover:text-black">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Báo xấu</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}