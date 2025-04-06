import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useUser } from '../contexts/UserContext'; // Import hook để sử dụng context

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUserDetails } = useUser();  // Lấy hàm setUserDetails từ context

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    gender: 'male',
    dateOfBirth: '2000-01-01',
    avatar: '',
    gmail: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Form data:', formData);  // Log dữ liệu gửi đi
  
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();  // Xử lý lỗi nếu có
        console.error('Error:', errorData);
        throw new Error('Đăng ký thất bại');
      }
  
      const data = await response.json();
      console.log('Đăng ký thành công:', data);

      // Sau khi đăng ký thành công, lưu thông tin người dùng vào context
      setUserDetails(data);
      console.log('Thông tin người dùng register:', data);

      navigate('/verify');
    } catch (error) {
      console.error('Lỗi:', error.message);
    }
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
          <p className="text-gray-400">
            Đã có tài khoản?
            <Link to="/login" className="text-blue-500 hover:underline ml-1">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Tên hiển thị</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-[#2a2a2a] border-gray-700 text-white h-12"
              placeholder="Nhập tên hiển thị"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="bg-[#2a2a2a] border-gray-700 text-white h-12"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gmail" className="text-gray-300">Email</Label>
            <Input
              id="gmail"
              type="email"
              required
              value={formData.gmail}
              onChange={handleChange}
              className="bg-[#2a2a2a] border-gray-700 text-white h-12"
              placeholder="Nhập email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
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

          {/* Optional Gender and Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-300">Giới tính</Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="bg-[#2a2a2a] border-gray-700 text-white h-12 w-full px-3 rounded"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-300">Ngày sinh</Label>
            <Input
              id="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="bg-[#2a2a2a] border-gray-700 text-white h-12"
            />
          </div>

          {/* Avatar có thể để trống */}
          <Input
            type="hidden"
            id="avatar"
            value=""
            readOnly
          />

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nhập lại mật khẩu
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-900">
                Tôi đồng ý với các{' '}
                <button className="text-blue-500 hover:underline">Điều khoản sử dụng</button> và{' '}
                <button className="text-blue-500 hover:underline">Chính sách bảo mật</button>
              </label>
            </div>

            <div className="flex flex-col gap-5">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Đăng ký
              </button>
              <Link
                to="/login"
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
