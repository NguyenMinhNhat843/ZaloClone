import React from 'react';
import { friendRequests } from '../mockData';

export default function FriendRequests() {
  const handleAccept = (id) => {
    console.log(`Accepted friend request ${id}`);
    // Here you would typically update the friend request status in your backend
  };

  const handleReject = (id) => {
    console.log(`Rejected friend request ${id}`);
    // Here you would typically remove the friend request in your backend
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
      {friendRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src={request.senderAvatar} alt={request.senderName} className="w-10 h-10 rounded-full mr-3" />
            <span>{request.senderName}</span>
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

