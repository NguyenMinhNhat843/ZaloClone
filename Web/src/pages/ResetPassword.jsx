import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('verify'); // 'verify' or 'reset'
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/]).{8,}$/;
    return passwordRegex.test(password);
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/verify', {
        email,
        otp,
      });

      if (res.data.status) {
        setStep('reset'); // Bước tiếp theo: đặt lại mật khẩu
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi xác thực OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!isValidPassword(newPassword)) {
        setPasswordError('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
        return;
      }

    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    

    try {
      await axios.patch('http://localhost:3000/users/reset-password', {
        email,
        newPassword,
      });

      setSuccessMessage('✅ Mật khẩu đã được cập nhật thành công!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
        setPasswordError(error.response?.data?.message || 'Lỗi cập nhật mật khẩu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600">Zalo</h1>
          <p className="text-gray-600 text-sm mt-2">
            {step === 'verify'
              ? 'Nhập mã OTP gửi đến email'
              : 'Đặt lại mật khẩu mới'}
          </p>
          <p className="text-blue-500 text-sm font-semibold mt-1">{email}</p>
        </div>

        {step === 'verify' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Xác minh OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
            {successMessage && (
              <div className="text-green-600 text-sm text-center font-medium">
                {successMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="#" className="text-blue-600 hover:underline mr-2">
            Tiếng Việt
          </a>
          <a href="#" className="hover:underline">English</a>
        </div>
      </div>
    </div>
  );
}
