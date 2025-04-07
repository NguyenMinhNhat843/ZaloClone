import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import AddFriend from "../components/AddFriend";
import CreateGroup from "../components/CreateGroup";
import FriendList from "../components/FriendList";
import GroupList from "../components/GroupList";
import FriendRequests from "../components/FriendRequests";
import GroupRequests from "../components/GroupRequests";
import LeftSidebar from "../components/LeftSidebar";
import { users, groups } from "../mockData";
import Settings from "./Setting";
import Profile from "./Profile";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeItem, setActiveItem] = useState("messages");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [activeItemUserGroup, setActiveItemUserGroup] = useState("user");

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây (xóa token, reset state)
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <LeftSidebar
        onShowSetting={() => setShowSetting(true)}
        onShowProfile={() => setShowProfile(true)}
        setActiveItem={setActiveItem}
        activeItem={activeItem}
      />
      <div className="w-85 flex h-screen flex-col border-r bg-white">
        <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
          <SearchBar
            setFilteredUsers={setFilteredUsers}
            onShowAddFriend={() => setShowAddFriend(true)}
            onShowCreateGroup={() => setShowCreateGroup(true)}
          />
        </div>

        <div
          className={`flex-1 overflow-y-auto ${activeItem === "contacts" ? "h-auto" : "h-0"}`}
        >
          <nav className="flex-1 overflow-y-auto">
            <div className="mb-4">
              <div className="flex gap-4 border-b px-4 py-2 text-sm font-medium">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`pb-1 ${activeTab === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`pb-1 ${activeTab === "unread" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                >
                  Chưa đọc
                </button>
              </div>

              {filteredUsers
                .filter((user) => activeTab === "all" || user.unreadCount > 0)
                .map((user) => (
                  <div
                    key={user.id}
                    className={`hogt ver:bg-gray-100 flex cursor-pointer items-center justify-between p-4 ${
                      selectedUser && selectedUser.id === user.id
                        ? "bg-[#DBEBFF]"
                        : ""
                    }`}
                    onClick={() => {
                      onSelectUser(user); // giữ nguyên logic chọn user

                      if (user.unreadCount > 0) {
                        // Cập nhật allUsers: set unreadCount = 0 cho đúng user
                        const updatedUsers = allUsers.map((u) =>
                          u.id === user.id ? { ...u, unreadCount: 0 } : u,
                        );
                        setAllUsers(updatedUsers);
                      }
                    }}
                  >
                    {/* Bên trái: avatar + info */}
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="max-w-[180px] truncate text-sm text-gray-500">
                          Click to chat
                        </p>
                      </div>
                    </div>

                    {/* Bên phải: thời gian + badge */}
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs text-gray-500">29 phút</span>
                      {user.unreadCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                          {user.unreadCount > 9 ? "9+" : user.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">
                Groups
              </h3>
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`cursor-pointer p-4 hover:bg-gray-100 ${selectedGroup && selectedGroup.id === group.id ? "bg-gray-200" : ""}`}
                  onClick={() => onSelectGroup(group)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={group.avatar || "/placeholder.svg"}
                      alt={group.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-gray-500">Click to chat</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </nav>
          <Sidebar
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
            onSelectGroup={handleSelectGroup}
            selectedGroup={selectedGroup}
            filteredUsers={filteredUsers}
            onShowAddFriend={() => setShowAddFriend(true)}
            onShowCreateGroup={() => setShowCreateGroup(true)}
            activeItem={activeItem}
            setActiveItemUserGroup={setActiveItemUserGroup}
            activeItemUserGroup={activeItemUserGroup}
          />
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {activeItem === "contacts" ? (
              (() => {
                switch (activeItemUserGroup) {
                  case "user":
                    return <FriendList />;
                  case "users":
                    return <GroupList />;
                  case "user-plus":
                    return <FriendRequests />;
                  case "user-round-plus":
                    return <GroupRequests />;
                  default:
                    return null;
                }
              })()
            ) : activeItem === "messages" ? (
              <ChatArea
                selectedUser={selectedUser}
                selectedGroup={selectedGroup}
              />
            ) : null}
          </div>
        </div>
      </div>
      {showAddFriend && <AddFriend onClose={() => setShowAddFriend(false)} />}
      {showCreateGroup && (
        <CreateGroup onClose={() => setShowCreateGroup(false)} />
      )}
      {showSetting && <Settings onClose={() => setShowSetting(false)} />}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </div>
  );
}
