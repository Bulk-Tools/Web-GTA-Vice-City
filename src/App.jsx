import React, { useCallback } from 'react';
import GameCanvas from './GameCanvas';

function App() {
  const simulateKey = useCallback((key, type) => {
    window.dispatchEvent(new KeyboardEvent(type, { key: key, code: `Key${key.toUpperCase()}`, bubbles: true }));
  }, []);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden select-none">
      <GameCanvas />

      {/* Status Overlay */}
      <div className="absolute top-5 left-5 z-10 text-white font-mono opacity-50 pointer-events-none">
        <h1 className="text-xl font-bold tracking-widest">VICE CITY WEB API</h1>
        <p className="text-xs text-green-400 mt-1">Status: Phase 3 (VFS &amp; Mobile Controls Active)</p>
      </div>

      {/* Mobile Touch Overlay */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2 z-20 opacity-60">
        <button className="w-16 h-16 bg-white/20 rounded-full text-white font-bold backdrop-blur-sm active:bg-white/50" onTouchStart={() => simulateKey('w', 'keydown')}
          onTouchEnd={() => simulateKey('w', 'keyup')}
        >W</button>
        <div className="flex gap-2">
          <button className="w-16 h-16 bg-white/20 rounded-full text-white font-bold backdrop-blur-sm active:bg-white/50" onTouchStart={() => simulateKey('a', 'keydown')}
            onTouchEnd={() => simulateKey('a', 'keyup')}
          >A</button>
          <button className="w-16 h-16 bg-white/20 rounded-full text-white font-bold backdrop-blur-sm active:bg-white/50" onTouchStart={() => simulateKey('s', 'keydown')}
            onTouchEnd={() => simulateKey('s', 'keyup')}
          >S</button>
          <button className="w-16 h-16 bg-white/20 rounded-full text-white font-bold backdrop-blur-sm active:bg-white/50" onTouchStart={() => simulateKey('d', 'keydown')}
            onTouchEnd={() => simulateKey('d', 'keyup')}
          >D</button>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 flex gap-4 z-20 opacity-60">
         <button className="w-20 h-20 bg-red-500/40 rounded-full text-white font-bold backdrop-blur-sm active:bg-red-500/80" onTouchStart={() => simulateKey('Enter', 'keydown')}
            onTouchEnd={() => simulateKey('Enter', 'keyup')}
          >ENTER</button>
      </div>
    </div>
  );
}

export default App;
