import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Users, Phone, Settings, UserPlus, Group } from 'lucide-react';
import { users, groups } from '../mockData';

export default function SearchBar({ setFilteredUsers, onShowAddFriend, onShowCreateGroup  }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState(users);
  useEffect(() => {
    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchQuery, allUsers]);

  return (
    <div className="p-4">
      <div className="mb-2 flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
