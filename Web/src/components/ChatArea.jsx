import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
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
} from "lucide-react";
import { useUser } from "../contexts/UserContext";
import EmojiGifStickerPicker from "./EmojiGifStickerPicker";
import RichTextToolbar from "./ui/RichTextToolbar";
import SearchPanel from "./SearchPanel";
import ConversationInfo from "./ConversationInfo"; // Import ConversationInfo
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Hàm renderFilePreview (đã sửa)
// Hàm renderFilePreview
function renderFilePreview(content, onPreviewVideo, setPreviewImageUrl) {
  const { name, size, url, type: rawType } = content;

  if (!url || !size) {
    console.error("[renderFilePreview] Thiếu thông tin cần thiết:", content);
    return (
      <div className="rounded-lg bg-red-100 p-3 text-sm text-red-900">
        Lỗi: Không thể hiển thị file do thiếu thông tin.
      </div>
    );
  }

  const fileName = name || url?.split("/").pop()?.split("?")[0] || "file";

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const type = (() => {
    if (rawType === "image") return "image";
    if (rawType === "video") return "video";
    if (["word", "excel", "pdf", "ppt", "text"].includes(rawType))
      return rawType;
    return "file";
  })();

  if (type === "image") {
    return (
      <div className="overflow-hidden rounded-lg bg-blue-100 text-sm text-blue-900">
        <div className="flex items-center justify-center bg-black">
          <img
            src={url}
            alt={fileName}
            className="max-h-48 w-full cursor-pointer object-contain"
            onClick={() => setPreviewImageUrl(url)}
            onError={() => alert("Không thể tải hình ảnh.")}
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-start gap-2">
            <div className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-md bg-purple-600 text-xs text-white">
              🖼️
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {truncateMiddle(fileName)}
              </div>
              <div className="text-xs text-gray-500">
                {formatFileSize(size)} ·{" "}
                <span className="italic">Đã lưu trên Cloud</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="text-lg text-blue-600 hover:text-blue-800"
          >
            ⬇️
          </button>
        </div>
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="overflow-hidden rounded-lg bg-blue-100 text-sm text-blue-900">
        <div className="flex items-center justify-center bg-black">
          <video
            src={url}
            className="max-h-48 w-full cursor-pointer"
            onClick={() => onPreviewVideo(url)}
            onError={() => alert("Không thể tải video.")}
            muted
            preload="metadata"
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-start gap-2">
            <div className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-md bg-purple-600 text-xs text-white">
              ▶
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {truncateMiddle(fileName)}
              </div>
              <div className="text-xs text-gray-500">
                {formatFileSize(size)} ·{" "}
                <span className="italic">Đã lưu trên Cloud</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="text-lg text-blue-600 hover:text-blue-800"
          >
            ⬇️
          </button>
        </div>
      </div>
    );
  }

  const typeMapping = {
    word: { label: "DOC", bgColor: "bg-blue-500" },
    excel: { label: "XLS", bgColor: "bg-green-600" },
    pdf: { label: "PDF", bgColor: "bg-red-600" },
    ppt: { label: "PPT", bgColor: "bg-orange-500" },
    text: { label: "TXT", bgColor: "bg-gray-500" },
    file: { label: "FILE", bgColor: "bg-gray-500" },
  };

  const { label, bgColor } = typeMapping[type] || typeMapping.file;

  return (
    <div className="flex items-center gap-3 rounded-lg bg-blue-100 p-3 text-sm text-blue-900">
      <div className="flex-shrink-0">
        <div
          className={`h-12 w-10 ${bgColor} flex items-center justify-center rounded-md text-xs font-bold text-white`}
        >
          {label}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="font-semibold">{truncateMiddle(fileName)}</div>
        <div className="text-xs text-gray-600">
          {formatFileSize(size)} · Đã lưu trên Cloud
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="text-blue-600 hover:text-blue-800"
      >
        ⬇️
      </button>
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
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Hàm truncateMiddle
function truncateMiddle(text, maxLength = 20) {
  if (text.length <= maxLength) return text;
  const start = text.slice(0, Math.floor(maxLength / 2));
  const end = text.slice(-Math.floor(maxLength / 2));
  return `${start}...${end}`;
}

export default function ChatArea({ selectedUser, selectedGroup }) {
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showConversationInfo, setShowConversationInfo] = useState(false); // Thêm state cho ConversationInfo
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [menuData, setMenuData] = useState({
    id: null,
    senderId: null,
    position: { x: 0, y: 0 },
  });
  const { user } = useUser();
  const token = localStorage.getItem("accessToken");
  const baseUrl = "http://localhost:3000";
  const inputRef = useRef();
  const bottomRef = useRef(null);
  const moreButtonRefs = useRef({});
  const socketRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const menuLeft =
    menuData.senderId === user?._id
      ? menuData.position.x - 208
      : menuData.position.x - 120;

  // Debug user._id
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
      console.error("[ChatArea] ❌ user or user._id is undefined:", user);
    } else {
      console.log("[ChatArea] ✅ Current user._id:", user._id);
    }
  }, [user]);

  // Initialize WebSocket
  useEffect(() => {
    console.log(token);
    socketRef.current = io(baseUrl, {
      transports: ["websocket"],
      reconnection: false,
      auth: { token }, // nếu đã lấy token từ localStorage phía trên
    });

    socketRef.current.on("connect", () => {
      console.log(
        "[ChatArea] ✅ Socket connected with id:",
        socketRef.current.id,
      );
    });

    socketRef.current.on("receiveMessage", (msg) => {
      console.log(
        "[ChatArea] 📩 Received message:",
        JSON.stringify(msg, null, 2),
      );
      if (
        msg.text &&
        (msg.text === "[Hình ảnh]" || msg.text === "[Tài liệu]")
      ) {
        console.log(
          "[ChatArea] 📎 Attachment message received:",
          msg.attachments,
        );
      }
      if (!user || !user._id) {
        console.warn(
          "[ChatArea] ❌ currentUser is null or user._id is undefined",
        );
        return;
      }

      const conversationId =
        selectedUser?.conversationId || selectedGroup?.conversationId;
      if (msg.conversationId === conversationId) {
        const normalizedSenderId = msg.sender?._id
          ? String(msg.sender._id)
          : String(msg.sender);
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id,
            senderId: normalizedSenderId,
            content: msg.text,
            timestamp: msg.createdAt,
            conversationId: msg.conversationId,
            attachments: msg.attachments || [], // Đảm bảo attachments luôn là mảng
            ...(selectedUser
              ? { receiverId: msg.receiverId }
              : { groupId: msg.groupId }),
          },
        ]);
      }
    });

    // ... các sự kiện socket khác giữ nguyên (messageRevoked, messageDeleted) ...

    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("receiveMessage");
      socketRef.current.off("messageRevoked");
      socketRef.current.off("messageDeleted");
      socketRef.current.disconnect();
    };
  }, [user, selectedUser, selectedGroup, baseUrl, token]);

  useEffect(() => {
    console.log("Selected User: ",selectedUser);
    const conversationId = selectedUser?.conversationId || selectedGroup?.conversationId;


    if (conversationId) {
      if (conversationId.startsWith("temp_")) {
        setMessages([]); // Đặt lại messages cho cuộc trò chuyện tạm thời
      } else {
        const fetchMessages = async () => {
          try {
            const response = await fetch(`${baseUrl}/chat/messages/${conversationId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
  
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
  
            const data = await response.json();
  
            // Kiểm tra xem data có phải là mảng không
            if (!Array.isArray(data)) {
              console.error("[ChatArea] Dữ liệu trả về không phải mảng:", data);
              setMessages([]);
              return;
            }
  
            const filtered = data
              .filter((msg) => !(msg.deletedFor || []).includes(user._id))
              .map((msg) => ({
                id: msg._id,
                senderId: msg.sender?._id || msg.sender,
                content: msg.text,
                timestamp: msg.createdAt || msg.timestamp,
                conversationId: msg.conversationId,
                attachments: msg.attachments || [],
                ...(selectedUser ? { receiverId: msg.receiverId } : { groupId: msg.groupId }),

              }));

            const lastLocal = messages[messages.length - 1]?.id;
            const lastServer = filtered[filtered.length - 1]?.id;
  
            if (lastLocal !== lastServer || filtered.length !== messages.length) {
              setMessages(filtered);
            }
          } catch (err) {
            console.error("[ChatArea] Lỗi khi lấy tin nhắn:", err);
            setMessages([]); // Đặt lại messages nếu có lỗi
          }
        };
  
        fetchMessages(); // Gọi lần đầu
        intervalId = setInterval(fetchMessages, 3000); // Giảm tần suất polling xuống 3s
      }
    } else {
      setMessages([]); // Đặt lại messages nếu không có conversationId
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedUser?.conversationId, selectedGroup?.conversationId, token, baseUrl]);
  

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const values = Object.values(moreButtonRefs.current);
      const isClickInsideButton = values.some(
        (el) => el && el.contains(e.target),
      );
      const isClickInsideMenu = menuRef.current?.contains(e.target);

      if (!isClickInsideButton && !isClickInsideMenu) {
        setMenuData({ id: null, senderId: null, position: { x: 0, y: 0 } });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const receiverId = selectedUser
      ? selectedUser._id || selectedUser.id
      : undefined;

    if (selectedUser && !receiverId) {
      console.warn("[ChatArea] selectedUser thiếu _id và id:", selectedUser);
      alert("Không thể gửi file: Thiếu ID người nhận.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const uploadResponse = await axios.post(
        `${baseUrl}/chat/upload/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const { attachments } = uploadResponse.data;
      const conversationId =
        selectedUser?.conversationId || selectedGroup?.conversationId;

      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        const mime = attachment.mimeType || files[i]?.type || "";

        let type = "file";
        if (mime.startsWith("image/")) type = "image";
        else if (mime.startsWith("video/")) type = "video";
        else if (mime === "application/pdf") type = "pdf";
        else if (
          mime.includes("msword") ||
          mime.includes("officedocument.wordprocessing")
        )
          type = "word";
        else if (mime.includes("spreadsheet") || mime.includes("excel"))
          type = "excel";
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
          conversationId: conversationId?.startsWith("temp_")
            ? undefined
            : conversationId,
        };

        if (isImageFromCamera && type === "image") {
          const { width, height } = await new Promise((resolve) => {
            const img = new Image();
            img.src = attachment.url;
            img.onload = () =>
              resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 0, height: 0 });
          });
          sendFileMessage(
            "",
            [{ ...fileAttachment, width, height }],
            commonData,
          );
        } else {
          sendFileMessage("", [fileAttachment], commonData);
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
              console.log("[ChatArea] Conv Temp: ",conv);
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

  const sendFileMessage = (
    text,
    attachments,
    { senderId, receiverId, groupId, conversationId },
  ) => {
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
      text,
      attachments: attachments || [],
      conversationId: conversationId?.startsWith("temp_")
        ? undefined
        : conversationId,
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
      while (
        lineStart.previousSibling &&
        lineStart.previousSibling.nodeName !== "BR"
      ) {
        lineStart = lineStart.previousSibling;
      }

      let lineEnd = node;
      while (lineEnd.nextSibling && lineEnd.nextSibling.nodeName !== "BR") {
        lineEnd = lineEnd.nextSibling;
      }

      lineRange.setStartBefore(lineStart);
      lineRange.setEndAfter(lineEnd);
      selection.removeAllRanges();
      selection.addRange(lineRange);
    };

    const autoWrapTypes = ["bold", "italic", "underline"];

    if (autoWrapTypes.includes(type)) {
      autoWrapLineIfNoSelection();
      document.execCommand(type);
      return;
    }

    if (type === "heading") {
      document.execCommand("formatBlock", false, "h3");
    } else if (type === "list") {
      document.execCommand("insertUnorderedList");
    } else if (
      [
        "insertOrderedList",
        "insertUnorderedList",
        "justifyLeft",
        "justifyRight",
        "justifyCenter",
        "undo",
        "redo",
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
    if (
      !htmlContent ||
      (!selectedUser && !selectedGroup) ||
      !user ||
      !user._id
    ) {
      console.warn(
        "[ChatArea] Cannot send message: missing content, user, or conversation",
      );
      return;
    }

    const receiverId = selectedUser
      ? selectedUser._id || selectedUser.id
      : undefined;

    if (selectedUser && !receiverId) {
      console.warn("[ChatArea] selectedUser thiếu _id và id:", selectedUser);
      alert("Không thể gửi tin nhắn: Thiếu ID người nhận.");
      return;
    }

    const conversationId =
      selectedUser?.conversationId || selectedGroup?.conversationId;
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
      conversationId: conversationId.startsWith("temp_")
        ? undefined
        : conversationId, // Không gửi conversationId nếu là tạm
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
                .catch((err) =>
                  console.error("Error fetching conversations:", err),
                );
            }
          })
          .catch((err) =>
            console.error("Error fetching new conversation:", err),
          );
      }, 1000); // Đợi 1 giây để server xử lý
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "x") {
      e.preventDefault();
      setShowFormatting((prev) => !prev);
    }
  };

  const handleSpecialMessage = (value) => {
    if (!value || value === "__close__") {
      setShowEmojiPicker(false);
      return;
    }

    if (
      !value.startsWith("<sticker") &&
      !value.startsWith("<image") &&
      !value.startsWith("<file")
    ) {
      insertTextAtCursor(value);
      return;
    }

    if (!user || !user._id) {
      console.warn(
        "[ChatArea] Cannot send special message: user or user._id is undefined",
      );
      return;
    }

    // Lấy receiverId từ selectedUser._id hoặc selectedUser.id
    const receiverId = selectedUser
      ? selectedUser._id || selectedUser.id
      : undefined;

    if (selectedUser && !receiverId) {
      console.warn("[ChatArea] selectedUser thiếu _id và id:", selectedUser);
      alert("Không thể gửi tin nhắn: Thiếu ID người nhận.");
      return;
    }

    const newMessage = {
      id: Date.now(),
      senderId: user._id,
      content: value,
      timestamp: new Date().toISOString(),
      conversationId:
        selectedUser?.conversationId || selectedGroup?.conversationId,
      ...(selectedUser ? { receiverId } : { groupId: selectedGroup?.id }),
    };

    console.log(
      "[ChatArea] Sending special message with senderId:",
      user._id,
      "receiverId:",
      receiverId,
    );
    setMessages((prev) => [...prev, newMessage]);
    socketRef.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      groupId: selectedGroup ? selectedGroup.id : undefined,
      text: value,
      conversationId:
        selectedUser?.conversationId || selectedGroup?.conversationId,
    });
    setShowEmojiPicker(false);
  };

  // Hàm xử lý toggle SearchPanel
  const toggleSearchPanel = () => {
    setShowSearchPanel((prev) => !prev);
    if (showConversationInfo) setShowConversationInfo(false); // Tắt ConversationInfo nếu đang mở
  };

  // Hàm xử lý toggle ConversationInfo
  const toggleConversationInfo = () => {
    setShowConversationInfo((prev) => !prev);
    if (showSearchPanel) setShowSearchPanel(false); // Tắt SearchPanel nếu đang mở
  };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Chọn một người dùng hoặc nhóm để bắt đầu trò chuyện
        </p>
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <p className="text-red-500">
          Lỗi: Người dùng chưa đăng nhập hoặc thiếu ID người dùng
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full">
      <div className="flex h-full flex-1 flex-col bg-gray-50">
        <div
          className={`items-center bg-white p-4 shadow-sm ${showSearchPanel || showConversationInfo ? "pr-[10px]" : ""}`}
        >
          {selectedUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={selectedUser.avatar || "/placeholder.svg"}
                  alt={selectedUser.name}
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <h2 className="font-semibold">{selectedUser.name}</h2>
              </div>
              <div className="flex justify-around">
                <button className="rounded-full p-2 hover:bg-gray-100">
                  <Phone className="h-6 w-6 text-gray-600" />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-100">
                  <Video className="h-6 w-6 text-gray-600" />
                </button>
                <div className="relative">
                  <button
                    className={`rounded-full p-2 hover:bg-gray-100 ${showSearchPanel ? "bg-blue-100" : ""}`}
                    onClick={toggleSearchPanel}
                  >
                    <Search
                      className={`h-6 w-6 ${showSearchPanel ? "text-blue-600" : "text-gray-600"}`}
                    />
                  </button>
                </div>
                <button
                  className={`rounded-full p-2 hover:bg-gray-100 ${showConversationInfo ? "bg-blue-100" : ""}`}
                  onClick={toggleConversationInfo}
                >
                  <LayoutList
                    className={`h-6 w-6 ${showConversationInfo ? "text-blue-600" : "text-gray-600"}`}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <img
                src={selectedGroup.avatar || "/placeholder.svg"}
                alt={selectedGroup.name}
                className="mr-3 h-10 w-10 rounded-full"
              />
              {/* <h2 className="font-semibold">{selectedGroup.name}</h2> */}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-[#ebecf0]">
          <div
            className={`flex-1 space-y-2 overflow-y-auto p-4 ${showSearchPanel || showConversationInfo ? "pr-[10px]" : ""}`}
          >
            {messages.map((msg) => {
              const isSent = String(msg.senderId) === String(user._id);
              const isAttachmentMessage =
                Array.isArray(msg.attachments) &&
                msg.attachments.length > 0 &&
                msg.attachments.every((att) => att.url && att.type && att.size); // bỏ kiểm tra name

              return (
                <div
                  key={msg.id}
                  className={`group flex items-center gap-2 px-2 ${isSent ? "justify-end" : "justify-start"}`}
                >
                  {isSent && (
                    <div className="mr-2 flex items-center space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        title="Trích dẫn"
                      >
                        <Quote className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        title="Chuyển tiếp"
                      >
                        <CornerDownRight className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        title="Thêm"
                        onClick={() => handleOpenOptions(msg)}
                        ref={(el) => (moreButtonRefs.current[msg.id] = el)}
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  )}

                  {!isSent && (
                    <img
                      src={
                        selectedUser
                          ? selectedUser.avatar
                          : selectedGroup.avatar
                      }
                      alt="avatar"
                      className="h-6 w-6 rounded-full"
                    />
                  )}

                  <div className="group relative max-w-[70%]">
                    {isAttachmentMessage ? (
                      msg.attachments.map((att, index) => {
                        if (!att.url || !att.type || !att.size) {
                          console.error("[ChatArea] Invalid attachment:", att);
                          return (
                            <div
                              key={index}
                              className="rounded-lg bg-red-100 p-3 text-sm text-red-900"
                            >
                              Lỗi: Không thể hiển thị file do thiếu thông tin.
                            </div>
                          );
                        }

                        const fileName =
                          att.name ||
                          att.url.split("/").pop()?.split("?")[0] ||
                          "file";

                        if (att.type === "image") {
                          return (
                            <div key={index} className="mb-1">
                              <img
                                src={att.url}
                                alt={fileName}
                                className="max-h-[240px] max-w-[240px] cursor-pointer rounded-lg"
                                onClick={() => setPreviewImageUrl(att.url)}
                                onError={() => alert("Không thể tải hình ảnh.")}
                              />
                              <div className="mt-1 text-xs text-gray-500">
                                {formatTimeFromDate(msg.createdAt)}
                              </div>
                            </div>
                          );
                        }

                        if (att.type === "video") {
                          return (
                            <div key={index} className="mb-1">
                              <video
                                src={att.url}
                                className="max-h-[240px] max-w-[240px] cursor-pointer rounded-lg"
                                onClick={() => setPreviewVideoUrl(att.url)}
                                onError={() => alert("Không thể tải video.")}
                                muted
                                preload="metadata"
                              />
                              <div className="mt-1 text-xs text-gray-500">
                                {formatTimeFromDate(msg.createdAt)}
                              </div>
                            </div>
                          );
                        }

                        // Default render: file, word, excel, text...
                        return (
                          <div key={index} className="mb-1">
                            {renderFilePreview(
                              att,
                              setPreviewVideoUrl,
                              setPreviewImageUrl,
                            )}
                            <div className="mt-1 text-xs text-gray-500">
                              {formatTimeFromDate(msg.createdAt)}
                            </div>
                          </div>
                        );
                      })
                    ) : typeof msg.content === "string" &&
                      msg.content.startsWith("<file") ? (
                      <div>
                        {renderFilePreview(
                          msg.content,
                          setPreviewVideoUrl,
                          setPreviewImageUrl,
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          {formatTimeFromDate(msg.createdAt)}
                        </div>
                      </div>
                    ) : typeof msg.content === "string" &&
                      msg.content.startsWith("<image") ? (
                      <div>
                        <img
                          src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                          alt="uploaded"
                          onClick={() =>
                            setPreviewImageUrl(
                              msg.content.match(/src=['"](.*?)['"]/)[1],
                            )
                          }
                          onLoad={(e) => {
                            const { naturalWidth: w, naturalHeight: h } =
                              e.target;
                            e.target.style.maxWidth =
                              w > 400 ? "240px" : `${w}px`;
                            e.target.style.maxHeight =
                              h > 400 ? "240px" : `${h}px`;
                          }}
                          onError={() => alert("Không thể tải hình ảnh.")}
                          className="cursor-pointer rounded-lg"
                        />
                        <div className="mt-1 text-xs text-gray-500">
                          {formatTimeFromDate(msg.createdAt)}
                        </div>
                      </div>
                    ) : typeof msg.content === "string" &&
                      msg.content.startsWith("<sticker") ? (
                      <div>
                        <img
                          src={msg.content.match(/src=['"](.*?)['"]/)[1]}
                          alt="sticker"
                          className="h-24 w-24 rounded-lg"
                        />
                        <div className="mt-1 text-xs text-gray-500">
                          {formatTimeFromDate(msg.createdAt)}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className={`prose prose-sm whitespace-pre-wrap break-words rounded-lg px-4 py-2 ${
                            isSent
                              ? "rounded-br-none bg-[#DBEBFF] text-black"
                              : "rounded-bl-none bg-gray-100 text-black"
                          }`}
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                        {selectedGroup && (
                          <span className="mt-1 block text-xs text-gray-500">
                            {isSent
                              ? user.name
                              : selectedGroup.members?.find(
                                  (m) => m.id === msg.senderId,
                                )?.name || "Unknown"}
                          </span>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          {formatTimeFromDate(msg.createdAt)}
                        </div>
                      </>
                    )}
                  </div>

                  {!isSent && (
                    <div className="ml-2 flex items-center space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        title="Trích dẫn"
                      >
                        <Quote className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        title="Chuyển tiếp"
                      >
                        <CornerDownRight className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        title="Thêm"
                        onClick={() => handleOpenOptions(msg)}
                        ref={(el) => (moreButtonRefs.current[msg.id] = el)}
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className={`border-t bg-white px-4 py-2 ${showSearchPanel || showConversationInfo ? "pr-[10px]" : ""}`}
        >
          {showEmojiPicker && (
            <div className="absolute bottom-28 left-4 z-50 w-[380px]">
              <EmojiGifStickerPicker
                onSelect={(val) => handleSpecialMessage(val)}
                onSendMessage={handleSpecialMessage}
              />
            </div>
          )}

          <div className="mb-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="rounded p-1 hover:bg-gray-100"
            >
              <Smile className="h-5 w-5 text-gray-700" />
            </button>
            <label className="cursor-pointer rounded p-1 hover:bg-gray-100">
              <Camera className="h-5 w-5 text-gray-700" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files, true)}
              />
            </label>
            <label className="cursor-pointer rounded p-1 hover:bg-gray-100">
              <Paperclip className="h-5 w-5 text-gray-700" />
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
              className="rounded p-1 hover:bg-gray-100"
            >
              <LayoutList className="h-5 w-5 text-gray-700" />
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
              className="max-h-[200px] min-h-[40px] flex-1 overflow-y-auto rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tin nhắn..."
              onKeyDown={handleKeyDown}
              onInput={() => {}}
            ></div>
            <button
              type="submit"
              className="ml-2 rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {showSearchPanel && (
        <div className="h-full w-[320px] border-l border-gray-200 bg-white">
          <SearchPanel
            messages={messages}
            onClose={() => setShowSearchPanel(false)}
          />
        </div>
      )}

      {showConversationInfo && (
        <ConversationInfo
          messages={messages}
          onClose={() => setShowConversationInfo(false)}
        />
      )}

      {previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <img
              src={previewImageUrl}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
            />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute right-2 top-2 rounded-full bg-black bg-opacity-50 p-1 text-xl text-white hover:bg-opacity-70"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
            />
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute right-2 top-2 rounded-full bg-black bg-opacity-50 p-1 text-xl text-white hover:bg-opacity-70"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {menuData.id !== null && (
        <div
          ref={menuRef}
          className="fixed z-[9999] w-52 rounded-md border border-gray-200 bg-white shadow-lg"
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
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                      onClick={() => {
                        const messageId = msg.id;
                        socketRef.current.emit("deleteMessage", {
                          messageId,
                          userId: user._id,
                          type: "everyone",
                          conversationId:
                            selectedUser?.conversationId ||
                            selectedGroup?.conversationId,
                        });
                        setMessages((prev) =>
                          prev.filter((m) => m.id !== messageId),
                        );
                        setMenuData({
                          id: null,
                          senderId: null,
                          position: { x: 0, y: 0 },
                        });
                      }}
                    >
                      Xóa tin nhắn
                    </button>
                  )}
                  {isMyMessage && <hr className="my-1" />}
                  <button
                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                    onClick={() => {
                      const conversationId =
                        selectedUser?.conversationId ||
                        selectedGroup?.conversationId;

                      socketRef.current.emit("revokeMessage", {
                        messageId: msg.id,
                        userId: user._id,
                        conversationId,
                      });

                      setMenuData({
                        id: null,
                        senderId: null,
                        position: { x: 0, y: 0 },
                      });
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
