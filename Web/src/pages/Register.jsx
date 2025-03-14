import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/verify');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Đăng ký tài khoản Zalo</h1>
          <p className="text-gray-400">Đã có tài khoản? 
            <Link to="/login" className="text-blue-500 hover:underline ml-1">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Tên hiển thị
            </Label>
            <Input
              id="name"
              type="text"
              required
              className="bg-[#2a2a2a] border-gray-700 text-white h-12"
              placeholder="Nhập tên hiển thị"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              className="bg-[#2a2a2a] border-gray-700 text-white h-12"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Mật khẩu
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="bg-[#2a2a2a] border-gray-700 text-white h-12 pr-12"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              className="border-gray-600 data-[state=checked]:bg-blue-500 mt-1" 
              required
            />
            <Label htmlFor="terms" className="text-gray-300 text-sm">
              Tôi đồng ý với các <button className="text-blue-500 hover:underline">Điều khoản sử dụng</button> và <button className="text-blue-500 hover:underline">Chính sách bảo mật</button> của Zalo
            </Label>
          </div>

          <Button type="submit" className="w-full h-12 text-base bg-blue-500 hover:bg-blue-600">
            Đăng ký
          </Button>
        </form>
      </div>
    </div>
  );
}

