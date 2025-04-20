import React from 'react';
import {
  Check,
  Trash2,
  Users,
  ShieldCheck,
  Link,
  Copy,
  RotateCw,
  AlertTriangle,
} from 'lucide-react';

const GroupSettingsPanel = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Quản lý nhóm</h2>
        <button onClick={onClose}>
          <span className="text-gray-600">&times;</span>
        </button>
      </div>

      {/* Cho phép các thành viên trong nhóm */}
      <div className="p-4">
        <p className="font-semibold mb-2">Cho phép các thành viên trong nhóm:</p>
        <div className="space-y-2">
          {[
            'Thay đổi tên & ảnh đại diện của nhóm',
            'Ghim tin nhắn, ghi chú, bình chọn lên đầu hội thoại',
            'Tạo mới ghi chú, nhắc hẹn',
            'Tạo mới bình chọn',
            'Gửi tin nhắn',
          ].map((label) => (
            <label key={label} className="flex items-center gap-2">
              <input type="checkbox" checked readOnly />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tùy chọn khác */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Chế độ phê duyệt thành viên mới</span>
          <input type="checkbox" className="toggle" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Đánh dấu tin nhắn từ trưởng/phó nhóm</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Cho phép thành viên mới đọc tin nhắn gần nhất</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Cho phép dùng link tham gia nhóm</span>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>

        <div className="mt-2">
          <div className="bg-gray-100 rounded p-2 flex items-center justify-between">
            <span className="text-sm">zalo.me/g/rxjhcv872</span>
            <div className="flex gap-2">
              <Copy className="w-4 h-4 text-gray-600 cursor-pointer" />
              <RotateCw className="w-4 h-4 text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 border-t pt-4 px-4 space-y-3">
        <button className="w-full flex items-center gap-2 text-sm hover:bg-gray-100 p-2 rounded">
          <Users className="w-4 h-4" />
          Chặn khỏi nhóm
        </button>
        <button className="w-full flex items-center gap-2 text-sm hover:bg-gray-100 p-2 rounded">
          <ShieldCheck className="w-4 h-4" />
          Trưởng & phó nhóm
        </button>
        <button className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded">
          <Trash2 className="w-4 h-4" />
          Giải tán nhóm
        </button>
      </div>
    </div>
  );
};

export default GroupSettingsPanel;