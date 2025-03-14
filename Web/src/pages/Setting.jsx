import { X } from "lucide-react";
import React, { useState } from "react";

export default function Setting({ onClose }) {
  const [activeSection, setActiveSection] = useState("general");

  const sections = {
    general: (
      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-2">Danh bạ</h3>
        <p className="text-gray-600 text-sm mb-2">Danh sách bạn bè được hiển thị trong danh bạ</p>
        <div className="bg-white p-3 rounded-lg shadow mb-4">
          <label className="flex justify-between items-center mb-2 cursor-pointer">
            Hiển thị tất cả bạn bè
            <input type="radio" name="contacts" className="ml-2" />
          </label>
          <label className="flex justify-between items-center cursor-pointer">
            Chỉ hiển thị bạn bè đang sử dụng Zalo
            <input type="radio" name="contacts" className="ml-2" defaultChecked />
          </label>
        </div>


        <h3 className="text-gray-900 font-bold text-lg mb-2">Ngôn ngữ</h3>
        <div className="bg-white p-3 rounded-lg shadow flex items-center justify-between w-full">
          <p className="mb-0 text-gray-700">Thay đổi ngôn ngữ</p>
          <select className="border p-2 rounded w-1/3 text-gray-700">
            <option>Tiếng Việt</option>
            <option>English</option>
          </select>
        </div>
      </div>
    ),
    privacy: <div><h3 className="text-gray-900 font-bold text-lg mb-2">Quyền riêng tư</h3><p className="text-gray-600 text-sm">Thiết lập quyền riêng tư tại đây.</p></div>,
    interface: <div><h3 className="text-gray-900 font-bold text-lg mb-2">Giao diện</h3><p className="text-gray-600 text-sm">Tùy chỉnh giao diện người dùng.</p></div>,
    notifications: <div><h3 className="text-gray-900 font-bold text-lg mb-2">Thông báo</h3><p className="text-gray-600 text-sm">Quản lý cài đặt thông báo.</p></div>,
    messages: <div><h3 className="text-gray-900 font-bold text-lg mb-2">Tin nhắn</h3><p className="text-gray-600 text-sm">Thiết lập tin nhắn.</p></div>,
    utilities: <div><h3 className="text-gray-900 font-bold text-lg mb-2">Tiện ích</h3><p className="text-gray-600 text-sm">Các cài đặt tiện ích.</p></div>
  };

  return (
    <div className="flex flex-col fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
      <div className="bg-gray-100 w-full max-w-4xl h-5/6 flex flex-col rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Cài đặt</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="bg-gray-200 w-1/4 overflow-y-auto">
            <ul className="list-none m-0">
              <li onClick={() => setActiveSection("general")} className={`text-gray-900 px-5 py-3 cursor-pointer hover:bg-gray-300 ${activeSection === "general" && "bg-gray-300"}`}>Cài đặt chung</li>
              <li onClick={() => setActiveSection("privacy")} className={`text-gray-900 px-5 py-3 cursor-pointer hover:bg-gray-300 ${activeSection === "privacy" && "bg-gray-300"}`}>Quyền riêng tư</li>
              <li onClick={() => setActiveSection("interface")} className={`text-gray-900 px-5 py-3 cursor-pointer hover:bg-gray-300 ${activeSection === "interface" && "bg-gray-300"}`}>Giao diện</li>
              <li onClick={() => setActiveSection("notifications")} className={`text-gray-900 px-5 py-3 cursor-pointer hover:bg-gray-300 ${activeSection === "notifications" && "bg-gray-300"}`}>Thông báo</li>
              <li onClick={() => setActiveSection("messages")} className={`text-gray-900 px-5 py-3 cursor-pointer hover:bg-gray-300 ${activeSection === "messages" && "bg-gray-300"}`}>Tin nhắn</li>
              <li onClick={() => setActiveSection("utilities")} className={`text-gray-900 px-5 py-3 cursor-pointer hover:bg-gray-300 ${activeSection === "utilities" && "bg-gray-300"}`}>Tiện ích</li>
            </ul>
          </div>

          {/* Content */}
          <div className="p-6 w-3/4 overflow-y-auto bg-gray-50">{sections[activeSection]}</div>
        </div>
      </div>
    </div>
  );
}
