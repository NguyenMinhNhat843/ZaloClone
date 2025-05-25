import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const baseUrl = 'http://localhost:3000';

export default function AddMembers({ onClose, conversationId, onMembersUpdated }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const [friends, setFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const userId = user?._id;
  const token = localStorage.getItem('accessToken');

  console.log('AddMembers - conversationId nhận được:', conversationId);

  useEffect(() => {
    if (!token || !conversationId) return;

    socketRef.current = io(baseUrl, {
      transports: ['websocket'],
      reconnection: false,
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('[AddMembers] ✅ Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('membersAdded', async (data) => {
      console.log('[AddMembers] ✅ Thành viên mới:', data);
      setErrorMessage('Thêm thành viên thành công!');
    
      let updatedParticipants = data.group?.participants;
    
      // Dự phòng: Nếu server không trả về participants, gọi API để lấy
      if (!updatedParticipants && data.group?.conversationId) {
        try {
          const response = await axios.get(
            `${baseUrl}/chat/conversations/${data.group.conversationId}`, // Sử dụng conversationId
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('[AddMembers] Dữ liệu nhóm từ API:', response.data);
    
          // Kiểm tra dữ liệu từ API
          if (response.data && response.data.participants) {
            updatedParticipants = response.data.participants;
          } else {
            throw new Error('Dữ liệu nhóm từ API không đầy đủ');
          }
        } catch (error) {
          console.error('[AddMembers] Lỗi khi lấy danh sách thành viên:', error);
          setErrorMessage('Thêm thành viên thành công, nhưng không thể cập nhật danh sách thành viên.');
        }
      }
    
      // Nếu có participants, gọi onMembersUpdated
      if (updatedParticipants) {
        onMembersUpdated(updatedParticipants);
      } else {
        console.warn('[AddMembers] Không thể lấy danh sách thành viên mới');
        setErrorMessage('Thêm thành viên thành công, nhưng không thể cập nhật danh sách thành viên ngay lập tức.');
      }
    
      setTimeout(() => {
        onClose();
      }, 1000);
    });

    socketRef.current.on('error', (data) => {
      console.error('[AddMembers] ❌ Lỗi từ server:', data);
      setErrorMessage(data.message || 'Không thể thêm thành viên. Vui lòng thử lại.');
      setIsLoading(false);
    });

    return () => {
      socketRef.current?.off('membersAdded');
      socketRef.current?.off('error');
      socketRef.current?.disconnect();
    };
  }, [conversationId, onMembersUpdated, onClose]);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Không có refresh token. Vui lòng đăng nhập lại.');
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/refresh', {
        refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      const expiresInMinutes = 30;
      const expirationTime = new Date().getTime() + expiresInMinutes * 60 * 1000;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('tokenExpiry', expirationTime);

      return newAccessToken;
    } catch (error) {
      console.error('Lỗi khi làm mới token:', error);
      throw new Error('Không thể làm mới token. Vui lòng đăng nhập lại.');
    }
  };

  const getValidToken = async () => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const currentTime = new Date().getTime();

    if (!token) {
      throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
    }

    if (tokenExpiry && currentTime > tokenExpiry) {
      try {
        return await refreshAccessToken();
      } catch (error) {
        throw error;
      }
    }

    return token;
  };

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) {
        setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const cachedFriends = localStorage.getItem('cachedFriends');
      if (cachedFriends) {
        setFriends(JSON.parse(cachedFriends));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const token = await getValidToken();
        const friendsResponse = await axios.post(
          'http://localhost:3000/friendship/friends',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const friendships = friendsResponse.data;
        const friendIds = friendships.map((friendship) =>
          friendship.requester === userId ? friendship.recipient : friendship.requester
        );
        const uniqueFriendIds = [...new Set(friendIds)];

        const friendDetails = await Promise.all(
          uniqueFriendIds.map(async (friendId) => {
            try {
              const userResponse = await axios.get(
                `http://localhost:3000/users/${friendId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const userData = userResponse.data;
              return {
                id: friendId,
                name: userData.name || 'Unknown',
                avatar: userData.avatar || '/placeholder.svg',
                status: userData.status || null,
              };
            } catch (error) {
              console.error(`Lỗi khi lấy thông tin người dùng ${friendId}:`, error);
              return {
                id: friendId,
                name: 'Unknown',
                avatar: '/placeholder.svg',
                status: null,
              };
            }
          })
        );

        setFriends(friendDetails);
        localStorage.setItem('cachedFriends', JSON.stringify(friendDetails));
      } catch (error) {
        if (error.message.includes('đăng nhập')) {
          setErrorMessage(error.message);
          setTimeout(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('userId');
            navigate('/login');
          }, 2000);
        } else if (error.response?.status === 401) {
          setErrorMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          setTimeout(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('userId');
            navigate('/login');
          }, 2000);
        } else {
          setErrorMessage(error.response?.data?.message || 'Không thể tải danh sách bạn bè. Vui lòng thử lại.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [userId, navigate]);

  const toggleMember = (friendId) => {
    setSelectedMembers((prev) => {
      const newSelectedMembers = prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId];
      console.log('toggleMember - selectedMembers sau khi chọn:', newSelectedMembers);
      return newSelectedMembers;
    });
  };

  const handleAddMembers = () => {
    console.log('handleAddMembers - selectedMembers:', selectedMembers);
    if (selectedMembers.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một thành viên để thêm.');
      return;
    }

    if (!conversationId) {
      setErrorMessage('Không tìm thấy ID cuộc trò chuyện.');
      setIsLoading(false);
      return;
    }

    if (!socketRef.current) {
      setErrorMessage('Không thể kết nối tới server. Vui lòng thử lại.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    socketRef.current.emit('addMembersToGroup', {
      groupId: conversationId,
      members: selectedMembers,
    });

    console.log(`[AddMembers] 🚀 Gửi yêu cầu thêm thành viên vào group ${conversationId}`);
  };

  const filteredFriends = friends
    .filter((friend) => {
      if (filter === 'Tất cả') return true;
      if (filter === 'Khách hàng') return friend.name.includes('Khách hàng');
      if (filter === 'Gia đình') return friend.name.includes('Gia đình');
      if (filter === 'Công việc') return friend.name.includes('Công việc');
      if (filter === 'Bạn bè') return friend.name.includes('Bạn bè');
      if (filter === 'Trả lời sau') return friend.name.includes('Trả lời sau');
      return true;
    })
    .filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[480px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Thêm thành viên</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
            <X size={24} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-md px-3 py-2 pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {['Tất cả', 'Khách hàng', 'Gia đình', 'Công việc', 'Bạn bè', 'Trả lời sau'].map(
            (label) => (
              <button
                key={label}
                onClick={() => setFilter(label)}
                className={`border px-3 py-1 rounded-full text-sm ${
                  filter === label ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className="max-h-64 overflow-y-auto space-y-3">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {isLoading ? (
            <p>Đang tải...</p>
          ) : filteredFriends.length === 0 ? (
            <p>Không tìm thấy bạn bè nào.</p>
          ) : (
            filteredFriends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(friend.id)}
                  onChange={() => toggleMember(friend.id)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <span>{friend.name}</span>
                  {friend.status && (
                    <p className="text-sm text-gray-500">{friend.status}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleAddMembers}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
            disabled={selectedMembers.length === 0 || isLoading}
          >
            {isLoading ? 'Đang thêm...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
}