import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import AddFriend from '../components/AddFriend';
import CreateGroup from '../components/CreateGroup';
import LeftSidebar from '../components/LeftSidebar';
import Settings from './Setting';
import Profile from './Profile';
import { useUser } from '../contexts/UserContext'; // Import hook useUser

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const { user } = useUser(); // Lấy thông tin người dùng từ context
  if (!user) {
    return <div>Chưa có thông tin người dùng.</div>;
  }else{
    console.log("Thông tin trang Home",user);
  }

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
        onShowSetting={()=> setShowSetting(true)}
        onShowProfile={()=> setShowProfile(true)}
      />
      <Sidebar 
        onSelectUser={handleSelectUser} 
        selectedUser={selectedUser}
        onSelectGroup={handleSelectGroup}
        selectedGroup={selectedGroup}
        onShowAddFriend={() => setShowAddFriend(true)}
        onShowCreateGroup={() => setShowCreateGroup(true)}
      />
      <div className="flex flex-col flex-1">
        <ChatArea selectedUser={selectedUser} selectedGroup={selectedGroup} />
      </div>
      {showAddFriend && <AddFriend onClose={() => setShowAddFriend(false)} />}
      {showCreateGroup && <CreateGroup onClose={() => setShowCreateGroup(false)} />}
      {showSetting && <Settings onClose={() => setShowSetting(false)} />}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </div>
  );
}

