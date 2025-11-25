'use client';

import { useEffect, useRef, useState } from 'react';

export default function Paint() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [drawing, setDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const onPointerDown = (e) => {
    setDrawing(true);
    draw(e);
  };

  const onPointerUp = () => setDrawing(false);

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.01, y + 0.01);
    ctx.stroke();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ padding: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <label>Width
          <input type="range" min="1" max="16" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        </label>
        <button className="button" onClick={clear}>Clear</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <canvas
          ref={canvasRef}
          width={480}
          height={340}
          style={{ border: '1px solid #000' }}
          onPointerDown={onPointerDown}
          onPointerMove={draw}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>
    </div>
  );
}

