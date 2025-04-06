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
  return (
    <aside className="w-16 bg-[#005AE0] h-screen flex flex-col items-center py-4">
      <div className="relative mb-6">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            src="/placeholder.svg?height=40&width=40" 
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
              className={`relative p-3 rounded-lg transition-colors ${activeItem === 'messages' ? 'bg-[#004DBF]' : 'hover:bg-white/10'}`}
              >
                <MessageCircle className={`w-6 h-6 ${activeItem === 'messages' ? 'text-white' : 'text-white/70'}`} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                5+
              </span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveItem('cloud')}
              className={`p-3 rounded-lg transition-colors ${activeItem === 'cloud' ? 'bg-[#004DBF]' : 'hover:bg-white/10'}`}
              >
             <Cloud className={`w-6 h-6 ${activeItem === 'cloud' ? 'text-white' : 'text-white/70'}`} />
        </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveItem('workspace')}
              className={`p-3 rounded-lg transition-colors ${activeItem === 'workspace' ? 'bg-[#004DBF]' : 'hover:bg-white/10'}`}
              >
              <Square className={`w-6 h-6 ${activeItem === 'workspace' ? 'text-white' : 'text-white/70'}`} />
        </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveItem('work')}
              className={`p-3 rounded-lg transition-colors ${activeItem === 'work' ? 'bg-[#004DBF]' : 'hover:bg-white/10'}`}
              >
              <Briefcase className={`w-6 h-6 ${activeItem === 'work' ? 'text-white' : 'text-white/70'}`} />
        </button>
          </li>
        </ul>
      </nav>

      <div className="w-full">
        <ul className="flex flex-col items-center gap-4">
        <li>
          <button 
            onClick={() => setActiveItem('cloud-cog')}
            className={`p-3 rounded-lg transition-colors ${activeItem === 'cloud-cog' ? 'bg-[#004DBF]' : 'hover:bg-white/10'}`}
          >
            <CloudCog className={`w-6 h-6 ${activeItem === 'cloud-cog' ? 'text-blue-500' : 'text-white'}`} />
          </button>
        </li>
          <li onClick={toggleMenu}>
          <button className={`p-3 rounded-lg transition-colors ${showMenu ? 'bg-[#004DBF]' : 'hover:bg-white/10'}`}>
              <Settings className={`w-6 h-6 ${showMenu ? 'text-blue-500' : 'text-white'}`} />
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