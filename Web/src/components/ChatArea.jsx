// ChatArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Camera, LayoutList, Phone, Video, Search, MoreHorizontal, CornerDownRight, Quote } from 'lucide-react';
import { Bold, Italic, Underline, List, Heading } from 'lucide-react';

import { messages as mockMessages, groupMessages as mockGroupMessages, users } from '../mockData';
import EmojiGifStickerPicker from './EmojiGifStickerPicker';
import RichTextToolbar from "./ui/RichTextToolbar";
import SearchPanel from './SearchPanel';

function renderFilePreview(content, onPreviewVideo) {
  let name = '', ext = '', size = 0, blob = null, url = '';

  if (typeof content === 'string') {
    name = content.match(/name='(.*?)'/)?.[1] || '';
    size = Math.ceil(Number(content.match(/size='(\d+)'/)?.[1]) / 1024);
    ext = name.split('.').pop().toLowerCase();
  } else {
    name = content.name;
    size = Math.ceil(content.size / 1024);
    ext = name.split('.').pop().toLowerCase();
    blob = content.blob;
    url = URL.createObjectURL(blob);
  }


  const extLabel = ext.toUpperCase();
  const bgColor =
    ext === 'pdf' ? 'bg-red-500' :
      ['doc', 'docx'].includes(ext) ? 'bg-blue-500' :
        ['xls', 'xlsx'].includes(ext) ? 'bg-green-600' :
          ['zip', 'rar'].includes(ext) ? 'bg-yellow-600' :
            'bg-gray-500';

  const handleDownload = () => {
    const fileBlob = blob || new Blob(['Demo'], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (ext === 'mp4') {
    return (
      <div className="bg-blue-100 rounded-lg overflow-hidden text-blue-900 text-sm">
        <div className="bg-black flex items-center justify-center">
          <video
            src={url}
            className="max-h-48 w-full cursor-pointer"
            onClick={() => onPreviewVideo(url)}
            muted
            preload="metadata"
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center text-white text-xs mt-[2px]">
              ▶
            </div>
            <div>
              <div className="font-semibold text-gray-800">{name}</div>
              <div className="text-xs text-gray-500">{(size / 1024).toFixed(2)} MB · <span className="italic">Chưa có trên Cloud</span></div>
            </div>
          </div>
          <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800 text-lg">⬇️</button>
        </div>
      </div>
    );
  }

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
  // const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();
  const [showFormatting, setShowFormatting] = useState(false);
  const inputRef = useRef();
  const bottomRef = useRef(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);


  const [showOptions, setShowOptions] = useState(null);  // null nghĩa là không có tin nhắn nào được chọn
  // Thêm state và ref:
  const [menuData, setMenuData] = useState({ id: null, senderId: null, position: { x: 0, y: 0 } });
  const menuLeft = menuData.senderId === 1
    ? menuData.position.x - 208
    : menuData.position.x - 120;
  const moreButtonRefs = useRef({}); // Map msg.id -> DOM element

  // Khi click vào dấu ...:
  const handleOpenOptions = (msg) => {
    if (menuData.id === msg.id) {
      // Nếu click lần 2 cùng nút → đóng menu
      setMenuData({ id: null, senderId: null, position: { x: 0, y: 0 } });
      return;
    }

    const button = moreButtonRefs.current[msg.id];
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuData({
        id: msg.id,
        senderId: msg.senderId,
        position: { x: rect.right, y: rect.bottom }
      });
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      const values = Object.values(moreButtonRefs.current);
      const isClickInside = values.some((el) => el && el.contains(e.target));
      if (!isClickInside) {
        setMenuData({ id: null, senderId: null, position: { x: 0, y: 0 } });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
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
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    inputRef.current?.focus();

    const autoWrapLineIfNoSelection = () => {
      if (!selection || !selection.isCollapsed) return;

      const node = selection.anchorNode;
      if (!node) return;

      const lineRange = document.createRange();

      let lineStart = node;
      while (lineStart.previousSibling && lineStart.previousSibling.nodeName !== 'BR') {
        lineStart = lineStart.previousSibling;
      }

      let lineEnd = node;
      while (lineEnd.nextSibling && lineEnd.nextSibling.nodeName !== 'BR') {
        lineEnd = lineEnd.nextSibling;
      }

      lineRange.setStartBefore(lineStart);
      lineRange.setEndAfter(lineEnd);
      selection.removeAllRanges();
      selection.addRange(lineRange);
    };

    // Các định dạng cần auto chọn dòng nếu không có selection
    const autoWrapTypes = ['bold', 'italic', 'underline'];

    if (autoWrapTypes.includes(type)) {
      autoWrapLineIfNoSelection();
      document.execCommand(type);
      return;
    }

    // Các định dạng còn lại
    if (type === 'heading') {
      document.execCommand('formatBlock', false, 'h3');
    } else if (type === 'list') {
      document.execCommand('insertUnorderedList');
    } else if (
      ['insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyRight', 'justifyCenter', 'undo', 'redo'].includes(type)
    ) {
      document.execCommand(type);
    }
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


  // Ngăn chặn hành vi gửi khi đang có message trong ô input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // ngăn xuống dòng mặc định
      handleSend(e); // gọi hàm gửi
    }
    // Ctrl + Shift + X → toggle định dạng
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      setShowFormatting(prev => !prev);
      return;
    }
  };



  // hàm xử lý khi người dùng chọn sticker, emoji hoặc gif
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
    <div className="flex h-full relative">
      {/* Nội dung chat chính bên trái */}
      <div className="flex flex-col flex-1 bg-gray-50 h-full">
        {/* ✅ Header user/group */}
        <div className={`bg-white shadow-sm p-4 items-center ${showSearchPanel ? 'pr-[10px]' : ''}`}>
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
                <button
                  className={`p-2 rounded-full hover:bg-gray-100 ${showSearchPanel ? 'bg-blue-100' : ''}`}
                  onClick={() => setShowSearchPanel(prev => !prev)}
                >
                  <Search className={`w-6 h-6 ${showSearchPanel ? 'text-blue-600' : 'text-gray-600'}`} />
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

        <div className="flex-1 overflow-y-auto bg-[#ebecf0]">
          <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${showSearchPanel ? 'pr-[10px]' : ''}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-center gap-2 px-2 group ${msg.senderId === 1 ? 'justify-end' : 'justify-start'}`}>

                {/* NÚT BÊN TRÁI (nếu là tin nhắn gửi) */}
                {msg.senderId === 1 && (
                  <div className="flex items-center space-x-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1 hover:bg-gray-200 rounded-full" title="Trích dẫn">
                      <Quote className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded-full" title="Chuyển tiếp">
                      <CornerDownRight className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded-full"
                      title="Thêm"
                      onClick={() => handleOpenOptions(msg)}
                      ref={(el) => (moreButtonRefs.current[msg.id] = el)}
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}

                {/* KHUNG TIN NHẮN */}
                <div className="relative group max-w-[70%]">
                  {typeof msg.content === 'string' && msg.content.startsWith('<image') ? (
                    <img
                      src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                      alt="uploaded"
                      onClick={() => setPreviewImageUrl(msg.content.match(/src=['"](.*?)['"]/)[1])}
                      onLoad={(e) => {
                        const { naturalWidth: w, naturalHeight: h } = e.target;
                        e.target.style.maxWidth = w > 400 ? '240px' : `${w}px`;
                        e.target.style.maxHeight = h > 400 ? '240px' : `${h}px`;
                      }}
                      className="rounded-lg cursor-pointer"
                    />
                  ) : typeof msg.content === 'string' && msg.content.startsWith('<sticker') ? (
                    <img
                      src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                      alt="sticker"
                      className="w-24 h-24 rounded-lg"
                    />
                  ) : typeof msg.content === 'string' && msg.content.startsWith('<file') ? (
                    renderFilePreview(msg.content, setPreviewVideoUrl)
                  ) : typeof msg.content === 'object' && msg.content.type === 'file' ? (
                    renderFilePreview(msg.content, setPreviewVideoUrl)
                  ) : (
                    <>
                      <div
                        className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap prose prose-sm ${msg.senderId === 1
                          ? 'rounded-br-none bg-[#DBEBFF] text-black'
                          : 'rounded-bl-none bg-gray-100 text-black'
                          }`}
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />

                      {/* MENU POPUP (hiện khi nhấn ...) */}

                      {/* {showOptions !== null && (
                        <div
                          className="fixed z-[9999] w-52 bg-white border border-gray-200 shadow-lg rounded-md"
                          style={{ top: `${menuPosition.y + 8}px`, left: `${menuLeft}px` }}
                        >
                          <div className="py-2">

                            <hr className="my-1" />
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                              🖘 Thu hồi
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                              🗑️ Xóa chỉ ở phía tôi
                            </button>
                          </div>
                        </div>
                      )} */}
                    </>
                  )}

                  {/* TÊN NGƯỜI GỬI nếu là nhóm */}
                  {selectedGroup && (
                    <span className="text-gray-500 text-xs block mt-1">
                      {users.find(user => user.id === msg.senderId)?.name}
                    </span>
                  )}
                </div>

                {/* NÚT BÊN PHẢI (nếu là tin nhắn nhận) */}
                {msg.senderId !== 1 && (
                  <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1 hover:bg-gray-200 rounded-full" title="Trích dẫn">
                      <Quote className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded-full" title="Chuyển tiếp">
                      <CornerDownRight className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded-full"
                      title="Thêm"
                      onClick={() => handleOpenOptions(msg)}
                      ref={(el) => (moreButtonRefs.current[msg.id] = el)}
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}

                {msg.senderId !== 1 && (
                  <img
                    src={
                      selectedUser
                        ? selectedUser.avatar
                        : users.find(user => user.id === msg.senderId)?.avatar
                    }
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                )}
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>
        </div>
        <form onSubmit={handleSend} className={`border-t bg-white px-4 py-2 ${showSearchPanel ? 'pr-[10px]' : ''}`} >
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
          {/* Đoạn định dạng văn bản */}
          {showFormatting && (
            <div className="mb-2">
              <RichTextToolbar applyFormat={applyFormat} inputRef={inputRef} />
            </div>
          )}
          {/* Đoạn nhập tin nhắn cho   */}
          <div className="flex items-center">
            <div
              ref={inputRef}
              contentEditable
              suppressContentEditableWarning
              className="flex-1 py-2 px-4 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[200px] overflow-y-auto"
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => handleKeyDown(e)}
              onInput={() => { }}
            ></div>
            <button type="submit" className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

      </div>
      {/* Bảng điều khiển tìm kiếm bên phải */}
      {showSearchPanel && (
        <div className="w-[320px] h-full border-l border-gray-200 bg-white">
          <SearchPanel
            messages={messages}
            onClose={() => setShowSearchPanel(false)} />
        </div>
      )}
      {/* Overlay cho ảnh lớn khi click vào */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative">
            <img src={previewImageUrl} alt="Preview" className="max-w-[90vw] max-h-[90vh] rounded-lg" />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70"
            >
              ✖
            </button>
          </div>
        </div>
      )}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <video src={previewVideoUrl} controls autoPlay className="rounded-lg max-h-[90vh] max-w-[90vw]" />
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {menuData.id !== null && (
        <div
          className="fixed z-[9999] w-52 bg-white border border-gray-200 shadow-lg rounded-md"
          style={{ top: `${menuData.position.y + 8}px`, left: `${menuLeft}px` }}
        >
          <div className="py-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
              Thu hồi
            </button>
            <hr className="my-1" />
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
              Xóa chỉ ở phía tôi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
