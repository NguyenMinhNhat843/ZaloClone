import React, { useState } from "react";
import {
  MessageCircle,
  Cloud,
  Square,
  Briefcase,
  Settings,
  CloudCog,
  NotebookTabs,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function LeftSidebar({
  onShowSetting,
  onShowProfile,
  setActiveItem,
  activeItem,
  mumOfConversations
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const {user} = useUser();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const toggleAvatarMenu = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };

  const closeAvatarMenu = () => {
    setShowAvatarMenu(false);
  };

  return (
    <aside className="flex h-screen w-16 flex-col items-center bg-[#005AE0] py-4">
      <div className="relative mb-6">
        <div
          className="h-10 w-10 cursor-pointer overflow-hidden rounded-full"
          onClick={toggleAvatarMenu}
        >
          <img
            src="/upload/avatar.png?height=40&width=40"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Menu Avatar */}
        {showAvatarMenu && (
          <div
            className="absolute left-0 top-12 z-50 w-56 rounded-lg border bg-white text-black shadow-lg"
            onClick={closeAvatarMenu}
          >
            <div className="px-4 py-2 font-bold">{user.name}</div>
            <hr className="border-gray-300" />
            <ul className="m-0 list-none p-2">
              <li className="flex cursor-pointer items-center justify-between px-5 py-2 hover:bg-gray-200">
                Nâng cấp tài khoản <span>🔗</span>
              </li>
              <li
                className="cursor-pointer px-5 py-2 hover:bg-gray-200"
                onClick={onShowProfile}
              >
                Hồ sơ của bạn
              </li>
              <li
                className="cursor-pointer px-5 py-2 hover:bg-gray-200"
                onClick={onShowSetting}
              >
                Cài đặt
              </li>
              <li
                className="cursor-pointer px-5 py-2 text-red-500 hover:bg-gray-200"
                onClick={handleLogout}
              >
                Đăng xuất
              </li>
            </ul>
          </div>
        )}
      </div>

      <nav className="w-full flex-1">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <button
              onClick={() => setActiveItem("messages")}
              className={`relative rounded-lg p-3 transition-colors ${activeItem === "messages" ? "bg-gray-100" : "hover:bg-white/10"}`}
            >
              <MessageCircle
                className={`h-6 w-6 ${activeItem === "messages" ? "text-blue-500" : "text-white"}`}
              />
              <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                {mumOfConversations}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveItem("contacts")}
              className={`rounded-lg p-3 transition-colors ${activeItem === "contacts" ? "bg-gray-100" : "hover:bg-white/10"}`}
            >
              <NotebookTabs
                className={`h-6 w-6 ${activeItem === "contacts" ? "text-blue-500" : "text-white"}`}
              />
            </button>
          </li>
        </ul>
      </nav>

      <div className="w-full">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <button
              onClick={() => setActiveItem("cloud-cog")}
              className={`rounded-lg p-3 transition-colors ${activeItem === "cloud-cog" ? "bg-gray-100" : "hover:bg-white/10"}`}
            >
              <CloudCog
                className={`h-6 w-6 ${activeItem === "cloud-cog" ? "text-blue-500" : "text-white"}`}
              />
            </button>
          </li>
          <li onClick={toggleMenu}>
            <button
              onClick={() => setIsActive(!isActive)}
              className="rounded-lg p-3 transition-colors hover:bg-white/10"
            >
              <Settings
                className={`h-6 w-6 text-white transition-transform duration-300 ${
                  isActive ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* Menu */}
            {showMenu && (
              <div
                className="absolute bottom-16 left-2 z-50 w-52 rounded-lg bg-gray-800 text-white shadow-lg"
                onClick={closeMenu}
              >
                <ul className="m-0 list-none p-2">
                  <li
                    className="cursor-pointer px-5 py-2 hover:bg-gray-700"
                    onClick={onShowProfile}
                  >
                    Thông tin tài khoản
                  </li>
                  <li
                    className="cursor-pointer px-5 py-2 hover:bg-gray-700"
                    onClick={onShowSetting}
                  >
                    Cài đặt
                  </li>
                  <li
                    className="cursor-pointer px-5 py-2 text-red-500 hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                  <li className="cursor-pointer px-5 py-2 hover:bg-gray-700">
                    Thoát
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
}
