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
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [activeItemUserGroup, setActiveItemUserGroup] = useState("user");
  const [mumOfConversations, setNumOfConversations] = useState(0);
  const navigate = useNavigate();

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
        mumOfConversations={mumOfConversations}
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
            setNumOfConversations={setNumOfConversations}
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
