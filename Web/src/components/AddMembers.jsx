import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AddMembers({ onClose, conversationId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const [friends, setFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const userId = user?._id;
  let accessToken = localStorage.getItem('accessToken');

  // Log conversationId ngay khi nhận props
  console.log('AddMembers - conversationId nhận được:', conversationId);

  // Hàm làm mới token
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

  // Hàm kiểm tra và làm mới token nếu cần
  const getValidToken = async () => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const currentTime = new Date().getTime();

    if (!accessToken) {
      throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
    }

    if (tokenExpiry && currentTime > tokenExpiry) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        throw error;
      }
    }

    return accessToken;
  };

  // Lấy danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      console.log('fetchFriends - userId:', userId);
      if (!userId) {
        setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const token = await getValidToken();

        // Gọi API để lấy danh sách bạn bè
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

        // Trích xuất danh sách friendId (những người không phải user._id)
        const friendIds = friendships.map((friendship) =>
          friendship.requester === userId ? friendship.recipient : friendship.requester
        );
        console.log('fetchFriends - friendIds:', friendIds);

        // Lấy thông tin chi tiết của từng bạn bè (tên, avatar)
        const friendDetails = await Promise.all(
          friendIds.map(async (friendId) => {
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

        console.log('fetchFriends - friendDetails:', friendDetails);
        setFriends(friendDetails);
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

  // Xử lý chọn thành viên
  const toggleMember = (friendId) => {
    setSelectedMembers((prev) => {
      const newSelectedMembers = prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId];
      console.log('toggleMember - selectedMembers sau khi chọn:', newSelectedMembers);
      return newSelectedMembers;
    });
  };

  // Xử lý thêm thành viên vào nhóm
  const handleAddMembers = async () => {
    console.log('handleAddMembers - selectedMembers:', selectedMembers);
    if (selectedMembers.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một thành viên để thêm.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = await getValidToken();
      console.log('handleAddMembers - Gửi request với conversationId:', conversationId, 'members:', selectedMembers);

      // Gọi API để thêm thành viên vào nhóm
      // Gửi selectedMembers dưới dạng mảng, không cần vòng lặp
      console.log('handleAddMembers - Gửi request với conversationId:', conversationId, 'members:', selectedMembers);
      await axios.post(
        `http://localhost:3000/chat/conversations/${conversationId}/members`,
        {
          members: selectedMembers, // Gửi dưới dạng mảng: ["680529794252be07ab1d04b3a026"]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('handleAddMembers - Thêm thành viên thành công:', selectedMembers);
      onClose();
    } catch (error) {
      console.log('handleAddMembers - Lỗi:', error.response?.data || error.message);
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
        setErrorMessage(
          error.response?.data?.message || 'Không thể thêm thành viên. Vui lòng thử lại.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Lọc danh sách bạn bè
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Thêm thành viên</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
            <X size={24} />
          </button>
        </div>

        {/* Search box */}
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

        {/* Bộ lọc */}
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

        {/* Danh sách bạn bè */}
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

        {/* Nút xác nhận */}
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