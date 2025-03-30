import React from 'react';

const pendingRequests = [
  { id: 1, name: 'Ben Nguyen', avatar: '/upload/avatar.png' },
  { id: 2, name: 'Cẩm Hà', avatar: '/upload/avatar.png' },
  { id: 3, name: 'Dp', avatar: '/upload/avatar.png' },
];

export default function FriendRequests() {
  const handleAccept = (id) => {
    console.log(`Accepted friend request ${id}`);
    // Xử lý logic chấp nhận kết bạn
  };

  const handleReject = (id) => {
    console.log(`Rejected friend request ${id}`);
    // Xử lý logic từ chối kết bạn
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
      {pendingRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src={request.avatar} alt={request.name} className="w-10 h-10 rounded-full mr-3" />
            <span>{request.name}</span>
          </div>
          <div>
            <button
              onClick={() => handleAccept(request.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(request.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
