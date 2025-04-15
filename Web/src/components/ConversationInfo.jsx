// ConversationInfo.jsx
import React, { useState } from 'react';
import { 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Link as LinkIcon, 
  ChevronDown, 
  ChevronUp,
  X 
} from 'lucide-react';

const ConversationInfo = ({ messages, onClose }) => {
  const [isMediaOpen, setIsMediaOpen] = useState(true);
  const [isFilesOpen, setIsFilesOpen] = useState(true);
  const [isLinksOpen, setIsLinksOpen] = useState(true);

  // Lọc dữ liệu từ messages
  const media = messages
    .filter(msg => typeof msg.content === 'string' && 
      (msg.content.startsWith('<image') || (msg.content.startsWith('<file') && (msg.content.includes("type='image'") || msg.content.includes("type='video'"))))
    )
    .map(msg => {
      if (msg.content.startsWith('<image')) {
        return {
          id: msg.id,
          name: `image_${msg.id}.jpg`,
          url: msg.content.match(/src=['"](.*?)['"]/)[1],
          type: 'image'
        };
      } else {
        return {
          id: msg.id,
          name: msg.content.match(/name='(.*?)'/)?.[1] || `media_${msg.id}`,
          url: msg.content.match(/url='(.*?)'/)?.[1] || '#',
          type: msg.content.includes("type='video'") ? 'video' : 'image'
        };
      }
    });

  const files = messages
    .filter(msg => typeof msg.content === 'string' && msg.content.startsWith('<file') && 
      !msg.content.includes("type='image'") && !msg.content.includes("type='video'"))
    .map(msg => ({
      id: msg.id,
      name: msg.content.match(/name='(.*?)'/)?.[1] || `file_${msg.id}`,
      url: msg.content.match(/url='(.*?)'/)?.[1] || '#'
    }));

  const links = messages
    .filter(msg => typeof msg.content === 'string' && msg.content.includes('http') && !msg.content.startsWith('<'))
    .map(msg => {
      const urlMatch = msg.content.match(/(https?:\/\/[^\s]+)/);
      return {
        id: msg.id,
        name: urlMatch ? urlMatch[0].substring(0, 20) + '...' : `link_${msg.id}`,
        url: urlMatch ? urlMatch[0] : '#'
      };
    });

  return (
    <div className="w-80 h-screen bg-gray-100 border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Thông tin hội thoại</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Nội dung */}
      <div className="p-4 space-y-4">
        {/* Phần ảnh và video */}
        <div className="bg-white rounded-lg shadow-sm">
          <button 
            className="w-full flex items-center justify-between p-3"
            onClick={() => setIsMediaOpen(!isMediaOpen)}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Ảnh & Video ({media.length})</span>
            </div>
            {isMediaOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {isMediaOpen && (
            <div className="p-3 border-t border-gray-100">
              {media.length > 0 ? media.map((item) => (
                <a 
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  {item.type === 'image' ? (
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-700">{item.name}</span>
                </a>
              )) : (
                <p className="text-sm text-gray-500">Chưa có ảnh hoặc video</p>
              )}
            </div>
          )}
        </div>

        {/* Phần file */}
        <div className="bg-white rounded-lg shadow-sm">
          <button 
            className="w-full flex items-center justify-between p-3"
            onClick={() => setIsFilesOpen(!isFilesOpen)}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span className="font-medium">File ({files.length})</span>
            </div>
            {isFilesOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {isFilesOpen && (
            <div className="p-3 border-t border-gray-100">
              {files.length > 0 ? files.map((item) => (
                <a 
                  key={item.id}
                  href={item.url}
                  download={item.name}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </a>
              )) : (
                <p className="text-sm text-gray-500">Chưa có file</p>
              )}
            </div>
          )}
        </div>

        {/* Phần link */}
        <div className="bg-white rounded-lg shadow-sm">
          <button 
            className="w-full flex items-center justify-between p-3"
            onClick={() => setIsLinksOpen(!isLinksOpen)}
          >
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Link ({links.length})</span>
            </div>
            {isLinksOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {isLinksOpen && (
            <div className="p-3 border-t border-gray-100">
              {links.length > 0 ? links.map((item) => (
                <a 
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </a>
              )) : (
                <p className="text-sm text-gray-500">Chưa có link</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationInfo;