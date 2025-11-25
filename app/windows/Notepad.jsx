'use client';

import { useEffect, useState } from 'react';

export default function Notepad() {
  const [text, setText] = useState('');
  useEffect(() => {
    const saved = localStorage.getItem('web98-notepad') || '';
    setText(saved);
  }, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('web98-notepad', text);
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="toolbar" style={{ padding: 4 }}>
        <button className="button" onClick={() => setText('')}>New</button>
        <button className="button" onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
        <button className="button" onClick={() => alert('Saved to local storage.')}>Save</button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flex: 1, resize: 'none', width: '100%', height: '100%' }}
      />
    </div>
  );
}

