import { X } from "lucide-react";
import React, { useState } from "react";
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

export default function Settings({ onClose }) {
  const [activeSection, setActiveSection] = useState("general");
  const { user } = useUser();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setMessage('❌ Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setMessage('❌ Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('❌ Mật khẩu mới không khớp');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');

      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/users/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage('✅ ' + res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Lỗi không xác định!'));
    }
  };

  const sections = {
    general: (
      <div>
        <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="theme">
          Theme
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
          id="theme"
        >
          <option>Light</option>
          <option>Dark</option>
        </select>
        <label className="block text-gray-800 text-sm font-bold mb-2 mt-4" htmlFor="notifications">
          Notifications
        </label>
        <input type="checkbox" id="notifications" className="mr-2" />
        <span className="text-gray-800">Enable notifications</span>
      </div>
    ),
    interface: (
      <div>
        <p className="text-gray-800 text-sm">Customize the interface settings here.</p>
      </div>
    ),
    accountAndSecurity: (
      <div className="bg-white rounded-md">
        <p className="text-gray-800 text-sm mb-4">
          Lưu ý: Mật khẩu bao gồm chữ kèm theo số hoặc ký tự đặc biệt, tối thiểu 8 ký tự trở lên & tối đa 32 ký tự.
        </p>

        {[
          {
            id: "currentPassword",
            label: "Mật khẩu hiện tại",
            value: oldPassword,
            setValue: setOldPassword,
            show: showOld,
            toggleShow: () => setShowOld(!showOld)
          },
          {
            id: "newPassword",
            label: "Mật khẩu mới",
            value: newPassword,
            setValue: setNewPassword,
            show: showNew,
            toggleShow: () => setShowNew(!showNew)
          },
          {
            id: "confirmNewPassword",
            label: "Nhập lại mật khẩu mới",
            value: confirmNewPassword,
            setValue: setConfirmNewPassword,
            show: showConfirm,
            toggleShow: () => setShowConfirm(!showConfirm)
          }
        ].map(({ id, label, value, setValue, show, toggleShow }) => (
          <div className="mb-4 relative" key={id}>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor={id}>
              {label}
            </label>
            <input
              type={show ? 'text' : 'password'}
              id={id}
              placeholder={label}
              className="shadow border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline pr-10"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <span
              onClick={toggleShow}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-black"
            >
              {show ? '🙈' : '👁️'}
            </span>
          </div>
        ))}

        {message && (
          <p className={`text-sm mt-2 ${message.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <button
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
            onClick={() => {
              setOldPassword('');
              setNewPassword('');
              setConfirmNewPassword('');
              setMessage('');
            }}
          >
            Hủy
          </button>
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500"
            onClick={handleChangePassword}
          >
            Cập nhật
          </button>
        </div>
      </div>
    )
  };

  return (
    <div className="flex flex-col fixed p-1 inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-full flex flex-col rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="bg-gray-100 w-1/4 overflow-y-auto border-r border-gray-300">
            <ul className="list-none m-0">
              {["general", "interface", "accountAndSecurity"].map((section) => (
                <li
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-gray-800 px-5 py-3 cursor-pointer hover:bg-gray-200 ${
                    activeSection === section && "bg-gray-200 font-semibold"
                  }`}
                >
                  {section === "general"
                    ? "General Settings"
                    : section === "interface"
                    ? "Interface"
                    : "Account and Security"}
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="p-6 w-3/4 overflow-y-auto">{sections[activeSection]}</div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300">
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
