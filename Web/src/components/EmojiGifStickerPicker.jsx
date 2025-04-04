// EmojiGifStickerPicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const stickerPacks = [
    {
        id: 'cats',
        name: 'Cute Cats',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807196/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807196 + i}/android/sticker.png`
        )
      },
      {
        id: 'bunny',
        name: 'Lovely Bunny',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807203/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807203 + i}/android/sticker.png`
        )
      },
      {
        id: 'bear',
        name: 'Sweet Bear',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807225/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807225 + i}/android/sticker.png`
        )
      },
      {
        id: 'dog',
        name: 'Cool Doggo',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807236/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807236 + i}/android/sticker.png`
        )
      },
      {
        id: 'fox',
        name: 'Funny Fox',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807244/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807244 + i}/android/sticker.png`
        )
      },
        {
        id: 'panda',
        name: 'Happy Panda',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807260/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807260 + i}/android/sticker.png`
        )
      },
      {
        id: 'penguin',
        name: 'Dancing Penguin',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807280/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807280 + i}/android/sticker.png`
        )
      },
      {
        id: 'frog',
        name: 'Smiley Frog',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807300/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807300 + i}/android/sticker.png`
        )
      },
      {
        id: 'piggy',
        name: 'Chubby Piggy',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807320/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807320 + i}/android/sticker.png`
        )
      },
      {
        id: 'duck',
        name: 'Quirky Duck',
        icon: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/13807340/android/sticker.png',
        folder: '',
        stickers: Array.from({ length: 30 }, (_, i) =>
          `https://stickershop.line-scdn.net/stickershop/v1/sticker/${13807340 + i}/android/sticker.png`
        )
      }
      
  ];
  
  
export default function EmojiGifStickerPicker({ onSelect ,onSendMessage }) {
  const [activeTab, setActiveTab] = useState('sticker');
  const pickerRef = useRef();

  // Gif
  const [gifResults, setGifResults] = useState([]);
  const [gifQuery, setGifQuery] = useState('cute');

  // Tenor API key
  const TENOR_API_KEY = 'LIVDSRZULELA'; 


  // Sticker 
  const [activeStickerPackId, setActiveStickerPackId] = useState(stickerPacks[0].id);
  const scrollRef = useRef();
    // render rencent sticker and gift packs
    const [recentStickers, setRecentStickers] = useState([]);
    const [recentGifs, setRecentGifs] = useState([]);

    // Save recent stickers and gifs to local storage
    useEffect(() => {
    const storedStickers = localStorage.getItem('recentStickers');
    if (storedStickers) setRecentStickers(JSON.parse(storedStickers));
  
    const storedGifs = localStorage.getItem('recentGifs');
    if (storedGifs) setRecentGifs(JSON.parse(storedGifs));
  }, []);


  // handleclick outside to close the picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        if (typeof onSelect === 'function') onSelect('__close__');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSelect]);

  // Fetch GIFs from Tenor API
  useEffect(() => {
    if (activeTab === 'gif') {
      fetch(`https://g.tenor.com/v1/search?q=${gifQuery}&key=${TENOR_API_KEY}&limit=20`)
        .then(res => res.json())
        .then(data => {
          setGifResults(data.results || []);
        });
    }
  }, [gifQuery, activeTab]);

  //  add to recent stickers and gifs
  const addToRecentStickers = (value) => {
    console.log('🟩 addToRecentStickers đang được gọi với:', value);
  console.log('📦 Danh sách trước khi thêm:', recentStickers);
    setRecentStickers(prev => {
      const updated = [value, ...prev.filter(i => i !== value)].slice(0, 15);
      console.log('🔁 updated recentStickers:', updated);
      localStorage.setItem('recentStickers', JSON.stringify(updated));
      return updated;
    });
  };
  
  const addToRecentGifs = (value) => {
    setRecentGifs(prev => {
      const updated = [value, ...prev.filter(i => i !== value)].slice(0, 15);
      localStorage.setItem('recentGifs', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div
      ref={pickerRef}
      className="w-[420px] h-[460px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
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
             {/* Gần đây */}
            {recentStickers.length > 0 && (
            <div>
                <p className="text-sm font-semibold mb-1 text-gray-700">Gần đây</p>
                <div className="grid grid-cols-5 gap-2">
                {recentStickers.map((item, idx) => {
                    const src = item.match(/src='(.*?)'/)?.[1];
                    return (
                    <img
                        key={idx}
                        src={src}
                        alt="recent-sticker"
                        className="w-[52px] h-[52px] object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                        if (typeof onSendMessage === 'function') onSendMessage(item);
                        else onSelect(item);
                        onSelect('__close__');
                        }}
            
                    />
                    );
                })}
                </div>
            </div>
            )}
            {stickerPacks
              .filter(pack => pack.id === activeStickerPackId)
              .map(pack => (
                <div key={pack.id}>
                  <p className="text-sm font-semibold mb-1 text-gray-700">{pack.name}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {pack.stickers.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`sticker-${idx}`}
                        className="w-[52px] h-[52px] object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          const value = `<sticker src='${url}' />`;
                          addToRecentStickers(value);
                          if (typeof onSendMessage === 'function') onSendMessage(value);
                          else onSelect(value);
                         
                          onSelect('__close__');
                        }}
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
              {/* Gần đây */}
              {recentGifs.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-semibold mb-1 text-gray-700">Gần đây</p>
                <div className="grid grid-cols-3 gap-2">
                  {recentGifs.map((item, idx) => {
                    const src = item.match(/src='(.*?)'/)?.[1];
                    return (
                      <img
                        key={idx}
                        src={src}
                        alt="recent-gif"
                        className="rounded cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          if (typeof onSendMessage === 'function') onSendMessage(item);
                          else onSelect(item);
                          onSelect('__close__');
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
           <div className="grid grid-cols-3 gap-2">
              {gifResults.map((gif) => {
                const url = gif.media[0].tinygif.url;
                const value = `<sticker src='${url}' />`;
                return (
                  <img
                    key={gif.id}
                    src={url}
                    alt="gif"
                    className="rounded cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      if (typeof onSendMessage === 'function') onSendMessage(value);
                      else onSelect(value);
                      addToRecentGifs(value);
                      onSelect('__close__');
                    }}
                  />
                );
              })}
            </div>
         </div>
        )}
      </div>
    {/* Sticker pack selector */}
    {activeTab === 'sticker' && (
    <div className="relative border-t p-2">
        {/* Scroll buttons */}
        <button
        onClick={() => scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' })}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-1 rounded-full z-10"
        >
        ◀
        </button>
        <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 px-10"
        style={{ scrollSnapType: 'x mandatory' }}
        >
        {stickerPacks.map(pack => (
            <button
            key={pack.id}
            onClick={() => setActiveStickerPackId(pack.id)}
            className={`flex-shrink-0 p-1 rounded-full hover:ring-2 transition-transform hover:scale-105 ${
                activeStickerPackId === pack.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ scrollSnapAlign: 'start' }}
            >
            <img src={pack.icon} className="w-12 h-12 object-contain" alt={pack.name} />
            </button>
        ))}
        </div>
        <button
        onClick={() => scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' })}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-1 rounded-full z-10"
        >
        ▶
        </button>
    </div>
    )}
    </div>
    
  );
}
