import React, { useState, useRef, useEffect } from 'react';
import { X, Users, MoreHorizontal } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { io } from 'socket.io-client';
import AddMembers from './AddMembers';

const BaseURL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('accessToken');

const MemberDetailPanel = ({ members, onClose, conversationId, onMembersUpdated,onRefreshMembers }) => {
  const { user } = useUser();
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const socketRef = useRef(null);

  const currentUserMember = members.find(m => m.userId._id === user._id);
  const currentUserRole = currentUserMember?.role;


  useEffect(() => {
    if (!token || !conversationId) return;

    socketRef.current = io(BaseURL, {
      transports: ['websocket'],
      reconnection: false,
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('[MemberPanel] ✅ Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('membersRemoved', ({ group }) => {
      if (group._id === conversationId) {
        console.log('[MemberPanel] 🔄 Thành viên đã được cập nhật');
        onRefreshMembers?.(); // ← sẽ gọi lại fetchMembers
      }
    });

    // Lắng nghe sự kiện thêm thành viên
    socketRef.current.on('membersAdded', (data) => {
      console.log('[MemberPanel] ✅ Thành viên mới:', data);
      // Cập nhật danh sách thành viên
      if (data.group && data.group.members) {
        onMembersUpdated(data.group.members); // Truyền danh sách thành viên mới
      }
    });

    // Lắng nghe sự kiện xóa thành viên
    socketRef.current.on('membersRemoved', (data) => {
    console.log('[MemberPanel] ✅ Thành viên bị xóa:', data);
    if (data.group && data.group._id === conversationId) {
      // Gọi lại API để lấy danh sách thành viên mới
      if (onRefreshMembers) {
        onRefreshMembers();
      } else if (onMembersUpdated) {
        axios.get(`${BaseURL}/chat/conversations/${conversationId}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => onMembersUpdated(data))
          .catch((err) => console.error('[MemberPanel] Lỗi khi lấy danh sách thành viên:', err));
      }
    }
  });

    return () => {
      socketRef.current?.off('membersAdded');
      socketRef.current?.off('membersRemoved');
      socketRef.current?.disconnect();
    };
  }, [conversationId, onMembersUpdated]);



  const handleMenuToggle = (userId) => {
    setMenuOpenId(prev => (prev === userId ? null : userId));
  };

  const handleRemoveMember = (memberId) => {
    if (!socketRef.current || !conversationId || !memberId) return;

    socketRef.current.emit('removeMembersFromGroup', {
      groupId: conversationId,
      members: [memberId],
    }, () => {
      if (onRefreshMembers) onRefreshMembers();
    });

    console.log(`[MemberPanel] 🚫 Gửi yêu cầu xóa user ${memberId} khỏi group ${conversationId}`);
  };
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center bg-white">
        <h2 className="w-full font-semibold text-lg flex items-center justify-center ">Thành viên</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Nút Thêm thành viên */}
      <div className="px-4 py-2 border-b">
        <button
          className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded flex items-center justify-center gap-2"
          onClick={() => setShowAddMembers(true)}
        >
          <Users className="w-4 h-4" />
          Thêm thành viên
        </button>
      </div>

      {/* Danh sách thành viên */}
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        {members.map((m) => {
          const isSelf = m.userId._id === user._id;
          const isAdmin = m.role === 'admin';
          const showMenuButton =
            (currentUserRole === 'admin' && !isAdmin && !isSelf) || isSelf;

          return (
            <div
              key={m.userId._id}
              className="group relative flex items-center justify-between p-2 rounded hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.userId.avatar || '/placeholder.svg'}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />
                <div>
                  <p className="font-medium text-sm">{m.userId.name}</p>
                  {isAdmin && (
                    <p className="text-xs text-gray-500">Trưởng nhóm</p>
                  )}
                </div>
              </div>

              {showMenuButton && (
                <div className="relative">
                  <button
                    onClick={() => handleMenuToggle(m.userId._id)}
                    className="hidden group-hover:block"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>

                  {menuOpenId === m.userId._id && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg border text-sm z-50">
                      {isSelf ? (
                        <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                          Rời nhóm
                        </button>
                      ) : currentUserRole === 'admin' && (
                        <>
                          <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                            Thêm phó nhóm
                          </button>
                          <button
                            onClick={() => handleRemoveMember(m.userId._id)}
                            className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500"
                          >
                            Xóa khỏi nhóm
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
       {/* Modal AddMembers */}
      {showAddMembers && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white w-[480px] max-h-[90vh] rounded-xl shadow-lg overflow-hidden">
            <AddMembers
              onClose={() => setShowAddMembers(false)}
              conversationId={conversationId}
              onMembersUpdated={onMembersUpdated}
            />
          </div>
        </div>
      )}
    </div> 
  );
};

      export default MemberDetailPanel;