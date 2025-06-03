import React, { useState } from 'react';
import { FileText, FileVideo2, FileArchive, Download } from 'lucide-react';

// Định dạng dung lượng
const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
};
// Lấy URL tải xuống
const getDownloadUrl = (file) => {
  const isCloudinary = file.url.includes('res.cloudinary.com');
  const ext = file.name.split('.').pop().toLowerCase();
  const isVideo = ['mp4', 'mov', 'avi'].includes(ext);

  if (isCloudinary && isVideo) {
    return file.url.replace('/upload/', '/upload/fl_attachment/');
  }
  return file.url;
};

// Định dạng ngày
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
};

// Rút gọn tên file
const truncateName = (name, max = 40) =>
    name.length > max ? name.slice(0, max) + '...' : name;

// Lấy icon theo loại file
const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
        case 'pdf':
        case 'doc':
        case 'docx':
        case 'txt':
            return <FileText className="text-blue-500 w-6 h-6" />;
        case 'mp4':
        case 'mov':
        case 'avi':
            return <FileVideo2 className="text-purple-500 w-6 h-6" />;
        case 'zip':
        case 'rar':
            return <FileArchive className="text-yellow-500 w-6 h-6" />;
        default:
            return <FileText className="text-gray-400 w-6 h-6" />;
    }
};

// File Section
export const FileSection = ({ files, onViewAll }) => (
  <div className="bg-white rounded-lg shadow-sm p-3 mt-3">
    <h3 className="font-semibold text-gray-800 mb-2">File</h3>
    {files.length > 0 ? (
      <div className="space-y-3">
        {files.slice(0, 5).map((file) => (
          <div key={file.id} className="flex items-center gap-3 border-b pb-2">
            <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
            <div className="flex-1 min-w-0">
              <a
                href={getDownloadUrl(file)}
                download
                target="_blank"
                className="block text-sm font-medium text-black hover:underline truncate"
                title={file.name}
              >
                {truncateName(file.name)}
              </a>
              <div className="text-xs text-gray-400 flex gap-2 mt-0.5">
                <span>{formatBytes(file.size || 0)}</span>
                <span>{formatDate(file.createdAt || new Date())}</span>
              </div>
            </div>
            <a
              href={getDownloadUrl(file)}
              download
              className="text-gray-400 hover:text-black"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
        {files.length > 5 && (
          <button
            onClick={onViewAll}
            className="w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Xem tất cả
          </button>
        )}
      </div>
    ) : (
      <p className="text-sm text-gray-500 mt-2">Chưa có file</p>
    )}
  </div>
);

export const MediaSection = ({ media, onViewAll }) => {
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

    return (
        <div className="bg-white rounded-lg shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Ảnh/Video</h3>

            {media.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mb-3">
                    {media.slice(0, 8).map((item) => {
                        if (item.type === 'image') {
                            return (
                                <img
                                    key={item.id}
                                    src={item.url}
                                    onClick={() => setPreviewImageUrl(item.url)}
                                    className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80"
                                    alt="Ảnh"
                                />
                            );
                        } else if (item.type === 'video') {
                            return (
                                <video
                                    key={item.id}
                                    src={item.url}
                                    className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80"
                                    muted
                                    onClick={() => setPreviewVideoUrl(item.url)}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            ) : (
                <p className="text-sm text-gray-500">Chưa có ảnh hoặc video</p>
            )}

            {media.length > 8 && (
                <button
                    onClick={onViewAll}
                    className="w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                    Xem tất cả
                </button>
            )}

            {/* Preview ảnh */}
            {previewImageUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={() => setPreviewImageUrl(null)}
                >
                    <img
                        src={previewImageUrl}
                        alt="Preview"
                        className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Preview video */}
            {previewVideoUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={() => setPreviewVideoUrl(null)}
                >
                    <video
                        src={previewVideoUrl}
                        controls
                        autoPlay
                        className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};