// ChatArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Camera, LayoutList, Phone, Video, Search } from 'lucide-react';
import { Bold, Italic, Underline, List, Heading } from 'lucide-react';

import { messages as mockMessages, groupMessages as mockGroupMessages, users } from '../mockData';
import EmojiGifStickerPicker from './EmojiGifStickerPicker';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

function renderFilePreview(content) {
  let name = '', ext = '', size = 0, blob = null;

  if (typeof content === 'string') {
    name = content.match(/name='(.*?)'/)?.[1] || '';
    size = Math.ceil(Number(content.match(/size='(\d+)'/)?.[1]) / 1024);
    ext = name.split('.').pop().toLowerCase();
  } else {
    name = content.name;
    size = Math.ceil(content.size / 1024);
    ext = name.split('.').pop().toLowerCase();
    blob = content.blob;
  }

  const extLabel = ext.toUpperCase();
  const bgColor =
    ext === 'pdf' ? 'bg-red-500' :
    ['doc', 'docx'].includes(ext) ? 'bg-blue-500' :
    ['xls', 'xlsx'].includes(ext) ? 'bg-green-600' :
    ['zip', 'rar'].includes(ext) ? 'bg-yellow-600' :
    'bg-gray-500';

  const handleDownload = () => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const dummy = new Blob(['File nội dung demo'], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(dummy);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-blue-100 rounded-lg p-3 text-sm text-blue-900">
      <div className="flex-shrink-0">
        <div className={`w-10 h-12 ${bgColor} text-white flex items-center justify-center rounded-md font-bold text-xs`}>
          {extLabel}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-600">{size} KB · Chưa có trên Cloud</div>
      </div>
      <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800">⬇️</button>
    </div>
  );
}
export default function ChatArea({ selectedUser, selectedGroup }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();
  const [showFormatting, setShowFormatting] = useState(false);
  const inputRef = useRef();

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

  const applyFormat = (type) => {
    inputRef.current?.focus();
    if (type === 'bold') document.execCommand('bold');
    else if (type === 'italic') document.execCommand('italic');
    else if (type === 'underline') document.execCommand('underline');
    else if (type === 'heading') document.execCommand('formatBlock', false, 'h3');
    else if (type === 'list') document.execCommand('insertUnorderedList');
  };

  const insertTextAtCursor = (text) => {
    inputRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const htmlContent = inputRef.current?.innerHTML?.trim();
    if (!htmlContent || (!selectedUser && !selectedGroup)) return;

    const newMessage = {
      id: Date.now(),
      senderId: 1,
      content: htmlContent,
      timestamp: new Date().toISOString(),
      ...(selectedUser ? { receiverId: selectedUser.id } : { groupId: selectedGroup.id }),
    };

    setMessages([...messages, newMessage]);
    inputRef.current.innerHTML = '';
  };

  const handleSpecialMessage = (value) => {
    if (!value || value === '__close__') {
      setShowEmojiPicker(false);
      return;
    }

    if (!value.startsWith('<sticker') && !value.startsWith('<image') && !value.startsWith('<file')) {
      insertTextAtCursor(value);
      return;
    }

    const newMessage = {
      id: Date.now(),
      senderId: 1,
      content: value,
      timestamp: new Date().toISOString(),
      ...(selectedUser ? { receiverId: selectedUser.id } : { groupId: selectedGroup.id })
    };

    setMessages(prev => [...prev, newMessage]);
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

      <div className="flex-1 overflow-y-auto p-4 bg-[#ebecf0] max-h-[calc(100vh-150px)]">
              <div className="flex flex-col space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-end ${msg.senderId === 1 ? 'justify-end' : ''}`}>
                    <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${msg.senderId === 1 ? 'order-1 items-end' : 'order-2 items-start'}`}>
                      <div>
                        {typeof msg.content === 'string' && msg.content.startsWith('<image') ? (
                          <img
                            src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                            alt="uploaded"
                            onLoad={(e) => {
                              const { naturalWidth: w, naturalHeight: h } = e.target;
                              if (w > 400 || h > 400) {
                                e.target.style.maxWidth = '240px';
                                e.target.style.maxHeight = '240px';
                              } else {
                                e.target.style.maxWidth = w + 'px';
                                e.target.style.maxHeight = h + 'px';
                              }
                            }}
                            className="rounded-lg"
                          />
                        ) : typeof msg.content === 'string' && msg.content.startsWith('<sticker') ? (
                          <img
                            src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                            alt="sticker"
                            className="w-24 h-24 rounded-lg"
                          />
                        ) : typeof msg.content === 'string' && msg.content.startsWith('<file') ? (
                          renderFilePreview(msg.content)
                        ) : typeof msg.content === 'object' && msg.content.type === 'file' ? (
                          renderFilePreview(msg.content)
                        ) : (
                          <div
                            className={`px-4 py-2 rounded-lg inline-block break-words whitespace-pre-wrap max-w-full overflow-x-auto prose prose-sm ${
                              msg.senderId === 1
                                ? 'rounded-br-none bg-blue-600 text-white'
                                : 'rounded-bl-none bg-gray-300 text-gray-600'
                            }`}
                            dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
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
                onSelect={(val) => handleSpecialMessage(val)}
                onSendMessage={handleSpecialMessage}
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
          <label className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <Camera className="w-5 h-5 text-gray-700" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleSpecialMessage(`<image src='${reader.result}' />`);
                };
                reader.readAsDataURL(file);
              }
            }} />
          </label>
          <label className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <Paperclip className="w-5 h-5 text-gray-700" />
            <input
              type="file"
              className="hidden"
              multiple 
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((file) => {
                  const newMessage = {
                    id: Date.now() + Math.random(), // tránh trùng ID
                    senderId: 1,
                    content: {
                      type: 'file',
                      name: file.name,
                      size: file.size,
                      blob: file
                    },
                    timestamp: new Date().toISOString(),
                    ...(selectedUser ? { receiverId: selectedUser.id } : { groupId: selectedGroup.id })
                  };
                  setMessages((prev) => [...prev, newMessage]);
                });
              }}
            />
        </label>
        
        <button type="button" onClick={() => setShowFormatting(!showFormatting)} className="p-1 hover:bg-gray-100 rounded">
            <LayoutList className="w-5 h-5 text-gray-700" />
          </button>
        </div>  
        {showFormatting && (
        <div className="flex items-center flex-wrap gap-2 mb-2 text-sm text-gray-700">
          <span className="text-xs text-gray-500">Nhấn Ctrl + Shift + X để định dạng tin nhắn</span>
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <button type="button" onClick={() => applyFormat('bold')} className="hover:bg-gray-200 p-1 rounded"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => applyFormat('italic')} className="hover:bg-gray-200 p-1 rounded"><Italic className="w-4 h-4" /></button>
            <button type="button" onClick={() => applyFormat('underline')} className="hover:bg-gray-200 p-1 rounded"><Underline className="w-4 h-4" /></button>
            <button type="button" onClick={() => applyFormat('heading')} className="hover:bg-gray-200 p-1 rounded"><Heading className="w-4 h-4" /></button>
            <button type="button" onClick={() => applyFormat('list')} className="hover:bg-gray-200 p-1 rounded"><List className="w-4 h-4" /></button>
          </div>
        </div>
        )}
        
        <div className="flex items-center">
        <div
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            className="flex-1 py-2 px-4 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[200px] overflow-y-auto"
            placeholder="Nhập tin nhắn..."
            onInput={() => {}}
          ></div>
          <button type="submit" className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
