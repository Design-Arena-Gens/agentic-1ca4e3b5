'use client';

import { useEffect, useRef, useState } from 'react';
import Notepad from '../windows/Notepad';
import Paint from '../windows/Paint';
import Minesweeper from '../windows/Minesweeper';
import About from '../windows/About';

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

export default function Window(props) {
  const {
    id, title, appType, x, y, width, height, zIndex,
    hidden,
    onFocus, onClose, onMinimize, onMove, onResize
  } = props;

  const ref = useRef(null);
  const [drag, setDrag] = useState(null);
  const [resize, setResize] = useState(null);

  useEffect(() => {
    const onMoveDoc = (e) => {
      if (!ref.current) return;
      const rect = ref.current.parentElement.getBoundingClientRect();
      if (drag) {
        const nx = clamp(drag.startX + e.movementX, 0, rect.width - 80);
        const ny = clamp(drag.startY + e.movementY, 0, rect.height - 80);
        onMove(nx, ny);
      } else if (resize) {
        const nw = clamp(resize.startW + e.movementX, 240, rect.width - x);
        const nh = clamp(resize.startH + e.movementY, 160, rect.height - y - 28);
        onResize(nw, nh);
      }
    };
    const onUpDoc = () => { setDrag(null); setResize(null); };
    window.addEventListener('pointermove', onMoveDoc);
    window.addEventListener('pointerup', onUpDoc);
    return () => {
      window.removeEventListener('pointermove', onMoveDoc);
      window.removeEventListener('pointerup', onUpDoc);
    };
  }, [drag, resize, onMove, onResize, x, y]);

  const content = (() => {
    switch (appType) {
      case 'notepad': return <Notepad />;
      case 'paint': return <Paint />;
      case 'minesweeper': return <Minesweeper />;
      case 'about': return <About />;
      default: return null;
    }
  })();

  return (
    <div
      ref={ref}
      className="window"
      style={{
        left: x, top: y, width, height, zIndex,
        display: hidden ? 'none' : 'block'
      }}
      onMouseDown={onFocus}
    >
      <div
        className="title-bar"
        onPointerDown={(e) => { e.preventDefault(); setDrag({ startX: x, startY: y }); onFocus(); }}
      >
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={onMinimize}></button>
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body" style={{ height: height - 28, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {content}
        </div>
        <div className="status-bar">
          <span>Ready</span>
          <span>Web98</span>
        </div>
      </div>
      <div
        onPointerDown={(e) => { e.preventDefault(); setResize({ startW: width, startH: height }); onFocus(); }}
        style={{
          position: 'absolute', right: 0, bottom: 0, width: 12, height: 12,
          cursor: 'nwse-resize', background: 'transparent'
        }}
      />
    </div>
  );
}

