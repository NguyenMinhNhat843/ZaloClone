import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddFriend({ onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const recentContacts = [
    { id: 1, name: 'Nguyễn Tấn Vinh', phone: '0372 845 432', avatar: '/placeholder.svg' },
    { id: 2, name: 'Minh Thắng Mobile', phone: '0978 567 895', avatar: '/placeholder.svg' },
    { id: 3, name: 'Mc Sửa Chữa Trần Quang Khải', phone: '0969 520 520', avatar: '/placeholder.svg' },
  ];

  const pendingRequests = [
    { id: 1, name: 'Ben Nguyen', avatar: '/placeholder.svg' },
    { id: 2, name: 'Cẩm Hà', avatar: '/placeholder.svg' },
    { id: 3, name: 'Dp', avatar: '/placeholder.svg' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Thêm bạn</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Phone Input */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center space-x-1 bg-[#2a2a2a] px-3 py-2 rounded text-white">
              <img src="/placeholder.svg" alt="VN" className="w-5 h-4" />
              <span>(+84)</span>
            </div>
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 bg-[#2a2a2a] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Recent Results */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-400 mb-2">Kết quả gần nhất</h3>
            {recentContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-white">{contact.name}</p>
                    <p className="text-gray-400 text-sm">{contact.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Friend Requests */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Có thể bạn quen</h3>
            {pendingRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <img src={request.avatar} alt={request.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-white">{request.name}</p>
                    <p className="text-gray-400 text-sm">Tự gợi ý kết bạn</p>
                  </div>
                </div>
                <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Kết bạn
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
}

