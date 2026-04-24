import React, { useEffect, useRef } from 'react';

export default function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Prevent default context menu on long-press (mobile) or right-click (desktop)
    const preventDefault = (e) => e.preventDefault();
    canvas.addEventListener('contextmenu', preventDefault);
    return () => canvas.removeEventListener('contextmenu', preventDefault);
  }, []);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      className="w-full h-full block absolute top-0 left-0 outline-none"
      onContextMenu={(e) => e.preventDefault()}
      tabIndex="0"
    />
  );
}
