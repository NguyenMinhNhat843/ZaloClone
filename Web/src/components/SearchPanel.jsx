import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import emptyKeyword from '../assets/upload/search_empty.png';
import emptyState from '../assets/upload/search_empty_keyword_state.png';

export default function SearchPanel({ messages, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }
    const filtered = messages.filter((msg) =>
      typeof msg.content === 'string' && msg.content.toLowerCase().includes(keyword.toLowerCase())
    );
    setResults(filtered);
  }, [keyword, messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 mt-1 border-b">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Tìm kiếm trong trò chuyện</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-black">
                <X className="w-5 h-5" />
            </button>
        </div>
      </div>

            {/* Input & Filter Section */}
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Nhập từ khóa để tìm kiếm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          />
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <label className="text-sm text-gray-600">Lọc theo:</label>
          <select className="px-2 py-1 border rounded-md text-sm">
            <option>Ngày gửi</option>
            <option>Tên người gửi</option>
          </select>
        </div>
      </div>
    
      <div className="flex-1 overflow-y-auto p-4">
        {keyword.trim() ? (
          results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <img
                src={emptyKeyword}
                alt="Không tìm thấy kết quả"
                className="w-32 h-32 mb-4 opacity-60"
              />
              <p className="font-semibold">Không tìm thấy kết quả</p>
              <p className="text-sm text-gray-400">Vui lòng thử lại từ khóa khác</p>
            </div>
          ) : (
            results.map((msg) => (
              <div key={msg.id} className="p-2 mb-2 border rounded bg-gray-50">
                <div
                  className="text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                ></div>
                <div className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <img
              src={emptyState}
              alt="Hãy nhập từ khóa để tìm kiếm"
              className="w-32 h-32 mb-4 opacity-60"
            />
            <p className="text-sm">Hãy nhập từ khóa để bắt đầu tìm kiếm tin nhắn và file trong trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  );
}
    