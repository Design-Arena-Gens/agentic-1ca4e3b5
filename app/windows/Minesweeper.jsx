'use client';

import { useCallback, useMemo, useState } from 'react';

const ROWS = 9, COLS = 9, MINES = 10;

function neighbors(r, c) {
  const res = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) res.push([nr, nc]);
    }
  }
  return res;
}

function generate(firstR, firstC) {
  const total = ROWS * COLS;
  const cells = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, adj: 0, open: false, flag: false }))
  );
  const forbidden = new Set([`${firstR},${firstC}`, ...neighbors(firstR, firstC).map(([r, c]) => `${r},${c}`)]);
  let placed = 0;
  while (placed < MINES) {
    const idx = Math.floor(Math.random() * total);
    const r = Math.floor(idx / COLS), c = idx % COLS;
    const key = `${r},${c}`;
    if (forbidden.has(key) || cells[r][c].mine) continue;
    cells[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (cells[r][c].mine) continue;
      let count = 0;
      for (const [nr, nc] of neighbors(r, c)) if (cells[nr][nc].mine) count++;
      cells[r][c].adj = count;
    }
  }
  return cells;
}

export default function Minesweeper() {
  const [started, setStarted] = useState(false);
  const [board, setBoard] = useState(null);
  const [status, setStatus] = useState('Click any cell to start');

  const reveal = useCallback((r, c) => {
    setBoard((prev) => {
      const next = prev.map((row) => row.map((c) => ({ ...c })));
      const stack = [[r, c]];
      while (stack.length) {
        const [cr, cc] = stack.pop();
        const cell = next[cr][cc];
        if (cell.open || cell.flag) continue;
        cell.open = true;
        if (cell.adj === 0 && !cell.mine) {
          for (const [nr, nc] of neighbors(cr, cc)) {
            if (!next[nr][nc].open) stack.push([nr, nc]);
          }
        }
      }
      return next;
    });
  }, []);

  const onLeft = (r, c) => {
    if (!started) {
      const gen = generate(r, c);
      setBoard(gen);
      setStarted(true);
    }
    setBoard((prev) => {
      const cell = prev[r][c];
      if (cell.flag || cell.open) return prev;
      if (cell.mine) {
        // reveal all
        const next = prev.map((row) => row.map((c) => ({ ...c, open: c.open || c.mine })));
        setStatus('Boom! You lost.');
        return next;
      }
      const next = prev.map((row) => row.map((c) => ({ ...c })));
      const stack = [[r, c]];
      while (stack.length) {
        const [cr, cc] = stack.pop();
        const cell2 = next[cr][cc];
        if (cell2.open || cell2.flag) continue;
        cell2.open = true;
        if (cell2.adj === 0 && !cell2.mine) {
          for (const [nr, nc] of neighbors(cr, cc)) {
            if (!next[nr][nc].open) stack.push([nr, nc]);
          }
        }
      }
      // check win
      const unopened = next.flat().filter((c) => !c.open).length;
      if (unopened === MINES) setStatus('You win!');
      else setStatus('Keep going?');
      return next;
    });
  };

  const onRight = (r, c, e) => {
    e.preventDefault();
    if (!started || status.includes('lost') || status.includes('win')) return;
    setBoard((prev) => {
      const next = prev.map((row) => row.map((c) => ({ ...c })));
      const cell = next[r][c];
      if (cell.open) return prev;
      cell.flag = !cell.flag;
      return next;
    });
  };

  const reset = () => {
    setStarted(false);
    setBoard(null);
    setStatus('Click any cell to start');
  };

  return (
    <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="status-bar">
        <span>{status}</span>
        <button className="button" onClick={reset}>Reset</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 32px)`, gap: 2, alignSelf: 'start' }}>
        {(board ?? Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ open: false, flag: false, adj: 0, mine: false })))).map((row, r) =>
          row.map((cell, c) => {
            const face = cell.open
              ? (cell.mine ? '??' : (cell.adj || ''))
              : (cell.flag ? '??' : '');
            return (
              <button
                key={`${r}-${c}`}
                className="button"
                style={{ width: 32, height: 32, padding: 0, textAlign: 'center' }}
                onClick={() => onLeft(r, c)}
                onContextMenu={(e) => onRight(r, c, e)}
              >
                {face}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

