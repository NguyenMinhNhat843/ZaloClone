import React from 'react';
import {
  Trash2,
  Users,
  ShieldCheck,
  Copy,
  RotateCw,
  Lock,
} from 'lucide-react';

const GroupSettingsPanel = ({ conversationId, onClose, onShowLeaderPanel, isReadOnly }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Quản lý nhóm</h2>
        <button onClick={onClose}>
          <span className="text-gray-600 text-xl">&times;</span>
        </button>
      </div>

      {/* Banner cảnh báo nếu là member */}
      {isReadOnly && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 bg-gray-100 border-b">
          <Lock className="w-4 h-4 text-gray-500" />
          Tính năng chỉ dành cho quản trị viên
        </div>
      )}

      {/* Nội dung chính */}
      <div className={`flex-1 overflow-y-auto ${isReadOnly ? 'opacity-50 pointer-events-none select-none' : ''}`}>
        {/* Cho phép thao tác */}
        <div className="px-4 py-4 border-b">
          <p className="font-semibold mb-2 text-sm text-gray-800">Cho phép các thành viên trong nhóm:</p>
          <div className="space-y-2">
            {[
              'Thay đổi tên & ảnh đại diện của nhóm',
              'Ghim tin nhắn, ghi chú, bình chọn lên đầu hội thoại',
              'Tạo mới ghi chú, nhắc hẹn',
              'Tạo mới bình chọn',
              'Gửi tin nhắn',
            ].map((label) => (
              <label key={label} className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked readOnly />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Các toggle cấu hình */}
        <div className="px-4 py-4 space-y-4 border-b">
          <div className="flex items-center justify-between text-sm">
            <span>Chế độ phê duyệt thành viên mới</span>
            <input type="checkbox" className="toggle" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Đánh dấu tin nhắn từ trưởng/phó nhóm</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Cho phép thành viên mới đọc tin nhắn gần nhất</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Cho phép dùng link tham gia nhóm</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="bg-gray-100 rounded p-2 mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-700">zalo.me/g/rxjhcv872</span>
            <div className="flex gap-2">
              <Copy className="w-4 h-4 text-gray-600 cursor-pointer" />
              <RotateCw className="w-4 h-4 text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-4 space-y-3">
          <button className="w-full flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-2 rounded">
            <Users className="w-4 h-4" />
            Chặn khỏi nhóm
          </button>

          <button
            className={`w-full flex items-center gap-2 text-sm p-2 rounded ${isReadOnly ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            disabled={isReadOnly}
            onClick={!isReadOnly ? onShowLeaderPanel : undefined}
          >
            <ShieldCheck className="w-4 h-4" />
            Trưởng & phó nhóm
          </button>

          <button className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded">
            <Trash2 className="w-4 h-4" />
            Giải tán nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsPanel