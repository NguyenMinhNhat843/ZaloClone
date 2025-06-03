import React, { useState, useRef } from 'react';
import { useEffect } from 'react';

import { X } from 'lucide-react';
import AddViceLeaderModal from './ui/AddViceLeaderModal';
import TransferLeaderModal from './ui/TransferLeaderModal';
import { io } from 'socket.io-client';

const LeaderManagerPanel = ({ members = [], onClose,conversationId, onRefreshMembers  }) => {
    const token = localStorage.getItem('accessToken');
    const BaseURL = import.meta.env.VITE_BASE_URL;
    const leader = members.find((m) => m.role === 'admin');
    const coLeaders = members.filter((m) => m.role === 'co-leader');
    // Show modal to add vice leader
    const [showViceModal, setShowViceModal] = useState(false);
    // Show modal to transfer leader
    const [showTransferModal, setShowTransferModal] = useState(false);
    const socketRef = useRef(null);

    if (!socketRef.current && token) {
        socketRef.current = io(BaseURL, {
            transports: ['websocket'],
            reconnection: false,
            auth: { token },
        });
    }
    useEffect(() => {
        if (!socketRef.current) return;
      
        socketRef.current.on('groupAdminChanged', ({ group }) => {
          console.log('[LeaderManagerPanel] ✅ Đã nhận sự kiện groupAdminChanged:', group);
          if (onRefreshMembers) onRefreshMembers(); // gọi lại để cập nhật UI
        });
      
        return () => {
          socketRef.current?.off('groupAdminChanged');
        };
      }, []);
    const handleTransferLeader = (newLeaderId) => {
        if (!socketRef.current || !conversationId || !newLeaderId) return;

        socketRef.current.emit('changeGroupAdmin', {
            groupId: conversationId,
            newAdminId: newLeaderId,
        });

        console.log('[LeaderManagerPanel] 👑 Gửi yêu cầu chuyển quyền trưởng nhóm:', newLeaderId);
        setShowTransferModal(false);
        if (onRefreshMembers) onRefreshMembers();
    };
    return (
        <div className="h-full flex flex-col bg-white w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg">Trưởng & phó nhóm</h2>
                <button onClick={onClose}>
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto">
                {/* Trưởng nhóm */}
                <div>
                    <h3 className="text-sm font-semibold mb-2">Trưởng nhóm</h3>
                    {leader ? (
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <img
                                src={leader.userId.avatar || '/placeholder.svg'}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-medium text-sm">{leader.userId.name}</p>
                                <p className="text-xs text-gray-500">Trưởng nhóm</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có trưởng nhóm</p>
                    )}
                </div>

                {/* Phó nhóm */}
                <div>
                    <h3 className="text-sm font-semibold mb-2">Phó nhóm</h3>
                    {coLeaders.length > 0 ? (
                        <div className="space-y-2">
                            {coLeaders.map((m) => (
                                <div key={m.userId._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                    <img
                                        src={m.userId.avatar || '/placeholder.svg'}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-sm">{m.userId.name}</p>
                                        <p className="text-xs text-gray-500">Phó nhóm</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có phó nhóm</p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    <button onClick={() => setShowViceModal(true)}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">
                        Thêm phó nhóm
                    </button>
                    <button onClick={() => setShowTransferModal(true)}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">
                        Chuyển quyền trưởng nhóm
                    </button>
                </div>
            </div>
            {showViceModal && (
                <AddViceLeaderModal
                    members={members}
                    onClose={() => setShowViceModal(false)}
                    onConfirm={(userId) => {
                        console.log('Chọn phó nhóm:', userId);
                        // TODO: gọi API cập nhật role thành 'vice'
                        setShowViceModal(false);
                    }}
                />
            )}
            {showTransferModal && (
                <TransferLeaderModal
                    members={members}
                    currentLeaderId={members.find(m => m.role === 'admin')?.userId._id}
                    onClose={() => setShowTransferModal(false)}
                    onConfirm={handleTransferLeader}
                />
            )}
        </div>
    );
};

export default LeaderManagerPanel;