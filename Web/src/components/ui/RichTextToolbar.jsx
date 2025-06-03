// RichTextToolbar.jsx
import React, { useState, useEffect } from 'react';
import {
  Bold, Italic, Underline, Eraser, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, PaintBucket, TextCursorInput,
} from 'lucide-react';

export default function RichTextToolbar({ applyFormat, inputRef }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const colors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#000000'];
  const fontSizes = [
    { label: 'Rất lớn', value: 7 },
    { label: 'Lớn', value: 5 },
    { label: 'Trung bình', value: 3 },
    { label: 'Nhỏ', value: 2 },
  ];

  const exec = (cmd, val = null) => {
    inputRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  // Reset selected color when input is cleared
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (inputRef.current?.innerText.trim() === '') {
        setSelectedColor(null);
      }
    });

    if (inputRef.current) {
      observer.observe(inputRef.current, { childList: true, subtree: true, characterData: true });
    }

    return () => observer.disconnect();
  }, [inputRef]);

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-gray-500">Nhấn Ctrl + Shift + X để định dạng tin nhắn</span>
      <div className="flex flex-wrap items-center gap-1">
        <button type="button" onClick={() => applyFormat('bold')} className="hover:bg-gray-200 p-1 rounded"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat('italic')} className="hover:bg-gray-200 p-1 rounded"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat('underline')} className="hover:bg-gray-200 p-1 rounded"><Underline className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat('heading')} className="hover:bg-gray-200 p-1 rounded">H</button>
        <button type="button" onClick={() => applyFormat('list')} className="hover:bg-gray-200 p-1 rounded"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat('insertOrderedList')} className="hover:bg-gray-200 p-1 rounded"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat('undo')} className="hover:bg-gray-200 p-1 rounded">↺</button>
        <button type="button" onClick={() => applyFormat('redo')} className="hover:bg-gray-200 p-1 rounded">↻</button>

        {/* Font size */}
        <div className="relative">
          <button type="button" onClick={() => setShowFontSize(!showFontSize)} className="hover:bg-gray-200 p-1 rounded">
            <TextCursorInput className="w-4 h-4" />
          </button>
          {showFontSize && (
            <div className="absolute bottom-8 left-0 bg-white shadow-md rounded p-2 z-10">
              {fontSizes.map(opt => (
                <div key={opt.value} className="cursor-pointer px-2 py-1 hover:bg-gray-100" onClick={() => {
                  exec('fontSize', opt.value);
                  setShowFontSize(false);
                }}>{opt.label}</div>
              ))}
            </div>
          )}
        </div>

        {/* Color picker */}
        <div className="relative">
          <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className="hover:bg-gray-200 p-1 rounded">
            <PaintBucket className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-8 left-0 bg-white shadow-md rounded p-2 flex gap-2 z-10">
              {colors.map(color => (
                <button
                  type="button"
                  key={color}
                  className={`w-5 h-5 rounded ${selectedColor === color ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    exec('foreColor', color);
                    setSelectedColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Clear format */}
        <button type="button" onClick={() => exec('removeFormat')} className="hover:bg-gray-200 p-1 rounded"><Eraser className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
