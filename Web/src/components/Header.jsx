import React from 'react';
import { Phone, Video, Info } from 'lucide-react';

export default function Header({selectedUser}) {
  
  if (!selectedUser) {
    return (
      <></>
    );
  }
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h2 className="font-semibold">{selectedUser.name}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Video className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}

