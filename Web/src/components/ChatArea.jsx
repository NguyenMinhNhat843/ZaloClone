import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  Send,
  Paperclip,
  Smile,
  Camera,
  LayoutList,
  Phone,
  Video,
  Search,
  MoreHorizontal,
  CornerDownRight,
  Quote,
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import EmojiGifStickerPicker from './EmojiGifStickerPicker';
import RichTextToolbar from './ui/RichTextToolbar';
import SearchPanel from './SearchPanel';
import axios from 'axios';

function renderFilePreview(content, onPreviewVideo) {
  let name = '',
    size = 0,
    url = '',
    type = '';

  // Trích xuất thông tin từ chuỗi <file ...>
  if (typeof content === 'string') {
    name = content.match(/name='(.*?)'/)?.[1] || 'file';
    size = Number(content.match(/size='(\d+)'/)?.[1]) || 0;
    url = content.match(/url='(.*?)'/)?.[1] || '';
    type = content.match(/type='(.*?)'/)?.[1] || '';
  } else {
    name = content.name || 'file';
    size = content.size || 0;
    url = content.url || '';
    type = content.type || '';
  }

  if (!url) {
    console.error('[renderFilePreview] Thiếu URL file:', content);
    return null;
  }

  // Lấy phần đuôi từ tên file hoặc URL
  let ext = name.split('.').pop().toLowerCase();
  if (ext === name || !ext) {
    // Nếu tên file không có phần mở rộng, lấy từ URL
    ext = url.split('.').pop().toLowerCase();
  }

  // Nếu type không cụ thể (ví dụ: 'file'), suy ra từ phần mở rộng
  if (!type || type === 'file') {
    type = ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
      ? 'image'
      : ext === 'mp4'
      ? 'video'
      : ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'].includes(ext)
      ? ext
      : 'file';
  }

  // Chuẩn hóa type
  if (type === 'excel') {
    type = 'xls'; // Chuẩn hóa 'excel' thành 'xls'
  }
  if (type === 'word') {
    type = 'docx'; // Chuẩn hóa 'word' thành 'docx'
  }

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };

  // Hiển thị dựa trên type
  if (type === 'image') {
    return (
      <div className="bg-blue-100 rounded-lg overflow-hidden text-blue-900 text-sm">
        <div className="bg-black flex items-center justify-center">
          <img
            src={url}
            alt={name}
            className="max-h-48 w-full cursor-pointer"
            onClick={() => setPreviewImageUrl(url)}
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs mt-[2px]">
              🖼️
            </div>
            <div>
              <div className="font-semibold text-gray-800">{name}</div>
              <div className="text-xs text-gray-500">
                {(size / 1024 / 1024).toFixed(2)} MB · <span className="italic">Đã lưu trên Cloud</span>
              </div>
            </div>
          </div>
          <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800 text-lg">
            ⬇️
          </button>
        </div>
      </div>
    );
  }

  if (type === 'video') {
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
              <div className="text-xs text-gray-500">
                {(size / 1024 / 1024).toFixed(2)} MB · <span className="italic">Đã lưu trên Cloud</span>
              </div>
            </div>
          </div>
          <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800 text-lg">
            ⬇️
          </button>
        </div>
      </div>
    );
  }

  // Hiển thị các loại file khác (PDF, DOC, XLS, PPT, v.v.)
  const extLabel = ['xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx'].includes(type) ? type.toUpperCase() : ext.toUpperCase();
  const bgColor =
    type === 'pdf'
      ? 'bg-red-500'
      : ['doc', 'docx'].includes(type)
      ? 'bg-blue-500'
      : ['xls', 'xlsx'].includes(type)
      ? 'bg-green-600'
      : ['ppt', 'pptx'].includes(type)
      ? 'bg-orange-600'
      : ['zip', 'rar'].includes(type)
      ? 'bg-yellow-600'
      : 'bg-gray-500';

  // Hiển thị kích thước linh hoạt (MB nếu lớn hơn 1 MB, KB nếu nhỏ hơn)
  const sizeInKB = size / 1024;
  const sizeDisplay = sizeInKB > 1024 
    ? `${(sizeInKB / 1024).toFixed(2)} MB` 
    : `${sizeInKB.toFixed(2)} KB`;

  return (
    <div className="flex items-center gap-3 bg-blue-100 rounded-lg p-3 text-sm text-blue-900">
      <div className="flex-shrink-0">
        <div
          className={`w-10 h-12 ${bgColor} text-white flex items-center justify-center rounded-md font-bold text-xs`}
        >
          {extLabel}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-600">{sizeDisplay} · Đã lưu trên Cloud</div>
      </div>
      <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800">
        ⬇️
      </button>
    </div>
  );
}

