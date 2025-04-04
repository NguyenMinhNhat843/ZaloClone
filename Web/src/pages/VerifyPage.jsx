import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function VerifyPage({ onVerify }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Xác thực số điện thoại</h1>
          <p className="text-gray-400 mb-6">
            Vui lòng nhập mã xác thực 6 số đã được gửi đến số điện thoại của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {[...Array(6)].map((_, i) => (
              <Input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center bg-[#2a2a2a] border-gray-700 text-white text-xl"
                required
              />
            ))}
          </div>

          <Button type="submit" className="w-full h-12 text-base bg-blue-500 hover:bg-blue-600">
            Xác nhận
          </Button>

          <div className="text-center">
            <button type="button" className="text-blue-500 hover:underline text-sm">
              Gửi lại mã xác thực
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

