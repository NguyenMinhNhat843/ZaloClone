import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:3000/auth/send', { email });

    if (res.data.status) {
      // Nếu gửi thành công thì chuyển sang trang nhập mã OTP
      navigate('/reset-password', { state: { email } });
    } else {
      alert(res.data.message);
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi gửi OTP');
  }
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Nhập email của bạn
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Tiếp tục
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:underline"
          >
            &laquo; Quay lại
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="#" className="text-blue-600 hover:underline mr-2">Tiếng Việt</a>
          <a href="#" className="hover:underline">English</a>
        </div>
      </div>
    </div>
  );
}
