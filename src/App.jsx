import React from 'react';
import GameCanvas from './GameCanvas';

function App() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden select-none">
      {/* The Wasm engine will hook directly into this canvas ID */}
      <GameCanvas />
      
      {/* Temporary UI overlay to verify Tailwind and layout are working perfectly */}
      <div className="absolute top-5 left-5 z-10 text-white font-mono opacity-50 pointer-events-none">
        <h1 className="text-xl font-bold tracking-widest">VICE CITY WEB API</h1>
        <p className="text-xs text-green-400 mt-1">Status: Shell Initialized. Awaiting Wasm Core...</p>
      </div>
    </div>
  );
}

export default App;
