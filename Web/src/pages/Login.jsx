import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import io from "socket.io-client";

export default function Login({ onLogin, }) {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setUserDetails } = useUser(); 


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!phone || !password) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        phone,
        password,
      });
      // Lưu token
      console.log("Token: ",response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      const expiresInMinutes = 30;
      const expirationTime =
        new Date().getTime() + expiresInMinutes * 60 * 1000;
      localStorage.setItem("tokenExpiry", expirationTime);

      const accessToken = localStorage.getItem('accessToken');

      const socket = io('http://localhost:3000',{
        auth:{
          token: accessToken,
        }
      });

      console.log("[Login] Socket: ",socket);

      socket.on('connect', ()=>{
        console.log('[Login] Socket connected Id: ',socket.id);
      });

      socket.on('disconnect', ()=>{
        console.log('[Login] Socket disconnected.');
      })

      socket.on('connect_error', (err)=>{
        console.log('[Login] Socket connection error: ',err.message);
      })

      const userResponse = await axios.get('http://localhost:3000/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUserDetails(userResponse.data);
      localStorage.setItem('userPhone', userResponse.data.phone);
      console.log('User details:', userResponse.data);
      onLogin();
      navigate('/home');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };
  

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">Z</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
              <Link to="/forgotpassword" className="font-medium text-blue-600 hover:text-blue-500">
                Quên mật khẩu?
              </Link>
              </div>
            </div>

            <div className="flex gap-10">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleSubmit}
              >
                 Đăng nhập
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => navigate('/Register')}
              >
                Đăng ký
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="mt-6 grid">
              <Link to="/login-email">
                <a
                  href="#"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Email</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 12l8-5.99V6l-8 5-8-5z" />
                  </svg>
                  <span>Email</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
