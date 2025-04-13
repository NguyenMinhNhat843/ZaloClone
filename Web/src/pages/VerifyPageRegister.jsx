import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // chỉ cho nhập số

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus(); // chuyển sang ô tiếp theo
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // quay lại ô trước nếu xóa
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
  
    try {
      const response = await fetch('http://localhost:3000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
  
      const result = await response.json(); // <-- luôn đọc JSON
  
      if (!response.ok || result.status === false) {
        throw new Error(result.message || 'Xác thực thất bại');
      }
  
      alert(result.message || 'Xác thực thành công!');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };
  

  const handleResend = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Gửi lại mã OTP thất bại');
      alert('Đã gửi lại mã xác thực!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Xác thực email</h1>
          <p className="text-gray-400 mb-6">
            Nhập mã OTP đã gửi đến email: <span className="text-blue-400">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {otpDigits.map((digit, i) => (
              <Input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
                className="w-12 h-12 text-center bg-[#2a2a2a] border-gray-700 text-white text-xl"
                required
              />
            ))}
          </div>

          <Button type="submit" className="w-full h-12 text-base bg-blue-500 hover:bg-blue-600">
            Xác nhận
          </Button>

          <div className="text-center">
            <button type="button" onClick={handleResend} className="text-blue-500 hover:underline text-sm">
              Gửi lại mã xác thực
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
