import React, { useState } from 'react';
import { X, Camera, Search } from 'lucide-react';
import { users } from '../mockData';

export default function CreateGroup({ onClose }) {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const contacts = [
    { id: 1, name: 'Công Hưng', avatar: '/placeholder.svg' },
    { id: 2, name: 'Vũ Quốc Huy', avatar: '/placeholder.svg' },
    { id: 3, name: 'An Nhiên Foods - Thanh Thủy', avatar: '/placeholder.svg' },
    { id: 4, name: 'Nguyễn Minh Nhật', avatar: '/placeholder.svg' },
    { id: 5, name: 'Sơn Nguyễn', avatar: '/placeholder.svg' },
  ];

  const toggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Tạo nhóm</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <button className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-400" />
            </button>
            <input
              type="text"
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 bg-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-2 mb-4">
            <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
              Tất cả
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] text-white rounded-full text-sm">
              Người cute nhất quả đất
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] text-white rounded-full text-sm">
              Người giàu nhất thế giới
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <h3 className="text-sm text-gray-400 mb-2">Trò chuyện gần đây</h3>
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center space-x-3 py-2">
                <input
                  type="checkbox"
                  id={`contact-${contact.id}`}
                  checked={selectedMembers.includes(contact.id)}
                  onChange={() => toggleMember(contact.id)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <img src={contact.avatar || "/placeholder.svg"} alt={contact.name} className="w-10 h-10 rounded-full" />
                <label htmlFor={`contact-${contact.id}`} className="text-white cursor-pointer">
                  {contact.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!groupName || selectedMembers.length === 0}
          >
            Tạo nhóm
          </button>
        </div>
      </div>
    </div>
  );
}

