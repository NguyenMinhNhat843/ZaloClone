// ConversationInfo.jsx
import React, { useEffect, useState } from 'react';
import {
  Users,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  X,
  BellOff,
  Pin,
  UserPlus,
  Settings,
  ChevronRight,
  ChevronLeft,
  Lock,
} from 'lucide-react';
import MemberDetailPanel from './MemberDetailsPanel'; // đường dẫn đúng với bạn
import { useUser } from '../contexts/UserContext';
import { MediaSection, FileSection } from './ui/ConversationInfoMediaFile'; // Đường dẫn đúng với bạn
import GroupSettingsPanel from './GroupSettingsPanel'; // đường dẫn đúng
import LeaderManagerPanel from './LeaderManagerPanel'; // đổi path đúng nếu cần


const ConversationInfo = ({ messages, onClose, selectedGroup }) => {
  const [isMediaOpen, setIsMediaOpen] = useState(true);
  const [isFilesOpen, setIsFilesOpen] = useState(true);
  const [isLinksOpen, setIsLinksOpen] = useState(true);
  const [showMembers, setShowMembers] = useState(true);
  const [memberList, setMemberList] = useState([]); // ✅ Thêm state lưu danh sách thành viên
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const { user } = useUser();
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showLeaderPanel, setShowLeaderPanel] = useState(false);
  const [isAdminOnlyView, setIsAdminOnlyView] = useState(false);

  // 🐞 Debug selectedGroup
  console.log("selectedGroup:", selectedGroup);
  console.log("Danh sách thành viên:", selectedGroup?.participants);


  useEffect(() => {
    const fetchMembers = async () => {
      setMemberList([]); // ✅ Reset về rỗng trước khi fetch
      try {
        const res = await fetch(`http://localhost:3000/chat/conversations/${selectedGroup.id}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        const data = await res.json();
        setMemberList(data); // ✅ Lưu danh sách mới
      } catch (err) {
        console.error('[ConversationInfo] Lỗi khi lấy thành viên nhóm:', err);
      }
    };

    if (selectedGroup?.id) {
      fetchMembers();
    } else {
      setMemberList([]);
      setShowMemberPanel(false);
      setShowSettingsPanel(false);
    }
  }, [selectedGroup]);
  console.log("Danh sách thành viên:", memberList);
  // Check xem thành viên nào là admin
  const isAdmin = memberList.some(member => member.userId._id === user._id && member.role === 'admin');
  console.log("isAdmin:", isAdmin);
  const handleSettingsClick = () => {
    if (isAdmin) {
      setShowSettingsPanel(true);
      setIsAdminOnlyView(false);
    } else {
      setShowSettingsPanel(true);
      setIsAdminOnlyView(true);
    }
  };


  // Lấy media từ messages
  const attachmentMedia = messages.flatMap(msg =>
    (msg.attachments || []).filter(att => ['image', 'video'].includes(att.type)).map(att => ({
      id: msg.id,
      name: att.name || `media_${msg.id}`,
      url: att.url,
      type: att.type,
    }))
  );

  const media = [
    ...attachmentMedia,
    ...messages.filter(msg =>
      typeof msg.content === 'string' &&
      (msg.content.startsWith('<image') ||
        (msg.content.startsWith('<file') && (msg.content.includes("type='image'") || msg.content.includes("type='video'"))))
    ).map(msg => {
      if (msg.content.startsWith('<image')) {
        return {
          id: msg.id,
          name: `image_${msg.id}.jpg`,
          url: msg.content.match(/src=['"](.*?)['"]/)?.[1],
          type: 'image',
        };
      } else {
        return {
          id: msg.id,
          name: msg.content.match(/name='(.*?)'/)?.[1] || `media_${msg.id}`,
          url: msg.content.match(/url='(.*?)'/)?.[1] || '#',
          type: msg.content.includes("type='video'") ? 'video' : 'image',
        };
      }
    }),
  ];

  // Lấy file từ messages
  const attachmentFiles = messages.flatMap(msg =>
    (msg.attachments || []).filter(att => !['image', 'video'].includes(att.type)).map(att => ({
      id: msg.id,
      name: att.name || `file_${msg.id}`,
      url: att.url,
    }))
  );

  const files = [
    ...attachmentFiles,
    ...messages.filter(msg =>
      typeof msg.content === 'string' &&
      msg.content.startsWith('<file') &&
      !msg.content.includes("type='image'") &&
      !msg.content.includes("type='video'")
    ).map(msg => ({
      id: msg.id,
      name: msg.content.match(/name='(.*?)'/)?.[1] || `file_${msg.id}`,
      url: msg.content.match(/url='(.*?)'/)?.[1] || '#',
    })),
  ];

  const isUserInGroup = selectedGroup?.participants?.includes(user._id);


  // Lấy link từ messages
  const links = messages.filter(
    msg =>
      typeof msg.content === 'string' &&
      msg.content.includes('http') &&
      !msg.content.startsWith('<')
  ).map(msg => {
    const urlMatch = msg.content.match(/(https?:\/\/[^\s]+)/);
    return {
      id: msg.id,
      name: urlMatch ? urlMatch[0].substring(0, 25) + '...' : `link_${msg.id}`,
      url: urlMatch ? urlMatch[0] : '#',
    };
  });
  const shouldShowHeader = !showMemberPanel && !showSettingsPanel;

  return (
    <div className="w-80 h-screen bg-gray-100 border-l border-gray-200 overflow-y-auto relative">
      {shouldShowHeader && (
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Thông tin hội thoại</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
      {!showSettingsPanel ? (
        <div className="p-4 space-y-4">
          {selectedGroup && (
            <>
              {/* Thông tin nhóm */}
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="flex flex-col items-center">
                  <img
                    src={selectedGroup.avatar || '/placeholder.svg'}
                    alt={selectedGroup.name}
                    className="w-16 h-16 rounded-full object-cover mb-2 border"
                  />
                  <h3 className="font-semibold text-lg">{selectedGroup.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="text-sm text-gray-600 hover:text-black flex flex-col items-center">
                    <BellOff className="w-5 h-5 mb-1" />
                    Tắt thông báo
                  </button>
                  <button className="text-sm text-gray-600 hover:text-black flex flex-col items-center">
                    <Pin className="w-5 h-5 mb-1" />
                    Ghim hội thoại
                  </button>
                  <button className="text-sm text-gray-600 hover:text-black flex flex-col items-center">
                    <UserPlus className="w-5 h-5 mb-1" />
                    Thêm thành viên
                  </button>
                  <button
                    className="text-sm text-gray-600 hover:text-black flex flex-col items-center"
                    onClick={handleSettingsClick}
                  >
                    <Settings className="w-5 h-5 mb-1" />
                    Quản lý nhóm
                  </button>
                </div>
              </div>
              {/* Thành viên nhóm - dựa vào participants */}
              <div className="bg-white rounded-lg shadow-sm">
                <button
                  className="w-full p-3 hover:bg-gray-50 transition"
                  onClick={() => setShowMembers(!showMembers)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">Thành viên nhóm</span>
                    {showMembers ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  {showMembers && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-700">
                      <Users className="w-4 h-4" />
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => setShowMemberPanel(true)}
                      >
                        {selectedGroup?.participants?.length || 0} thành viên
                      </span>
                    </div>
                  )}
                </button>
              </div>


            </>
          )}

          {/* Media section */}
          <MediaSection media={media} onViewAll={() => console.log("Xem tất cả ảnh/video")} />


          {/* File section */}
          <FileSection files={files} onViewAll={() => console.log("Xem tất cả file")} />


          {/* Link section */}
          <div className="bg-white rounded-lg shadow-sm">
            <button
              className="w-full flex items-center justify-between p-3"
              onClick={() => setIsLinksOpen(!isLinksOpen)}
            >
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Link ({links.length})</span>
              </div>
              {isLinksOpen ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
            </button>
            {isLinksOpen && (
              <div className="p-3 border-t border-gray-100">
                {links.length > 0 ? (
                  links.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Chưa có link</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white mt-4 rounded-lg shadow-sm divide-y">
            <button className="w-full text-left px-4 py-3 text-sm text-blue-500 hover:bg-gray-50">
              Báo xấu
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50">
              Xóa lịch sử trò chuyện
            </button>
            {isUserInGroup && (
              <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50">
                Rời nhóm
              </button>
            )}
          </div>
        </div>
      ) : (
        <GroupSettingsPanel
          conversationId={selectedGroup?.id}
          onClose={() => setShowSettingsPanel(false)}
          isReadOnly={!isAdmin || isAdminOnlyView}
          memberList={memberList}
          onShowLeaderPanel={() => setShowLeaderPanel(true)}
        />
      )}
      {showMemberPanel && selectedGroup?.id && (
        <div className="absolute top-0 right-0 w-[320px] h-full bg-white border-l border-gray-200 shadow-lg z-10 overflow-y-auto">
          <MemberDetailPanel
            members={memberList}
            currentUserId={user._id}
            conversationId={selectedGroup.id}
            onClose={() => setShowMemberPanel(false)}
          />
        </div>
      )}
      {showLeaderPanel && selectedGroup?.id && memberList.length > 0 && (
        <div className="absolute top-0 right-0 w-[320px] h-full bg-white border-l border-gray-200 shadow-lg z-10 overflow-y-auto">
          <LeaderManagerPanel
            members={memberList}
            conversationId={selectedGroup.id}
            onClose={() => setShowLeaderPanel(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationInfo;