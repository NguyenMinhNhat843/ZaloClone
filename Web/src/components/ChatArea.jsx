import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Smile, MessageCircle, Users, Phone, Settings, Camera, Video, Search, LayoutList } from 'lucide-react';
import { messages as mockMessages, groupMessages as mockGroupMessages, users } from '../mockData';

export default function ChatArea({ selectedUser, selectedGroup }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      const filteredMessages = mockMessages.filter(
        msg => (msg.senderId === selectedUser.id && msg.receiverId === 1) || 
                (msg.senderId === 1 && msg.receiverId === selectedUser.id)
      );
      setMessages(filteredMessages);
    } else if (selectedGroup) {
      const filteredMessages = mockGroupMessages.filter(msg => msg.groupId === selectedGroup.id);
      setMessages(filteredMessages);
    }
  }, [selectedUser, selectedGroup]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || (!selectedUser && !selectedGroup)) return;

    const newMessage = {
      id: Date.now(),
      senderId: 1,
      content: message,
      timestamp: new Date().toISOString(),
    };

    if (selectedUser) {
      newMessage.receiverId = selectedUser.id;
    } else if (selectedGroup) {
      newMessage.groupId = selectedGroup.id;
    }

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a user or group to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="bg-white shadow-sm p-4  items-center ">
        {selectedUser ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <img src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} className="w-10 h-10 rounded-full mr-3" />
              <h2 className="font-semibold">{selectedUser.name}</h2>
            </div>
            <div className="flex justify-around">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Phone className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Video className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Search className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <LayoutList className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <img src={selectedGroup.avatar || "/placeholder.svg"} alt={selectedGroup.name} className="w-10 h-10 rounded-full mr-3" />
            <h2 className="font-semibold">{selectedGroup.name}</h2>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end ${msg.senderId === 1 ? 'justify-end' : ''}`}>
              <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${msg.senderId === 1 ? 'order-1 items-end' : 'order-2 items-start'}`}>
                <div>
                  <span className={`px-4 py-2 rounded-lg inline-block ${msg.senderId === 1 ? 'rounded-br-none bg-blue-600 text-white' : 'rounded-bl-none bg-gray-300 text-gray-600'}`}>
                    {msg.content}
                  </span>
                </div>
                {selectedGroup && (
                  <span className="text-gray-500 text-xs">
                    {users.find(user => user.id === msg.senderId)?.name}
                  </span>
                )}
              </div>
              <img 
                src={msg.senderId === 1 ? "/upload/avatar.png" : (selectedUser ? selectedUser.avatar : users.find(user => user.id === msg.senderId)?.avatar)} 
                alt="Profile" 
                className={`w-6 h-6 rounded-full ${msg.senderId === 1 ? 'order-2' : 'order-1'}`} 
              />
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSend} className="bg-white p-4 flex items-center">
        <button type="button" className="p-2 rounded-full hover:bg-gray-100">
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 mx-4 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="button" className="p-2 rounded-full hover:bg-gray-100 mr-2">
          <Smile className="w-5 h-5 text-gray-600" />
        </button>
        <button type="submit" className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