export default function ChatArea({ selectedUser, selectedGroup }) {
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [menuData, setMenuData] = useState({ id: null, senderId: null, position: { x: 0, y: 0 } });
  const { user } = useUser();
  const token = localStorage.getItem('accessToken');
  const baseUrl = 'http://localhost:3000';
  const inputRef = useRef();
  const bottomRef = useRef(null);
  const moreButtonRefs = useRef({});
  const socketRef = useRef(null);
  const menuRef = useRef(null);

  const menuLeft = menuData.senderId === user?._id ? menuData.position.x - 208 : menuData.position.x - 120;

  // Debug user._id
  useEffect(() => {
    if (!user || !user._id) {
      console.error('[ChatArea] ❌ user or user._id is undefined:', user);
    } else {
      console.log('[ChatArea] ✅ Current user._id:', user._id);
    }
  }, [user]);

  // Initialize WebSocket
  useEffect(() => {
    socketRef.current = io(baseUrl, {
      transports: ['websocket'],
      reconnection: false,
    });

    socketRef.current.on('connect', () => {
      console.log('[ChatArea] ✅ Socket connected with id:', socketRef.current.id);
    });

    socketRef.current.on('receiveMessage', (msg) => {
      console.log('[ChatArea] 📩 Received message:', msg);
      if (msg.text && msg.text.startsWith('<file')) {
        console.log('[ChatArea] 📎 File message received:', msg.text);
      }
      if (!user || !user._id) {
        console.warn('[ChatArea] ❌ currentUser is null or user._id is undefined');
        return;
      }

      const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;
      if (msg.conversationId === conversationId) {
        const normalizedSenderId = msg.sender?._id ? String(msg.sender._id) : String(msg.sender);
        console.log('[ChatArea] WebSocket message sender:', normalizedSenderId, 'user._id:', user._id);
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id,
            senderId: normalizedSenderId,
            content: msg.text,
            timestamp: msg.createdAt,
            conversationId: msg.conversationId,
            ...(selectedUser ? { receiverId: msg.receiverId } : { groupId: msg.groupId }),
          },
        ]);
      }
    });

    socketRef.current.on('messageRevoked', ({ messageId, userId }) => {
      if (userId === user._id) {
        const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;
        fetch(`${baseUrl}/chat/messages/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setMessages(
              data
                .filter((msg) => !(msg.deletedFor || []).includes(user._id))
                .map((msg) => ({
                  id: msg._id,
                  senderId: msg.sender?._id || msg.sender,
                  content: msg.text,
                  timestamp: msg.createdAt,
                  conversationId: msg.conversationId,
                  ...(selectedUser ? { receiverId: msg.receiverId } : { groupId: msg.groupId }),
                }))
            );
          });
      }
    });
    
    socketRef.current.on("messageDeleted", ({ messageId }) => {
      console.log("🔥 messageDeleted nhận được:", messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("receiveMessage");
      socketRef.current.off("messageRevoked");
      socketRef.current.off("messageDeleted");
      socketRef.current.disconnect();
    };
  }, [user, selectedUser, selectedGroup, baseUrl]);
  // Fetch messages when selectedUser or selectedGroup changes
  useEffect(() => {
    const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;
    if (conversationId) {
      fetch(`${baseUrl}/chat/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('[ChatArea] Messages fetched:', data);
          setMessages(
            data
            .filter((msg) => {
              const isRevokedForMe = (msg.deletedFor || []).some((id) => String(id) === String(user._id));
              return !isRevokedForMe; // ❌ Nếu đã xóa phía tôi → bỏ qua luôn
            })
            .map((msg) => {
              const normalizedSenderId = msg.sender?._id ? String(msg.sender._id) : String(msg.sender);
              console.log('[ChatArea] Mapping message sender:', normalizedSenderId, 'user._id:', user._id);
              return {
                id: msg._id,
                senderId: normalizedSenderId,
                content: msg.text,
                timestamp: msg.createdAt || msg.timestamp,
                conversationId: msg.conversationId,
                ...(selectedUser ? { receiverId: msg.receiverId } : { groupId: msg.groupId }),
              };
            }),
          );
        })
        .catch((err) => console.error('[ChatArea] Error fetching messages:', err));
    } else {
      setMessages([]);
    }
  }, [selectedUser, selectedGroup, token, baseUrl]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle click outside for options menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      const values = Object.values(moreButtonRefs.current);
      const isClickInsideButton = values.some((el) => el && el.contains(e.target));
      const isClickInsideMenu = menuRef.current?.contains(e.target);

      if (!isClickInsideButton && !isClickInsideMenu) {
        setMenuData({ id: null, senderId: null, position: { x: 0, y: 0 } });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hàm xử lý tải file lên và gửi tin nhắn
  const handleFileUpload = async (files, isImageFromCamera = false) => {
    if (!files.length || !user?._id) {
      console.warn('[ChatArea] Không có file hoặc người dùng chưa đăng nhập');
      return;
    }
  
    if (!token) {
      console.warn('[ChatArea] Không có token xác thực');
      alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      return;
    }
  
    if (!selectedUser && !selectedGroup) {
      console.warn('[ChatArea] Không có người nhận hoặc nhóm được chọn');
      alert('Vui lòng chọn một người nhận hoặc nhóm để gửi file.');
      return;
    }
  
    const receiverId = selectedUser ? selectedUser._id || selectedUser.id : undefined;
  
    if (selectedUser && !receiverId) {
      console.warn('[ChatArea] selectedUser thiếu _id và id:', selectedUser);
      alert('Không thể gửi file: Thiếu ID người nhận.');
      return;
    }
  
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
  
    try {
      const uploadResponse = await axios.post(`${baseUrl}/chat/upload/files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const { attachments } = uploadResponse.data;
      console.log('[ChatArea] API upload response:', attachments);
  
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        const file = files[i];
      
        const mime = attachment.mimeType || file?.type || '';
        let type = 'file';
      
        if (mime.startsWith('image/')) type = 'image';
        else if (mime.startsWith('video/')) type = 'video';
        else if (mime === 'application/pdf') type = 'pdf';
        else if (mime.includes('msword') || mime.includes('officedocument.wordprocessing')) type = 'doc';
        else if (mime.includes('spreadsheet') || mime.includes('excel')) type = 'xls';
      
        const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;
        const commonData = {
          senderId: user._id,
          receiverId,
          groupId: selectedGroup ? selectedGroup.id : undefined,
          conversationId,
        };
      
        // Sửa chỗ này: lấy tên từ attachment.name hoặc file.name
        const rawName = attachment.name || file?.name || 'file';
      
        // Nếu là gửi từ CAMERA và là ảnh thì gửi dưới dạng <image>
        const loadImageSize = (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => resolve({ width: 0, height: 0 }); // fallback nếu lỗi
          });
        
        // Gửi ảnh từ CAMERA dưới dạng <image> với kích thước
        if (isImageFromCamera && type === 'image') {
          const { width, height } = await loadImageSize(attachment.url);
          const imageMessage = `<image src="${attachment.url}" width="${width}" height="${height}" />`;
          sendFileMessage(imageMessage, commonData);
        } else {
          const fileMessage = `<file name='${rawName}' url='${attachment.url}' size='${attachment.size}' type='${type}'>`;
          sendFileMessage(fileMessage, commonData);
        }
      }
    } catch (error) {
      console.error('[ChatArea] Lỗi khi tải file:', error);
      alert('Không thể gửi file. Vui lòng thử lại.');
    }
  };
  
  const sendFileMessage = (text, { senderId, receiverId, groupId, conversationId }) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      senderId,
      content: text,
      timestamp: new Date().toISOString(),
      conversationId,
      ...(receiverId ? { receiverId } : {}),
      ...(groupId ? { groupId } : {}),
    };
  
    setMessages((prev) => [...prev, newMessage]);
  
    socketRef.current.emit('sendMessage', {
      senderId,
      receiverId,
      groupId,
      text,
      conversationId,
    });
  };

  const handleOpenOptions = (msg) => {
    if (menuData.id === msg.id) {
      setMenuData({ id: null, senderId: null, position: { x: 0, y: 0 } });
      return;
    }

    const button = moreButtonRefs.current[msg.id];
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuData({
        id: msg.id,
        senderId: msg.senderId,
        position: { x: rect.right, y: rect.bottom },
      });
    }
  };

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

    const autoWrapTypes = ['bold', 'italic', 'underline'];

    if (autoWrapTypes.includes(type)) {
      autoWrapLineIfNoSelection();
      document.execCommand(type);
      return;
    }

    if (type === 'heading') {
      document.execCommand('formatBlock', false, 'h3');
    } else if (type === 'list') {
      document.execCommand('insertUnorderedList');
    } else if (
      [
        'insertOrderedList',
        'insertUnorderedList',
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        'undo',
        'redo',
      ].includes(type)
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
    if (!htmlContent || (!selectedUser && !selectedGroup) || !user || !user._id) {
      console.warn('[ChatArea] Cannot send message: missing content, user, or conversation');
      return;
    }

    console.log('[ChatArea] selectedUser:', selectedUser);
    console.log('[ChatArea] selectedGroup:', selectedGroup);

    // Lấy receiverId từ selectedUser._id hoặc selectedUser.id
    const receiverId = selectedUser ? selectedUser._id || selectedUser.id : undefined;

    if (selectedUser && !receiverId) {
      console.warn('[ChatArea] selectedUser thiếu _id và id:', selectedUser);
      alert('Không thể gửi tin nhắn: Thiếu ID người nhận.');
      return;
    }

    const newMessage = {
      id: Date.now(),
      senderId: user._id,
      content: htmlContent,
      timestamp: new Date().toISOString(),
      conversationId: selectedUser?.conversationId || selectedGroup?.conversationId,
      ...(selectedUser ? { receiverId } : { groupId: selectedGroup?.id }),
    };

    console.log('[ChatArea] Sending message with senderId:', user._id, 'receiverId:', receiverId);
    setMessages((prev) => [...prev, newMessage]);
    socketRef.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      groupId: selectedGroup ? selectedGroup.id : undefined,
      text: htmlContent,
      conversationId: selectedUser?.conversationId || selectedGroup?.conversationId,
    });
    inputRef.current.innerHTML = '';
  };



  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      setShowFormatting((prev) => !prev);
    }
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

    if (!user || !user._id) {
      console.warn('[ChatArea] Cannot send special message: user or user._id is undefined');
      return;
    }

    // Lấy receiverId từ selectedUser._id hoặc selectedUser.id
    const receiverId = selectedUser ? selectedUser._id || selectedUser.id : undefined;

    if (selectedUser && !receiverId) {
      console.warn('[ChatArea] selectedUser thiếu _id và id:', selectedUser);
      alert('Không thể gửi tin nhắn: Thiếu ID người nhận.');
      return;
    }

    const newMessage = {
      id: Date.now(),
      senderId: user._id,
      content: value,
      timestamp: new Date().toISOString(),
      conversationId: selectedUser?.conversationId || selectedGroup?.conversationId,
      ...(selectedUser ? { receiverId } : { groupId: selectedGroup?.id }),
    };

    console.log('[ChatArea] Sending special message with senderId:', user._id, 'receiverId:', receiverId);
    setMessages((prev) => [...prev, newMessage]);
    socketRef.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      groupId: selectedGroup ? selectedGroup.id : undefined,
      text: value,
      conversationId: selectedUser?.conversationId || selectedGroup?.conversationId,
    });
    setShowEmojiPicker(false);
  };

  // const deleteMessage = (messageId) => {
  //   // Optionally emit to server: socketRef.current.emit('deleteMessage', { messageId });
  // };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chọn một người dùng hoặc nhóm để bắt đầu trò chuyện</p>
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Lỗi: Người dùng chưa đăng nhập hoặc thiếu ID người dùng</p>
      </div>
    );
  }

  return (
    <div className="flex h-full relative">
      <div className="flex flex-col flex-1 bg-gray-50 h-full">
        <div className={`bg-white shadow-sm p-4 items-center ${showSearchPanel ? 'pr-[10px]' : ''}`}>
          {selectedUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={selectedUser.avatar || '/placeholder.svg'}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h2 className="font-semibold">{selectedUser.name}</h2>
              </div>
              <div className="flex justify-around">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Video className="w-6 h-6 text-gray-600" />
                </button>
                <div className="relative">
                  <button
                    className={`p-2 rounded-full hover:bg-gray-100 ${showSearchPanel ? 'bg-blue-100' : ''}`}
                    onClick={() => setShowSearchPanel((prev) => !prev)}
                  >
                    <Search className={`w-6 h-6 ${showSearchPanel ? 'text-blue-600' : 'text-gray-600'}`} />
                  </button>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <LayoutList className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <img
                src={selectedGroup.avatar || '/placeholder.svg'}
                alt={selectedGroup.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              {/* <h2 className="font-semibold">{selectedGroup.name}</h2> */}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-[#ebecf0]">
          <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${showSearchPanel ? 'pr-[10px]' : ''}`}>
            {messages.map((msg) => {
              const isSent = String(msg.senderId) === String(user._id);
              console.log(
                '[ChatArea] Rendering message id:',
                msg.id,
                'senderId:',
                msg.senderId,
                'user._id:',
                user._id,
                'isSent:',
                isSent,
              );
              return (
                <div
                  key={msg.id}
                  className={`flex items-center gap-2 px-2 group ${isSent ? 'justify-end' : 'justify-start'}`}
                >
                  {isSent && (
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

                  {!isSent && (
                    <img
                      src={selectedUser ? selectedUser.avatar : selectedGroup.avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  )}

                  <div className="relative group max-w-[70%]">
                  {typeof msg.content === 'string' && msg.content.startsWith('<file') ? (
                    renderFilePreview(msg.content, setPreviewVideoUrl)
                  ) : typeof msg.content === 'string' && msg.content.startsWith('<image') ? (
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
                  ) : (
                    <>
                      <div
                        className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap prose prose-sm ${
                          isSent
                            ? 'rounded-br-none bg-[#DBEBFF] text-black'
                            : 'rounded-bl-none bg-gray-100 text-black'
                        }`}
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
                      {selectedGroup && (
                        <span className="text-gray-500 text-xs block mt-1">
                          {isSent
                            ? user.name
                            : selectedGroup.members?.find((m) => m.id === msg.senderId)?.name ||
                              'Unknown'}
                        </span>
                      )}
                    </>
                  )}
                  </div>

                  {!isSent && (
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
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
        </div>

        <form onSubmit={handleSend} className={`border-t bg-white px-4 py-2 ${showSearchPanel ? 'pr-[10px]' : ''}`}>
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
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files,true)}
              />
            </label>
            <label className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Paperclip className="w-5 h-5 text-gray-700" />
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFileUpload(e.target.files,false)}
              />
            </label>
            <button
              type="button"
              onClick={() => setShowFormatting(!showFormatting)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <LayoutList className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {showFormatting && (
            <div className="mb-2">
              <RichTextToolbar applyFormat={applyFormat} inputRef={inputRef} />
            </div>
          )}

          <div className="flex items-center">
            <div
              ref={inputRef}
              contentEditable
              suppressContentEditableWarning
              className="flex-1 py-2 px-4 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[200px] overflow-y-auto"
              placeholder="Nhập tin nhắn..."
              onKeyDown={handleKeyDown}
              onInput={() => { }}
            ></div>
            <button type="submit" className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {showSearchPanel && (
        <div className="w-[320px] h-full border-l border-gray-200 bg-white">
          <SearchPanel messages={messages} onClose={() => setShowSearchPanel(false)} />
        </div>
      )}


    {/* Xử lý hiển thị ảnh và video khi nhấn vào */}
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
      {/* // Xử lý hiển thị video khi nhấn vào */}

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
          ref={menuRef}
          className="fixed z-[9999] w-52 bg-white border border-gray-200 shadow-lg rounded-md"
          style={{ top: `${menuData.position.y + 8}px`, left: `${menuLeft}px` }}
        >
          <div className="py-2">
            {(() => {
              const msg = messages.find((m) => m.id === menuData.id);
              const isMyMessage = String(msg?.senderId) === String(user._id);

              return (
                <>
                  {isMyMessage && (
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                       onClick={() => {
                      const messageId = msg.id;
                      socketRef.current.emit("deleteMessage", {
                        messageId,
                        userId: user._id,
                        type: "everyone",
                        conversationId: selectedUser?.conversationId || selectedGroup?.conversationId,
                      });
                      setMessages((prev) => prev.filter((m) => m.id !== messageId));
                      setMenuData({ id: null, senderId: null, position: { x: 0, y: 0 } });
                    }}
                    >
                     Xóa tin nhắn
                    </button>
                  )}
                  {isMyMessage && <hr className="my-1" />}
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    onClick={() => {
                      const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;

                      // Gửi socket lên server như bình thường
                      socketRef.current.emit('revokeMessage', {
                        messageId: msg.id,
                        userId: user._id,
                        conversationId,
                      });

                      // setMessages((prev) =>
                      //   prev.map((m) =>
                      //     m.id === msg.id
                      //       ? {
                      //           ...m,
                      //           deletedFor: [...(m.deletedFor || []), user._id],
                      //           content: "<i style='color:gray'>Tin nhắn đã được thu hồi</i>", // ✅ cập nhật trực tiếp nội dung
                      //         }
                      //       : m
                      //   )
                      // );

                      // Đóng menu
                      setMenuData({ id: null, senderId: null, position: { x: 0, y: 0 } });

                    }}
                   
                  >
                    Xóa chỉ ở phía tôi
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}