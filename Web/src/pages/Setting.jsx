import { X } from "lucide-react";
import React, { useState } from "react";

export default function Settings({ onClose }) {
  const [activeSection, setActiveSection] = useState("general");

  const sections = {
    general: (
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="theme">
          Theme
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="theme"
        >
          <option>Light</option>
          <option>Dark</option>
        </select>
        <label
          className="block text-white text-sm font-bold mb-2 mt-4"
          htmlFor="notifications"
        >
          Notifications
        </label>
        <input type="checkbox" id="notifications" className="mr-2" />
        <span className="text-white">Enable notifications</span>
      </div>
    ),
    interface: (
      <div>
        <p className="text-white text-sm">Customize the interface settings here.</p>
      </div>
    ),
    accountAndSecurity: (
      <div className="bg-gray-900 p-6 rounded-md">
        <p className="text-white text-sm mb-4">
          Lưu ý: Mật khẩu bao gồm chữ kèm theo số hoặc ký tự đặc biệt, tối thiểu 8 ký tự trở lên & tối đa 32 ký tự.
        </p>
    
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="currentPassword">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            id="currentPassword"
            placeholder="Nhập mật khẩu hiện tại"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
    
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            placeholder="Nhập mật khẩu mới"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
    
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmNewPassword">
            Nhập lại mật khẩu mới
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            placeholder="Nhập lại mật khẩu mới"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
    
        <div className="flex justify-end space-x-2 mt-6">
          <button className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500">
            Hủy
          </button>
          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500">
            Cập nhật
          </button>
        </div>
      </div>
    )
  };

  return (
    <div className="flex flex-col fixed p-1 inset-0 bg-black bg-opacity-50 items-center justify-center z-50 ">
      <div className="bg-gray-800 w-full max-w-4xl h-full flex flex-col rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="bg-gray-900 w-1/4 overflow-y-auto">
            <ul className="list-none m-0">
              <li
                onClick={() => setActiveSection("general")}
                className={`text-white px-5 py-3 cursor-pointer hover:bg-gray-700 ${
                  activeSection === "general" && "bg-gray-700"
                }`}
              >
                General Settings
              </li>
              <li
                onClick={() => setActiveSection("interface")}
                className={`text-white px-5 py-3 cursor-pointer hover:bg-gray-700 ${
                  activeSection === "interface" && "bg-gray-700"
                }`}
              >
                Interface
              </li>
              <li
                onClick={() => setActiveSection("accountAndSecurity")}
                className={`text-white px-5 py-3 cursor-pointer hover:bg-gray-700 ${
                  activeSection === "accountAndSecurity" && "bg-gray-700"
                }`}
              >
                Account and Security
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="p-6 w-3/4 overflow-y-auto">{sections[activeSection]}</div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={onClose}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
