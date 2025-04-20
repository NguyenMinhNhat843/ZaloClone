import React, { useState, useEffect } from 'react';
import { X, Camera, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function CreateGroup({ onClose }) {
  const [activeItem, setActiveItem] = useState('all');
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useUser(); // Lấy userId từ context

  const navigate = useNavigate();

  // URL mặc định cho ảnh đại diện nhóm
  const DEFAULT_GROUP_AVATAR =
    'https://www.shutterstock.com/image-vector/avatar-group-people-chat-icon-260nw-2163070859.jpg';

  // Lấy userId từ context
  const userId = user?._id;
  let accessToken = localStorage.getItem('accessToken');

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

  // Lấy danh sách người nhắn tin gần đây
  useEffect(() => {
    const fetchRecentContacts = async () => {
      if (!userId) {
        setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const token = await getValidToken();

        const response = await axios.get(
          `http://localhost:3000/chat/conversations/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const recentContacts = response.data
          .filter((conv) => conv.type === 'private')
          .map((conv) => ({
            id: conv.participants.find((id) => id !== userId),
            name: conv.nameConversation,
            avatar: conv.groupAvatar || '/placeholder.svg',
          }));

        setContacts(recentContacts);
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
          setErrorMessage(error.response?.data?.message || 'Không thể tải danh sách liên hệ. Vui lòng thử lại.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentContacts();
  }, [userId, navigate]);

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setGroupAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setErrorMessage('Vui lòng chọn một file ảnh hợp lệ (JPG, PNG, v.v.).');
      setGroupAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length === 0) {
      setErrorMessage('Vui lòng nhập tên nhóm và chọn ít nhất một thành viên.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = await getValidToken();

      // Tạo FormData
      const formData = new FormData();
      formData.append('groupName', groupName);

      // Thêm từng userId trong selectedMembers dưới dạng field "members" riêng biệt
      selectedMembers.forEach((memberId) => {
        // formData.append('members', userId); // Sử dụng userId từ context
        formData.append('members', memberId);
      });

      // Chỉ thêm groupAvatar nếu nó tồn tại và là file hợp lệ
      let hasAvatar = false;
      if (groupAvatar && groupAvatar instanceof File) {
        formData.append('groupAvatar', groupAvatar);
        hasAvatar = true;
      }

      // Thử tạo nhóm
      let response;
      try {
        response = await axios.post(
          'http://localhost:3000/chat/conversations/group',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        // Nếu lỗi liên quan đến groupAvatar và đã gửi groupAvatar, thử lại mà không gửi groupAvatar
        if (
          hasAvatar &&
          (error.response?.data?.message?.includes('Cannot read properties of undefined') ||
            error.response?.data?.message?.includes('No file uploaded'))
        ) {
          setErrorMessage('Không thể upload ảnh đại diện. Đang thử tạo nhóm với ảnh mặc định...');

          // Tạo FormData mới mà không có groupAvatar
          const fallbackFormData = new FormData();
          fallbackFormData.append('groupName', groupName);
          selectedMembers.forEach((memberId) => {
            fallbackFormData.append('members', memberId);
          });

          response = await axios.post(
            'http://localhost:3000/chat/conversations/group',
            fallbackFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          throw error; // Ném lỗi để xử lý ở catch bên dưới
        }
      }

      console.log('Tạo nhóm thành công:', response.data);

      // Chuyển hướng đến giao diện chat của nhóm
      const conversationId = response.data.data._id;
      navigate(`/chat/${conversationId}`);
      onClose();
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
        setErrorMessage(
          error.response?.data?.message || 'Không thể tạo nhóm. Vui lòng thử lại.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts
    .filter((contact) => {
      if (activeItem === 'all') return true;
      if (activeItem === 'person1') return contact.name.includes('Nhân2');
      if (activeItem === 'person2') return contact.name.includes('NguyenTrongBao');
      return true;
    })
    .filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-blue-50 w-full max-w-md rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-700">Tạo nhóm</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <label className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Group Avatar Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <img
                  src={DEFAULT_GROUP_AVATAR}
                  alt="Default Group Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
            </label>
            <input
              type="text"
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 bg-[#2a2a2a] text-gray-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm liên hệ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2a2a2a] text-gray-700 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveItem('all')}
              className={`px-3 py-2 ${activeItem === 'all' ? 'bg-blue-500' : 'bg-[#2a2a2a]'} text-white rounded-2xl text-sm`}
            >
              All
            </button>
            <button
              onClick={() => setActiveItem('person1')}
              className={`px-3 py-2 ${activeItem === 'person1' ? 'bg-blue-500' : 'bg-[#2a2a2a]'} text-white rounded-2xl text-sm`}
            >
              Nhân2
            </button>
            <button
              onClick={() => setActiveItem('person2')}
              className={`px-3 py-2 ${activeItem === 'person2' ? 'bg-blue-500' : 'bg-[#2a2a2a]'} text-white rounded-2xl text-sm`}
            >
              NguyenTrongBao
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <h3 className="text-sm text-gray-400 mb-2">Trò chuyện gần đây</h3>
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            {isLoading ? (
              <p className="text-white">Đang tải...</p>
            ) : filteredContacts.length === 0 && !errorMessage ? (
              <p className="text-white">Không tìm thấy liên hệ nào.</p>
            ) : (
              filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 py-2">
                  <input
                    type="checkbox"
                    id={`contact-${contact.id}`}
                    checked={selectedMembers.includes(contact.id)}
                    onChange={() => toggleMember(contact.id)}
                    className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <label
                    htmlFor={`contact-${contact.id}`}
                    className="text-white cursor-pointer"
                  >
                    {contact.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!groupName || selectedMembers.length === 0 || isLoading}
          >
            {isLoading ? 'Đang tạo...' : 'Tạo nhóm'}
          </button>
        </div>
      </div>
    </div>
  );
}