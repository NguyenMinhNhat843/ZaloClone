import React, { useState } from 'react';
import { X } from 'lucide-react';

const TransferLeaderModal = ({ members, currentLeaderId, onClose, onConfirm }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState('');

  const eligibleMembers = members.filter(
    (m) => m.userId._id !== currentLeaderId && m.role !== 'admin' // bỏ qua trưởng nhóm hiện tại
  );

  const filteredMembers = eligibleMembers.filter((m) =>
    m.userId.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[480px] max-w-full shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Chuyển quyền trưởng nhóm</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tìm kiếm */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Tìm kiếm thành viên"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Danh sách thành viên */}
        <div className="px-4 max-h-60 overflow-y-auto space-y-2">
          {filteredMembers.map((m) => (
            <label
              key={m.userId._id}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              <input
                type="radio"
                name="newLeader"
                value={m.userId._id}
                checked={selectedUserId === m.userId._id}
                onChange={() => setSelectedUserId(m.userId._id)}
              />
              <img
                src={m.userId.avatar || '/placeholder.svg'}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm">{m.userId.name}</span>
            </label>
          ))}
          {filteredMembers.length === 0 && (
            <p className="text-sm text-gray-500 px-2 py-4">Không có thành viên phù hợp để chuyển quyền.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Hủy
          </button>
          <button
            disabled={!selectedUserId}
            onClick={() => onConfirm(selectedUserId)}
            className={`px-4 py-2 text-sm rounded text-white ${
              selectedUserId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferLeaderModal;
