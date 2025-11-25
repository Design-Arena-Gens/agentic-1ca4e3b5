'use client';

export default function Icon({ label, onOpen }) {
  return (
    <div
      className="desktop-icon"
      onDoubleClick={onOpen}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}
    >
      <div style={{
        width: 40,
        height: 40,
        background: 'linear-gradient(#ffffff, #c0c0c0)',
        border: '1px solid #000',
        boxShadow: 'inset -1px -1px 0 #000, inset 1px 1px 0 #fff'
      }} />
      <div style={{ textAlign: 'center' }}>{label}</div>
    </div>
  );
}

