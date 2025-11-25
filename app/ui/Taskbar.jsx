'use client';

import { useMemo } from 'react';

export default function Taskbar({ windows, onStart, onTaskClick, onTaskRightClick }) {
  const timeString = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [windows.length]); // cheap re-render

  return (
    <div className="taskbar window" style={{ zIndex: 10001 }}>
      <div className="title-bar">
        <div className="title-bar-text">Web98</div>
      </div>
      <div className="window-body taskbar-content">
        <button className="button" onClick={onStart}>
          Start
        </button>
        <div style={{ display: 'flex', gap: 6, flex: 1, overflowX: 'auto' }}>
          {windows.map((w) => (
            <button
              key={w.id}
              className="button"
              onClick={() => onTaskClick(w.id)}
              onContextMenu={(e) => { e.preventDefault(); onTaskRightClick?.(w.id); }}
            >
              {w.title}{w.minimized ? ' (min)' : ''}
            </button>
          ))}
        </div>
        <div className="status-bar" style={{ minWidth: 80 }}>
          <span>{timeString}</span>
        </div>
      </div>
    </div>
  );
}

