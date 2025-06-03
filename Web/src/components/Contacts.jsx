import React from "react";
import { Search, User, Users, UserRoundPlus, UserPlus } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Contacts({
  setFilteredUsers,
  onShowAddFriend,
  onShowCreateGroup,
  setActiveItemUserGroup,
  activeItemUserGroup,
}) {
  return (
    <div className="flex w-full flex-col bg-white font-bold text-gray-800">
      <nav className="space-y-0">
        <button
          onClick={() => setActiveItemUserGroup("user")}
          className={`flex w-full items-center space-x-4 px-4 py-4 text-left hover:bg-gray-200 ${activeItemUserGroup === "user" ? "bg-gray-300" : ""}`}
        >
          <User className="h-5 w-5" />
          <span>Danh sách bạn bè</span>
        </button>
        <button
          onClick={() => setActiveItemUserGroup("users")}
          className={`flex w-full items-center space-x-4 px-4 py-4 text-left hover:bg-gray-200 ${activeItemUserGroup === "users" ? "bg-gray-300" : ""}`}
        >
          <Users className="h-5 w-5" />
          <span>Danh sách nhóm và cộng đồng</span>
        </button>
        <button
          onClick={() => setActiveItemUserGroup("user-plus")}
          className={`flex w-full items-center space-x-4 px-4 py-4 text-left hover:bg-gray-200 ${activeItemUserGroup === "user-plus" ? "bg-gray-300" : ""}`}
        >
          <UserPlus className="h-5 w-5" />
          <span>Lời mời kết bạn</span>
        </button>
      </nav>
    </div>
  );
}
