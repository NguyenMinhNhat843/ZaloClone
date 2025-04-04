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

export default function EmojiGifStickerPicker({ onSelect ,onSendMessage }) {
  const [activeTab, setActiveTab] = useState('sticker');
  const pickerRef = useRef();

  // Gif
  const [gifResults, setGifResults] = useState([]);
  const [gifQuery, setGifQuery] = useState('cute');

  const TENOR_API_KEY = 'LIVDSRZULELA'; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        if (typeof onSelect === 'function') onSelect('__close__');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSelect]);

  useEffect(() => {
    if (activeTab === 'gif') {
      fetch(`https://g.tenor.com/v1/search?q=${gifQuery}&key=${TENOR_API_KEY}&limit=20`)
        .then(res => res.json())
        .then(data => {
          setGifResults(data.results || []);
        });
    }
  }, [gifQuery, activeTab]);

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
           <div>
           <input
             type="text"
             value={gifQuery}
             onChange={(e) => setGifQuery(e.target.value)}
             placeholder="Tìm GIF..."
             className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring"
           />
           <div className="grid grid-cols-3 gap-2">
             {gifResults.map((gif) => (
               <img
                 key={gif.id}
                 src={gif.media[0].tinygif.url}
                 alt="gif"
                 className="rounded cursor-pointer hover:scale-105 transition-transform"
                 onClick={() => {
                    if (typeof onSendMessage === 'function') {
                      onSendMessage(`<sticker src='${gif.media[0].tinygif.url}' />`);
                    } else {
                      onSelect(`<sticker src='${gif.media[0].tinygif.url}' />`);
                    }
                    onSelect('__close__');
                  }}
               />
             ))}
           </div>
         </div>
        )}
      </div>
    </div>
  );
}
