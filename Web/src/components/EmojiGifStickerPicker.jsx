// EmojiGifStickerPicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const stickerPacks = [
  {
    name: 'Baby Wony',
    stickers: ['baby1.png', 'baby2.png', 'baby3.png'],
    folder: '/stickers/baby/'
  },
  {
    name: 'Funny Bear',
    stickers: ['bear1.png', 'bear2.png'],
    folder: '/stickers/bear/'
  }
];

export default function EmojiGifStickerPicker({ onSelect }) {
  const [activeTab, setActiveTab] = useState('sticker');
  const pickerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        if (typeof onSelect === 'function') onSelect('__close__');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSelect]);

  return (
    <div
      ref={pickerRef}
      className="w-[420px] h-[460px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Tabs */}
      <div className="flex border-b text-sm font-semibold text-center">
        {['sticker', 'emoji', 'gif'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 uppercase tracking-wide ${
              activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {activeTab === 'sticker' && (
          <div className="space-y-4">
            {stickerPacks.map((pack) => (
              <div key={pack.name}>
                <p className="text-sm font-semibold mb-1 text-gray-700">{pack.name}</p>
                <div className="grid grid-cols-6 gap-2">
                  {pack.stickers.map((file) => (
                    <img
                      key={file}
                      src={`${pack.folder}${file}`}
                      alt={file}
                      className="w-[52px] h-[52px] object-contain cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => onSelect(`<sticker src='${pack.folder}${file}' />`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'emoji' && (
          <div className="custom-emoji-picker">
            <Picker
              data={data}
              onEmojiSelect={(emoji) => onSelect(emoji.native)}
              theme="light"
              previewPosition="none"
              perLine={10}
              navPosition="top"
              emojiSize={24}
              emojiButtonSize={38}
              maxFrequentRows={2}
            />
          </div>
        )}

        {activeTab === 'gif' && (
          <div className="text-center text-sm text-gray-400 py-4">
            GIF search not implemented
          </div>
        )}
      </div>
    </div>
  );
}
