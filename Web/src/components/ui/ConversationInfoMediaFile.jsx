import React, {useState} from 'react';
import { FileText, ImageIcon, Video } from 'lucide-react';

const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
};

export const MediaSection = ({ media, onViewAll }) => {
    const [previewUrl, setPreviewUrl] = useState(null); // ✅ hook nằm trong component

    return (
        <div className="bg-white rounded-lg shadow-sm p-3">
            <h3 className="font-semibold text-gray-800 mb-2">Ảnh/Video</h3>
            {media.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mb-3">
                    {media.slice(0, 8).map((item) => (
                        <img
                            key={item.id}
                            src={item.url}
                            onClick={() => setPreviewUrl(item.url)}
                            className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80"
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">Chưa có ảnh hoặc video</p>
            )}
            {media.length > 8 && (
                <button onClick={onViewAll} className="w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded">
                    Xem tất cả
                </button>
            )}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={() => setPreviewUrl(null)}
                >
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export const FileSection = ({ files, onViewAll }) => (
    <div className="bg-white rounded-lg shadow-sm p-3 mt-3">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">File</h3>
        </div>
        {files.length > 0 ? (
            <div className="space-y-2 mt-2">
                {files.slice(0, 5).map((file) => (
                    <div key={file.id} className="flex justify-between items-center border-b pb-1">
                        <a href={file.url} download className="text-sm text-blue-600 truncate max-w-[180px] hover:underline">
                            {file.name}
                        </a>
                        <div className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatBytes(file.size || 0)}</div>
                        <div className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatDate(file.createdAt || new Date())}</div>
                    </div>
                ))}
                {files.length > 5 && (
                    <button onClick={onViewAll} className="w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded">
                        Xem tất cả
                    </button>
                )}
            </div>
        ) : (
            <p className="text-sm text-gray-500 mt-2">Chưa có file</p>
        )}
    </div>
);
