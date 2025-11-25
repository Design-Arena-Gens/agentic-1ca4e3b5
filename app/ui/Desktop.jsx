'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import Icon from './Icon';

let nextId = 1;
const genId = () => String(nextId++);

const DEFAULT_WINDOWS = [];

export default function Desktop() {
  const [windows, setWindows] = useState(DEFAULT_WINDOWS);
  const [zTop, setZTop] = useState(10);
  const [startOpen, setStartOpen] = useState(false);

  const bringToFront = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zTop + 1 } : w))
    );
    setZTop((z) => z + 1);
  }, [zTop]);

  const openApp = useCallback((appType) => {
    setStartOpen(false);
    setWindows((prev) => {
      // focus if already open and not single-instance
      const singleInstance = new Set(['notepad', 'paint', 'minesweeper']);
      if (singleInstance.has(appType)) {
        const existing = prev.find((w) => w.appType === appType);
        if (existing) {
          return prev.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, zIndex: zTop + 1 } : w
          );
        }
      }
      const id = genId();
      const titleMap = {
        notepad: 'Notepad',
        paint: 'Paint',
        minesweeper: 'Minesweeper',
        about: 'About Web98'
      };
      const size = appType === 'minesweeper'
        ? { width: 360, height: 420 }
        : appType === 'paint'
          ? { width: 560, height: 460 }
          : { width: 420, height: 360 };
      const x = 40 + (prev.length * 20) % 200;
      const y = 40 + (prev.length * 20) % 150;
      return [
        ...prev,
        {
          id,
          title: titleMap[appType] ?? 'App',
          appType,
          x, y,
          ...size,
          minimized: false,
          zIndex: zTop + 1
        }
      ];
    });
    setZTop((z) => z + 1);
  }, [zTop]);

  const closeWindow = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const toggleMinimize = useCallback((id) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: !w.minimized } : w));
  }, []);

  const moveWindow = useCallback((id, x, y) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, x, y } : w));
  }, []);

  const resizeWindow = useCallback((id, width, height) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, width, height } : w));
  }, []);

  const desktopIcons = useMemo(() => ([
    { key: 'my-computer', label: 'My Computer', onOpen: () => openApp('about') },
    { key: 'notepad', label: 'Notepad', onOpen: () => openApp('notepad') },
    { key: 'paint', label: 'Paint', onOpen: () => openApp('paint') },
    { key: 'minesweeper', label: 'Minesweeper', onOpen: () => openApp('minesweeper') }
  ]), [openApp]);

  return (
    <div className="no-select" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="desktop-wallpaper" />

      <div className="desktop-icons">
        {desktopIcons.map((icon) => (
          <Icon key={icon.key} label={icon.label} onOpen={icon.onOpen} />
        ))}
      </div>

      {windows.map((w) => (
        <Window
          key={w.id}
          {...w}
          hidden={w.minimized}
          onFocus={() => bringToFront(w.id)}
          onClose={() => closeWindow(w.id)}
          onMinimize={() => toggleMinimize(w.id)}
          onMove={(x, y) => moveWindow(w.id, x, y)}
          onResize={(width, height) => resizeWindow(w.id, width, height)}
        />
      ))}

      <Taskbar
        windows={windows}
        onStart={() => setStartOpen((s) => !s)}
        onTaskClick={(id) => toggleMinimize(id)}
        onTaskRightClick={(id) => {
          // close via right-click for simplicity
          closeWindow(id);
        }}
      />

      {startOpen && (
        <StartMenu
          onOpen={(app) => openApp(app)}
          onClose={() => setStartOpen(false)}
        />
      )}
    </div>
  );
}

