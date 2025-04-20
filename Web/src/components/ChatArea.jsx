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
  UserPlus,
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import EmojiGifStickerPicker from './EmojiGifStickerPicker';
import RichTextToolbar from './ui/RichTextToolbar';
import SearchPanel from './SearchPanel';
import ConversationInfo from './ConversationInfo'; // Import ConversationInfo
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// Hàm renderFilePreview (đã sửa)
// Hàm renderFilePreview
function renderFilePreview(content, onPreviewVideo, setPreviewImageUrl) {
  const { name, size, url, type: rawType } = content;

  if (!url || !size) {
    console.error('[renderFilePreview] Thiếu thông tin cần thiết:', content);
    return (
      <div className="bg-red-100 rounded-lg p-3 text-sm text-red-900">
        Lỗi: Không thể hiển thị file do thiếu thông tin.
      </div>
    );
  }

  const fileName = name || (url?.split('/').pop()?.split('?')[0]) || 'file';

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const type = (() => {
    if (rawType === 'image') return 'image';
    if (rawType === 'video') return 'video';
    if (['word', 'excel', 'pdf', 'ppt', 'text'].includes(rawType)) return rawType;
    return 'file';
  })();

  if (type === 'image') {
    return (
      <div className="bg-blue-100 rounded-lg overflow-hidden text-blue-900 text-sm">
        <div className="bg-black flex items-center justify-center">
          <img
            src={url}
            alt={fileName}
            className="max-h-48 w-full cursor-pointer object-contain"
            onClick={() => setPreviewImageUrl(url)}
            onError={() => alert('Không thể tải hình ảnh.')}
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center text-white text-xs mt-[2px]">
              🖼️
            </div>
            <div>
              <div className="font-semibold text-gray-800">{truncateMiddle(fileName)}</div>
              <div className="text-xs text-gray-500">
                {formatFileSize(size)} · <span className="italic">Đã lưu trên Cloud</span>
              </div>
            </div>
          </div>
          <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800 text-lg">⬇️</button>
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
            onError={() => alert('Không thể tải video.')}
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
              <div className="font-semibold text-gray-800">{truncateMiddle(fileName)}</div>
              <div className="text-xs text-gray-500">
                {formatFileSize(size)} · <span className="italic">Đã lưu trên Cloud</span>
              </div>
            </div>
          </div>
          <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800 text-lg">⬇️</button>
        </div>
      </div>
    );
  }

  const typeMapping = {
    word: { label: 'DOC', bgColor: 'bg-blue-500' },
    excel: { label: 'XLS', bgColor: 'bg-green-600' },
    pdf: { label: 'PDF', bgColor: 'bg-red-600' },
    ppt: { label: 'PPT', bgColor: 'bg-orange-500' },
    text: { label: 'TXT', bgColor: 'bg-gray-500' },
    file: { label: 'FILE', bgColor: 'bg-gray-500' },
  };

  const { label, bgColor } = typeMapping[type] || typeMapping.file;

  return (
    <div className="flex items-center gap-3 bg-blue-100 rounded-lg p-3 text-sm text-blue-900">
      <div className="flex-shrink-0">
        <div className={`w-10 h-12 ${bgColor} text-white flex items-center justify-center rounded-md font-bold text-xs`}>
          {label}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="font-semibold">{truncateMiddle(fileName)}</div>
        <div className="text-xs text-gray-600">{formatFileSize(size)} · Đã lưu trên Cloud</div>
      </div>
      <button onClick={handleDownload} className="text-blue-600 hover:text-blue-800">⬇️</button>
    </div>
  );
}



// Hàm formatFileSize
function formatFileSize(size) {
  const sizeInKB = size / 1024;
  return sizeInKB > 1024
    ? `${(sizeInKB / 1024).toFixed(2)} MB`
    : `${sizeInKB.toFixed(2)} KB`;
}

// Hàm formatTimeFromDate
function formatTimeFromDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Hàm truncateMiddle
function truncateMiddle(text, maxLength = 20) {
  if (text.length <= maxLength) return text;
  const start = text.slice(0, Math.floor(maxLength / 2));
  const end = text.slice(-Math.floor(maxLength / 2));
  return `${start}...${end}`;
}

