import { X, Camera } from "lucide-react";
import React from "react";

export default function Profile({ onClose }) {
  return (
    <div className="flex flex-col fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Thông tin tài khoản</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Cover Photo */}
          <div className="relative h-48 bg-gray-600 rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/800x200"
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {/* Profile Picture */}
            <div className="absolute bottom-[-32px] left-4">
              <div className="relative w-20 h-20 rounded-full border-4 border-gray-800 overflow-hidden">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                <button className="absolute bottom-1 right-1 bg-gray-700 p-1 rounded-full">
                  <Camera size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="mt-12 pl-4">
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-white">Trọng Bảo</h3>
              <button className="ml-2 text-gray-400 hover:text-white">
                <Camera size={16} />
              </button>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <span className="w-32 text-gray-400">Bio:</span>
              <span className="text-white">I needn't everything</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-gray-400">Giới tính:</span>
              <span className="text-white">Nam</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-gray-400">Ngày sinh:</span>
              <span className="text-white">28 tháng 08, 2003</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-gray-400">Điện thoại:</span>
              <span className="text-white">+84 332 916 529</span>
            </div>
            <p className="text-sm text-gray-400">
              Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            type="button"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
