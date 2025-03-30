import React, { useState } from 'react';
import { MessageCircle, Cloud, Square, Briefcase, Settings, CloudCog, NotebookTabs } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LeftSidebar({onShowSetting,onShowProfile,setActiveItem,activeItem}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isActive, setIsActive] = useState(false);
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
  return (
    <aside className="w-16 bg-[#1a1a1a] h-screen flex flex-col items-center py-4">
      <div className="relative mb-6">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            src="/upload/avatar.png?height=40&width=40" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <nav className="flex-1 w-full">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <button 
              onClick={() => setActiveItem('messages')}
              className={`relative p-3 rounded-lg hover:bg-white/10 transition-colors ${activeItem === 'messages' ? 'bg-gray-800 ' : ''}`}
            >
              <MessageCircle className={`w-6 h-6 ${activeItem === 'messages' ? 'text-blue-500 ' : 'text-white'}`} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                5+
              </span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveItem('contacts')}
              className={`p-3 rounded-lg hover:bg-white/10 transition-colors ${activeItem === 'contacts' ? 'bg-gray-800 ' : ''}`}
            >
              <NotebookTabs className={`w-6 h-6 ${activeItem === 'contacts' ? 'text-blue-500' : 'text-white'}`} />
            </button>
          </li>
        </ul>
      </nav>

      <div className="w-full">
        <ul className="flex flex-col items-center gap-4">
          <li onClick={toggleMenu}>
            <button onClick={() => setIsActive(!isActive)} className="p-3 rounded-lg hover:bg-white/10 transition-colors">
            <Settings
        className={`w-6 h-6 text-white transition-transform duration-300 ${
          isActive ? "rotate-180" : ""
        }`}
      />
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