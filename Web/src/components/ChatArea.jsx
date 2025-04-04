// ChatArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Camera, LayoutList, Phone, Video, Search } from 'lucide-react';
import { messages as mockMessages, groupMessages as mockGroupMessages, users } from '../mockData';
import EmojiGifStickerPicker from './EmojiGifStickerPicker';

export default function ChatArea({ selectedUser, selectedGroup }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();

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
    setShowEmojiPicker(false);
  };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a user or group to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm p-4 items-center">
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
          <div className="flex items-center">
            <img src={selectedGroup.avatar || "/placeholder.svg"} alt={selectedGroup.name} className="w-10 h-10 rounded-full mr-3" />
            <h2 className="font-semibold">{selectedGroup.name}</h2>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#ebecf0]">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end ${msg.senderId === 1 ? 'justify-end' : ''}`}>
              <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${msg.senderId === 1 ? 'order-1 items-end' : 'order-2 items-start'}`}>
                <div>
                  {msg.content.startsWith('<sticker') ? (
                    <img
                      src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                      alt="sticker"
                      className="w-24 h-24 rounded-lg"
                    />
                  ) : (
                    <span className={`px-4 py-2 rounded-lg inline-block ${msg.senderId === 1 ? 'rounded-br-none bg-blue-600 text-white' : 'rounded-bl-none bg-gray-300 text-gray-600'}`}>
                      {msg.content}
                    </span>
                  )}
                </div>
                {selectedGroup && (
                  <span className="text-gray-500 text-xs">
                    {users.find(user => user.id === msg.senderId)?.name}
                  </span>
                )}
              </div>
              <img
                src={msg.senderId === 1 ? "/placeholder.svg" : (selectedUser ? selectedUser.avatar : users.find(user => user.id === msg.senderId)?.avatar)}
                alt="Profile"
                className={`w-6 h-6 rounded-full ${msg.senderId === 1 ? 'order-2' : 'order-1'}`}
              />
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 px-4 py-2 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-28 left-4 z-50 w-[380px]">
            <EmojiGifStickerPicker
              onSelect={(value) => {
                if (value === '__close__') {
                  setShowEmojiPicker(false);
                  return;
                }
              
                // Nếu trước đó chưa có khoảng trắng, thêm dấu cách
                setMessage((prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + value);
              }}
               onSendMessage={(value) => {
                 if (!value || value === '__close__') return;
                  const newMessage = {
                    id: Date.now(),
                    senderId: 1,
                    content: value,
                    timestamp: new Date().toISOString(),
                  };
                  if (selectedUser) {
                    newMessage.receiverId = selectedUser.id;
                  } else if (selectedGroup) {
                    newMessage.groupId = selectedGroup.id;
                  }
                  setMessages((prev) => [...prev, newMessage]);
                  setShowEmojiPicker(false);
                }}
            />
          </div>
        )}

        <div className="flex items-center space-x-2 mb-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Smile className="w-5 h-5 text-gray-700" />
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded">
            <Camera className="w-5 h-5 text-gray-700" />
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded">
            <Paperclip className="w-5 h-5 text-gray-700" />
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded">
            <LayoutList className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Nhập @, tin nhắn tới ${selectedUser?.name || selectedGroup?.name || ''}`}
            className="flex-1 py-2 px-4 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
