'use client';

export default function StartMenu({ onOpen, onClose }) {
  const open = (app) => {
    onOpen(app);
  };
  return (
    <div className="start-menu window" onMouseLeave={onClose}>
      <div className="title-bar">
        <div className="title-bar-text">Start</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body">
        <menu role="tablist" style={{ display: 'grid', gap: 4 }}>
          <button className="button" onClick={() => open('notepad')}>Notepad</button>
          <button className="button" onClick={() => open('paint')}>Paint</button>
          <button className="button" onClick={() => open('minesweeper')}>Minesweeper</button>
          <hr />
          <button className="button" onClick={() => open('about')}>About Web98</button>
        </menu>
      </div>
    </div>
  );
}

