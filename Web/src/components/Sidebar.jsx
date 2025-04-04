import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Users, Phone, Settings, UserPlus, Group } from 'lucide-react';
import { users, groups } from '../mockData';
import LeftSidebar from './LeftSidebar';

export default function Sidebar({ onSelectUser, selectedUser, onSelectGroup, selectedGroup, onShowAddFriend, onShowCreateGroup }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery]);

  return (
    <aside className="w-100 bg-white border-r flex flex-col">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <button 
            onClick={onShowAddFriend}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Thêm bạn"
          >
            <UserPlus className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={onShowCreateGroup}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Tạo nhóm"
          >
            <Group className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">Direct Messages</h3>
          {filteredUsers.map(user => (
            <div 
              key={user.id} 
              className={`p-4 hover:bg-gray-100 cursor-pointer ${selectedUser && selectedUser.id === user.id ? 'bg-gray-200' : ''}`} 
              onClick={() => onSelectUser(user)}
            >
              <div className="flex items-center space-x-3">
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">Click to chat</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">Groups</h3>
          {groups.map(group => (
            <div 
              key={group.id} 
              className={`p-4 hover:bg-gray-100 cursor-pointer ${selectedGroup && selectedGroup.id === group.id ? 'bg-gray-200' : ''}`} 
              onClick={() => onSelectGroup(group)}
            >
              <div className="flex items-center space-x-3">
                <img src={group.avatar || "/placeholder.svg"} alt={group.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-gray-500">Click to chat</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>
      
    </aside>
  );
}

