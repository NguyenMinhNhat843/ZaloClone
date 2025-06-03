import React, { useState } from "react";
import { Search, UserPlus, Group } from "lucide-react";

export default function SearchBar({
  setFilteredUsers,
  onShowAddFriend,
  onShowCreateGroup,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (!query) {
      setFilteredUsers([]);
      return;
    }

    const currentUserPhone = await localStorage.getItem("userPhone");
    const token = localStorage.getItem("accessToken");

    // Nếu người dùng nhập đúng số điện thoại của chính mình
    if (query === currentUserPhone) {
      setFilteredUsers([]); // không hiển thị bản thân
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log("Data user in Search:", data);
      if (res.ok && data && data.phone !== currentUserPhone) {
        setFilteredUsers(data);
      } else {
        setFilteredUsers();
      }
    } catch (err) {
      console.error("Lỗi khi tìm user theo sdt:", err);
      setFilteredUsers();
    }
  };

  return (
    <div className="p-4">
      <div className="mb-2 flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Nhập số điện thoại để tìm bạn"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={onShowAddFriend}
          className="rounded-full p-2 hover:bg-gray-100"
          title="Thêm bạn"
        >
          <UserPlus className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={onShowCreateGroup}
          className="rounded-full p-2 hover:bg-gray-100"
          title="Tạo nhóm"
        >
          <Group className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
