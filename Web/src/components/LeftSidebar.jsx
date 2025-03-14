import React, { useState } from 'react';
import { MessageCircle, Cloud, Square, Briefcase, Settings, CloudCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LeftSidebar({onShowSetting,onShowProfile}) {
  const [activeItem, setActiveItem] = useState('messages');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleLogout = ()=>{
    navigate('/login');
  }

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const toggleAvatarMenu = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };
  
  const closeAvatarMenu = () => {
    setShowAvatarMenu(false);
  };
  
  return (
    <aside className="w-16 bg-[#1a1a1a] h-screen flex flex-col items-center py-4">
      <div className="relative mb-6">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer" 
          onClick={toggleAvatarMenu}
        >
          <img 
            src="/placeholder.svg?height=40&width=40" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Menu Avatar */}
        {showAvatarMenu && (
          <div 
            className="absolute top-12 left-0 bg-white text-black rounded-lg shadow-lg w-56 z-50 border"
            onClick={closeAvatarMenu}
          >
            <div className="px-4 py-2 font-bold">Nhân</div>
            <hr className="border-gray-300"/>
            <ul className="list-none m-0 p-2">
              <li 
                className="px-5 py-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              >
                Nâng cấp tài khoản <span>🔗</span>
              </li>
              <li 
                className="px-5 py-2 cursor-pointer hover:bg-gray-200"
                onClick={onShowProfile}
              >
                Hồ sơ của bạn
              </li>
              <li 
                className="px-5 py-2 cursor-pointer hover:bg-gray-200"
                onClick={onShowSetting}
              >
                Cài đặt
              </li>
              <li 
                className="px-5 py-2 cursor-pointer text-red-500 hover:bg-gray-200"
                onClick={handleLogout}
              >
                Đăng xuất
              </li>
            </ul>
          </div>
        )}
      </div>

      <nav className="flex-1 w-full">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <button 
              onClick={() => setActiveItem('messages')}
              className="relative p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <MessageCircle className={`w-6 h-6 ${activeItem === 'messages' ? 'text-blue-500' : 'text-white'}`} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                5+
              </span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveItem('cloud')}
              className="p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Cloud className={`w-6 h-6 ${activeItem === 'cloud' ? 'text-blue-500' : 'text-white'}`} />
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveItem('workspace')}
              className="p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Square className={`w-6 h-6 ${activeItem === 'workspace' ? 'text-blue-500' : 'text-white'}`} />
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveItem('work')}
              className="p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Briefcase className={`w-6 h-6 ${activeItem === 'work' ? 'text-blue-500' : 'text-white'}`} />
            </button>
          </li>
        </ul>
      </nav>

      <div className="w-full">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <button className="p-3 rounded-lg hover:bg-white/10 transition-colors">
              <CloudCog className="w-6 h-6 text-white" />
            </button>
          </li>
          <li onClick={toggleMenu}>
            <button className="p-3 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-6 h-6 text-white" />
            </button>
            {/* Menu */}
            {showMenu && (
              <div
              className="absolute bottom-16 left-2 bg-gray-800 text-white rounded-lg shadow-lg w-52 z-50"
              onClick={closeMenu}
            >
              <ul className="list-none m-0 p-2">
                <li 
                  className="px-5 py-2 cursor-pointer hover:bg-gray-700"
                  onClick={onShowProfile}
                >Thông tin tài khoản</li>
                <li
                  className="px-5 py-2 cursor-pointer hover:bg-gray-700"
                  onClick={onShowSetting}
                >Cài đặt
                </li>
                <li
                  className="px-5 py-2 cursor-pointer text-red-500 hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </li>
                <li className="px-5 py-2 cursor-pointer hover:bg-gray-700">Thoát</li>
              </ul>
            </div>
            
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
}