export default function ChatArea({ selectedUser, selectedGroup,setSelectedGroup }) {
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showConversationInfo, setShowConversationInfo] = useState(false); // Thêm state cho ConversationInfo
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
  const navigate = useNavigate();
  const menuLeft = menuData.senderId === user?._id ? menuData.position.x - 208 : menuData.position.x - 120;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Debug user._id
  useEffect(() => {
    if (!user || !user._id) {
      navigate('/login');
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
      auth: { token }, // nếu đã lấy token từ localStorage phía trên
    });

    socketRef.current.on('connect', () => {
      console.log('[ChatArea] ✅ Socket connected with id:', socketRef.current.id);
    });

    socketRef.current.on('receiveMessage', (msg) => {
      console.log('[ChatArea] 📩 Received message:', JSON.stringify(msg, null, 2));
      if (msg.text && (msg.text === '[Hình ảnh]' || msg.text === '[Tài liệu]')) {
        console.log('[ChatArea] 📎 Attachment message received:', msg.attachments);
      }
      if (!user || !user._id) {
        console.warn('[ChatArea] ❌ currentUser is null or user._id is undefined');
        return;
      }

      const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;
      if (msg.conversationId === conversationId) {
        const normalizedSenderId = msg.sender?._id ? String(msg.sender._id) : String(msg.sender);
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id,
            senderId: normalizedSenderId,
            content: msg.text,
            timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(), // ✅ fallback nếu thiếu
            conversationId: msg.conversationId,
            attachments: msg.attachments || [], // Đảm bảo attachments luôn là mảng
            ...(selectedUser ? { receiverId: msg.receiverId } : { groupId: msg.groupId }),
          },
        ]);
      }
    });

    // ... các sự kiện socket khác giữ nguyên (messageRevoked, messageDeleted) ...

    return () => {
      socketRef.current.off('connect');
      socketRef.current.off('receiveMessage');
      socketRef.current.off('messageRevoked');
      socketRef.current.off('messageDeleted');
      socketRef.current.disconnect();
    };
  }, [user, selectedUser, selectedGroup, baseUrl, token]);

  useEffect(() => {
    const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;
    let intervalId;

    if (conversationId) {
      const fetchMessages = () => {
        fetch(`${baseUrl}/chat/messages/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const filtered = data
              .filter((msg) => !(msg.deletedFor || []).includes(user._id))
              .map((msg) => ({
                id: msg._id,
                senderId: msg.sender?._id || msg.sender,
                content: msg.text,
                timestamp: msg.createdAt || msg.timestamp,
                conversationId: msg.conversationId,
                attachments: msg.attachments || [], // ✅ THÊM VÀO ĐÂY

                ...(selectedUser ? { receiverId: msg.receiverId } : { groupId: msg.groupId }),
              }));

            const lastLocal = messages[messages.length - 1]?.id;
            const lastServer = filtered[filtered.length - 1]?.id;

            // 👉 Chỉ cập nhật nếu có tin mới
            if (lastLocal !== lastServer || filtered.length !== messages.length) {
              setMessages(filtered);
            }
          });
      };

      fetchMessages(); // Fetch lần đầu
      intervalId = setInterval(fetchMessages, 1000); // Lặp mỗi 3s
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedUser, selectedGroup, token, baseUrl, user, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    console.log('[ChatArea] 🔁 Nhận selectedGroup mới:', selectedGroup);
  }, [selectedGroup]);

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
      console.warn("[ChatArea] Không có file hoặc người dùng chưa đăng nhập");
      return;
    }

    if (!token) {
      console.warn("[ChatArea] Không có token xác thực");
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    if (!selectedUser && !selectedGroup) {
      console.warn("[ChatArea] Không có người nhận hoặc nhóm được chọn");
      alert("Vui lòng chọn một người nhận hoặc nhóm để gửi file.");
      return;
    }

    const receiverId = selectedUser ? selectedUser._id || selectedUser.id : undefined;

    if (selectedUser && !receiverId) {
      console.warn("[ChatArea] selectedUser thiếu _id và id:", selectedUser);
      alert("Không thể gửi file: Thiếu ID người nhận.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const uploadResponse = await axios.post(`${baseUrl}/chat/upload/files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { attachments } = uploadResponse.data;
      const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;

      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        const mime = attachment.mimeType || files[i]?.type || "";

        let type = "file";
        if (mime.startsWith("image/")) type = "image";
        else if (mime.startsWith("video/")) type = "video";
        else if (mime === "application/pdf") type = "pdf";
        else if (mime.includes("msword") || mime.includes("officedocument.wordprocessing")) type = "word";
        else if (mime.includes("spreadsheet") || mime.includes("excel")) type = "excel";
        else if (mime.includes("presentation")) type = "ppt";
        else if (mime.startsWith("text/")) type = "text";

        const fileAttachment = {
          url: attachment.url,
          type,
          size: attachment.size,
          name: attachment.name || files[i]?.name || "file",
          mimeType: mime,
        };

        const commonData = {
          senderId: user._id,
          receiverId,
          groupId: selectedGroup?.id,
          conversationId: conversationId?.startsWith("temp_") ? undefined : conversationId,
        };
        if (isImageFromCamera && type === "image") {
          const { width, height } = await new Promise((resolve) => {
            const img = new Image();
            img.src = attachment.url;
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 0, height: 0 });
          });

          sendFileMessage("", [{
            ...fileAttachment,
            width,
            height,
            isFromCamera: true // ✅ gắn cờ ảnh từ camera
          }], commonData);
        } else {
          sendFileMessage("", [{
            ...fileAttachment,
            isFromCamera: false // ✅ file thông thường
          }], commonData);
        }
      }

      // Xử lý cập nhật conversation nếu là tạm
      if (conversationId?.startsWith("temp_")) {
        setTimeout(() => {
          fetch(`${baseUrl}/chat/conversations/user/${receiverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((conv) => {
              if (Array.isArray(conv) && conv.length > 0) {
                onSelectUser({ ...selectedUser, conversationId: conv[0]._id });
                fetchConversations();
              }
            })
            .catch(console.error);
        }, 1000);
      }
    } catch (error) {
      console.error("[ChatArea] Lỗi khi tải file:", error);
      alert("Không thể gửi file. Vui lòng thử lại.");
    }
  };

  const sendFileMessage = (text, attachments, { senderId, receiverId, groupId, conversationId }) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      senderId,
      content: text,
      attachments: attachments || [],
      timestamp: new Date().toISOString(),
      conversationId,
      ...(receiverId ? { receiverId } : {}),
      ...(groupId ? { groupId } : {}),
    };

    setMessages((prev) => [...prev, newMessage]);

    socketRef.current.emit("sendMessage", {
      senderId,
      receiverId,
      groupId,
      text: text || (attachments?.[0]?.type === 'image' ? '[Hình ảnh]' : '[Tài liệu]'),
      attachments: attachments || [],
      conversationId: conversationId?.startsWith("temp_") ? undefined : conversationId,
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
      console.warn("[ChatArea] Cannot send message: missing content, user, or conversation");
      return;
    }

    const receiverId = selectedUser ? selectedUser._id || selectedUser.id : undefined;

    if (selectedUser && !receiverId) {
      console.warn("[ChatArea] selectedUser thiếu _id và id:", selectedUser);
      alert("Không thể gửi tin nhắn: Thiếu ID người nhận.");
      return;
    }

    const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;
    const newMessage = {
      id: Date.now(),
      senderId: user._id,
      content: htmlContent,
      timestamp: new Date().toISOString(),
      conversationId,
      ...(selectedUser ? { receiverId } : { groupId: selectedGroup?.id }),
    };

    setMessages((prev) => [...prev, newMessage]);
    socketRef.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      groupId: selectedGroup ? selectedGroup.id : undefined,
      text: htmlContent,
      conversationId: conversationId.startsWith("temp_") ? undefined : conversationId, // Không gửi conversationId nếu là tạm
    });

    inputRef.current.innerHTML = "";

    // Nếu là conversation tạm, đồng bộ conversation sau khi gửi tin nhắn
    if (conversationId.startsWith("temp_")) {
      setTimeout(() => {
        fetch(`${baseUrl}/chat/conversations/user/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((conv) => {
            if (Array.isArray(conv) && conv.length > 0) {
              // Cập nhật selectedUser với conversationId mới
              onSelectUser({
                ...selectedUser,
                conversationId: conv[0]._id,
              });
              // Đồng bộ danh sách conversations
              fetch(`${baseUrl}/chat/conversations/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then((res) => res.json())
                .then((data) => {
                  setConversations(data);
                  setNumOfConversations(data.length);
                })
                .catch((err) => console.error("Error fetching conversations:", err));
            }
          })
          .catch((err) => console.error("Error fetching new conversation:", err));
      }, 1000); // Đợi 1 giây để server xử lý
    }
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

  // Hàm xử lý toggle SearchPanel
  const toggleSearchPanel = () => {
    setShowSearchPanel(prev => !prev);
    if (showConversationInfo) setShowConversationInfo(false); // Tắt ConversationInfo nếu đang mở
  };

  // Hàm xử lý toggle ConversationInfo
  const toggleConversationInfo = () => {
    setShowConversationInfo(prev => !prev);
    if (showSearchPanel) setShowSearchPanel(false); // Tắt SearchPanel nếu đang mở
  };

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
        <div className={`bg-white shadow-sm p-4 items-center ${showSearchPanel || showConversationInfo ? 'pr-[10px]' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={(selectedUser?.avatar || selectedGroup?.avatar) || '/placeholder.svg'}
                alt={(selectedUser?.name || selectedGroup?.name)}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h2 className="font-semibold">
                  {selectedUser?.name || selectedGroup?.name}
                </h2>
                {selectedGroup && (
                  <span
                    className="text-sm text-gray-500 cursor-pointer hover:underline"
                    onClick={toggleConversationInfo}
                  >
                    {selectedGroup?.participants?.length || 0} thành viên
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-around">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                title="Thêm thành viên"
                onClick={() => console.log('Click: Thêm thành viên')}
              >
                <UserPlus className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Phone className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Video className="w-6 h-6 text-gray-600" />
              </button>
              <div className="relative">
                <button
                  className={`p-2 rounded-full hover:bg-gray-100 ${showSearchPanel ? 'bg-blue-100' : ''}`}
                  onClick={toggleSearchPanel}
                >
                  <Search className={`w-6 h-6 ${showSearchPanel ? 'text-blue-600' : 'text-gray-600'}`} />
                </button>
              </div>
              <button
                className={`p-2 rounded-full hover:bg-gray-100 ${showConversationInfo ? 'bg-blue-100' : ''}`}
                onClick={toggleConversationInfo}
              >
                <LayoutList className={`w-6 h-6 ${showConversationInfo ? 'text-blue-600' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto bg-[#ebecf0]">
          <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${showSearchPanel || showConversationInfo ? 'pr-[10px]' : ''}`}>
            {messages.map((msg) => {
              const isSent = String(msg.senderId) === String(user._id);
              const hasAttachmentContent = msg.content === '[Hình ảnh]' || msg.content === '[Tài liệu]';
              const isAttachmentMessage =
                Array.isArray(msg.attachments) &&
                msg.attachments.length > 0 &&
                msg.attachments.every(att => att.url && att.type && att.size); // bỏ kiểm tra name

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
                    {(isAttachmentMessage || (msg.content === '[Hình ảnh]' || msg.content === '[Tài liệu]')) && msg.attachments?.length > 0 ? (
                      msg.attachments.map((att, index) => {
                        if (!att.url || !att.type || !att.size) return null;


                        const fileName = att.name || att.url.split('/').pop()?.split('?')[0] || 'file';

                        if (att.type === 'image' && att.isFromCamera) {
                          return (
                            <div key={index} className="mb-1">
                              <img
                                src={att.url}
                                alt="Ảnh từ camera"
                                className="rounded-lg max-w-[240px] max-h-[240px]"
                                onClick={() => setPreviewImageUrl(att.url)}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {formatTimeFromDate(msg.timestamp || msg.createdAt)}
                              </div>
                            </div>
                          );
                        }


                        // if (att.type === 'video') {
                        //   return (
                        //     <div key={index} className="mb-1">
                        //       <video
                        //         src={att.url}f
                        //         className="rounded-lg cursor-pointer max-w-[240px] max-h-[240px]"
                        //         onClick={() => setPreviewVideoUrl(att.url)}
                        //         muted
                        //         preload="metadata"
                        //       />
                        //       <div className="text-xs text-gray-500 mt-1">{formatTimeFromDate(msg.timestamp)}</div>
                        //     </div>
                        //   );
                        // }

                        // Default render: file, word, excel, text...
                        return (
                          <div key={index} className="mb-1">
                            {renderFilePreview(att, setPreviewVideoUrl, setPreviewImageUrl)}
                            <div className="text-xs text-gray-500 mt-1">
                              {formatTimeFromDate(msg.timestamp || msg.createdAt)}
                            </div>
                          </div>
                        );
                      })
                    ) : typeof msg.content === 'string' && msg.content.startsWith('<file') ? (
                      <div>
                        {renderFilePreview(msg.content, setPreviewVideoUrl, setPreviewImageUrl)}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeFromDate(msg.timestamp || msg.createdAt)}
                        </div>
                      </div>
                    ) : typeof msg.content === 'string' && msg.content.startsWith('<image') ? (
                      <div>
                        <img
                          src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                          alt="uploaded"
                          onClick={() => setPreviewImageUrl(msg.content.match(/src=['"](.*?)['"]/)[1])}
                          onLoad={(e) => {
                            const { naturalWidth: w, naturalHeight: h } = e.target;
                            e.target.style.maxWidth = w > 400 ? '240px' : `${w}px`;
                            e.target.style.maxHeight = h > 400 ? '240px' : `${h}px`;
                          }}
                          onError={() => alert('Không thể tải hình ảnh.')}
                          className="rounded-lg cursor-pointer"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeFromDate(msg.timestamp || msg.createdAt)}
                        </div>
                      </div>
                    ) : typeof msg.content === 'string' && msg.content.startsWith('<sticker') ? (
                      <div>
                        <img
                          src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                          alt="sticker"
                          className="w-24 h-24 rounded-lg"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeFromDate(msg.timestamp || msg.createdAt)}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className={`px-4 py-2 rounded-lg break-words whitespace-pre-wrap prose prose-sm ${isSent
                            ? 'rounded-br-none bg-[#DBEBFF] text-black'
                            : 'rounded-bl-none bg-gray-100 text-black'
                            }`}
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                        {selectedGroup && (
                          <span className="text-gray-500 text-xs block mt-1">
                            {isSent
                              ? user.name
                              : selectedGroup.members?.find((m) => m.id === msg.senderId)?.name || 'Unknown'}
                          </span>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeFromDate(msg.timestamp || msg.createdAt)}
                        </div>
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



        <form onSubmit={handleSend} className={`border-t bg-white px-4 py-2 ${showSearchPanel || showConversationInfo ? 'pr-[10px]' : ''}`}>
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
                onChange={(e) => handleFileUpload(e.target.files, true)}
              />
            </label>
            <label className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Paperclip className="w-5 h-5 text-gray-700" />
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, false)}
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

      {showConversationInfo && (
        <ConversationInfo
        messages={messages}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}  // ✅ phải truyền xuống
        onClose={() => setShowConversationInfo(false)}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}  // ✅ truyền luôn để tăng khi cần

        />
      )}

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

                      socketRef.current.emit('revokeMessage', {
                        messageId: msg.id,
                        userId: user._id,
                        conversationId,
                      });

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