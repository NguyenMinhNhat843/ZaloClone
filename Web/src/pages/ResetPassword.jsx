import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
export default function ResetPassword() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
    const email = location.state?.email || 'email@example.com';
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    // Gửi mã xác minh và mật khẩu mới đến backend tại đây
    console.log('Mã xác thực:', code);
    console.log('Mật khẩu mới:', newPassword);
    setSuccessMessage('✅ Mật khẩu đã được cập nhật thành công!');
    // Sau khi thành công:
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">Zalo</h1>
          <p className="mt-2 text-gray-700 text-base font-medium">
            Khôi phục mật khẩu Zalo
          </p>
          <p className="text-sm text-gray-500">
            để kết nối với ứng dụng Zalo Web
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="bg-blue-100 rounded-md p-4 text-center">
            <p className="text-sm text-gray-600">Gửi tin nhắn để nhận mã xác thực</p>
            <p className="text-lg font-bold text-blue-700">{email}</p>
            <input
              type="text"
              placeholder="Nhập mã kích hoạt"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Vui lòng kiểm tra email của bạn để lấy mã xác thực.
            </p>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {successMessage && (
            <div className="text-green-600 text-sm font-medium text-center mt-2">
                {successMessage}
            </div>
            )}


          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Xác nhận
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="#" className="text-blue-600 hover:underline mr-2">Tiếng Việt</a>
          <a href="#" className="hover:underline">English</a>
        </div>
      </div>
    </div>
  );
}
