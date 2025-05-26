import React, { useState, useRef, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';
import { io } from 'socket.io-client';
import GroupSettingsPanel from '../GroupSettingsPanel.jsx';
import LeaderManagerPanel from '../LeaderManagerPanel.jsx';

const avatarCollection = [
  '/src/assets/image/1_family.jpg',
  '/src/assets/image/2_family.jpg',
  '/src/assets/image/3_family.jpg',
  '/src/assets/image/4_work.jpg',
  '/src/assets/image/5_work.jpg',
  '/src/assets/image/6_work.jpg',
  '/src/assets/image/7_friends.jpg',
  '/src/assets/image/8_friends.jpg',
  '/src/assets/image/9_friends.jpg',
  '/src/assets/image/10_school.jpg',
  '/src/assets/image/11_school.jpg',
  '/src/assets/image/12_school.jpg',
];

const BaseURL = 'http://localhost:3000';
const token = localStorage.getItem('accessToken');
const socketRef = { current: null };
if (!socketRef.current && token) {
  socketRef.current = io(BaseURL, {
    transports: ['websocket'],
    reconnection: false,
    auth: { token },
  });
}

const GroupProfileModal = ({ group, members, onClose, onGroupUpdated, isAdmin }) => {
  const [name, setName] = useState(group.name);
  const [step, setStep] = useState('profile');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (!socketRef.current) return;
    const handleGroupUpdate = ({ group }) => {
      onGroupUpdated?.({ ...group });
    };
    socketRef.current.on('groupInfoUpdated', handleGroupUpdate);
    return () => socketRef.current?.off('groupInfoUpdated', handleGroupUpdate);
  }, [onGroupUpdated]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file); // bạn có thể giữ là "files" như trong ChatArea

    try {
      const res = await fetch(`${BaseURL}/chat/upload/files`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      const uploaded = data?.attachments?.[0];
      if (!uploaded?.url) {
        alert("Không thể upload ảnh. Vui lòng thử lại.");
        return;
      }

      // Gửi URL lên WebSocket
      socketRef.current.emit('updateGroupInfo', {
        groupId: group.id,
        groupAvatar: uploaded.url, // ✅ gửi URL, không phải base64
      });
      setStep('profile');
    } catch (err) {
      console.error('[GroupProfileModal] Upload ảnh thất bại:', err);
      alert("Không thể tải ảnh lên máy chủ.");
    }
  };

  const handleSelectAvatar = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setStep('avatar-confirm');
  };

  // const handleConfirmAvatar = () => {
  //   if (selectedAvatar) {
  //     socketRef.current.emit('updateGroupInfo', {
  //       groupId: group.id,
  //       groupAvatar: selectedAvatar,
  //     });
  //     setStep('profile');
  //   }
  // };
  const handleConfirmAvatar = async () => {
    if (!selectedAvatar) return;

    // Trường hợp đã là URL → gửi luôn
    socketRef.current.emit('updateGroupInfo', {
      groupId: group.id,
      groupAvatar: selectedAvatar,
    });
    setStep('profile');
  };
  const handleSaveName = () => {
    if (name) {
      socketRef.current.emit('updateGroupInfo', {
        groupId: group.id,
        groupName: name,
      });
      setStep('profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md h-full sm:h-[540px] sm:rounded-lg shadow-lg overflow-hidden relative">
        {step === 'profile' && (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg">Thông tin nhóm</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 flex flex-col items-center">
              <img
                src={group.avatar || '/placeholder.svg'}
                alt="avatar"
                onClick={() => isAdmin && setStep('avatar')}
                className={`w-20 h-20 rounded-full object-cover border mb-2 ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
              />
              <div className="flex items-center gap-1">
                <h3
                  className={`font-semibold text-lg flex items-center gap-1 ${isAdmin ? 'cursor-pointer' : ''}`}
                  onClick={() => isAdmin && setStep('edit-name')}
                >
                  {name}
                  {isAdmin && <Pencil className="w-4 h-4 text-gray-500" />}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Nhắn tin
              </button>
            </div>
            <div className="px-4 py-2 border-t">
              <h4 className="text-sm font-semibold mb-1">Thành viên ({members.length})</h4>
              <div className="flex items-center space-x-2 overflow-x-auto">
                {members.slice(0, 5).map((m) => (
                  <img
                    key={m.userId._id}
                    src={m.userId.avatar || '/placeholder.svg'}
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                    title={m.userId.name}
                  />
                ))}
                {members.length > 5 && (
                  <span className="text-xs text-gray-500">+{members.length - 5} nữa</span>
                )}
              </div>
            </div>
            <div className="p-4 space-y-2 text-sm border-t">
              <button
                onClick={() => setStep('settings')}
                className="w-full text-left hover:bg-gray-100 px-3 py-2 rounded"
              >
                Quản lý nhóm
              </button>
              <button className="w-full text-left text-red-500 hover:bg-gray-100 px-3 py-2 rounded">
                Rời nhóm
              </button>
            </div>
          </>
        )}

        {step === 'avatar' && (
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setStep('profile')} className="text-sm text-blue-500">
                ← Cập nhật ảnh đại diện
              </button>
              <button onClick={() => setStep('profile')}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full py-2 bg-blue-100 text-blue-700 rounded flex items-center justify-center gap-2 mb-4"
            >
              📁 Tải lên từ máy tính
            </button>
            <h3 className="text-sm font-medium mb-2">Bộ sưu tập</h3>
            <div className="grid grid-cols-4 gap-3 overflow-y-auto">
              {avatarCollection.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="avatar-option"
                  onClick={() => handleSelectAvatar(url)}
                  className="w-14 h-14 rounded-full object-cover border cursor-pointer hover:ring-2 hover:ring-blue-400"
                />
              ))}
            </div>
          </div>
        )}

        {step === 'avatar-confirm' && (
          <div className="p-4 h-full flex flex-col items-center justify-between">
            <h2 className="text-lg font-semibold">Cập nhật ảnh đại diện</h2>
            <img
              src={selectedAvatar}
              alt="preview"
              className="w-40 h-40 rounded-full object-cover border my-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep('avatar')}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAvatar}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Cập nhật
              </button>
            </div>
          </div>
        )}

        {step === 'edit-name' && (
          <div className="p-4 h-full flex flex-col items-center justify-between">
            <h2 className="text-lg font-semibold">Đổi tên nhóm</h2>
            <div className="flex -space-x-4 my-4">
              {members.slice(0, 2).map((m, i) => (
                <img
                  key={i}
                  src={m.userId.avatar || '/placeholder.svg'}
                  className="w-10 h-10 rounded-full border-2 border-white"
                  alt="avatar"
                />
              ))}
            </div>
            <p className="text-sm text-center mb-2 text-gray-600">
              Tên nhóm mới sẽ hiển thị với tất cả thành viên.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-2 w-full rounded text-sm"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep('profile')}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveName}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}

        {step === 'settings' && (
          <GroupSettingsPanel
            conversationId={group.id}
            onClose={() => setStep('profile')}
            isReadOnly={!isAdmin}
            memberList={members}
            onShowLeaderPanel={() => setStep('leaders')}
          />
        )}

        {step === 'leaders' && (
          <div className="absolute top-0 left-0 w-full h-full bg-white z-30">
            <div className="w-full h-full">
              <LeaderManagerPanel
                members={members}
                conversationId={group.id}
                onClose={() => setStep('settings')}
                onRefreshMembers={() => {
                  if (typeof onGroupUpdated === 'function') {
                    onGroupUpdated(group);
                  }
                }}
              />
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default GroupProfileModal;