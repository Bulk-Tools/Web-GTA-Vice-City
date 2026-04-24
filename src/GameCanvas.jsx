import React, { useEffect, useRef, useState } from 'react';
import { initializeEngine, renderFrame, shutdownEngine } from './wasmLoader';

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const [engineStatus, setEngineStatus] = useState('Loading...');
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Prevent default context menu on long-press (mobile) or right-click (desktop)
    const preventDefault = (e) => e.preventDefault();
    canvas.addEventListener('contextmenu', preventDefault);

    // Initialize the Wasm engine
    let isComponentMounted = true;

    async function initEngine() {
      try {
        setEngineStatus('Initializing engine...');
        const success = await initializeEngine();

        if (success && isComponentMounted) {
          setEngineStatus('Running');
          startRenderLoop();
        } else if (isComponentMounted) {
          setEngineStatus('Initialization failed');
        }
      } catch (error) {
        console.error('Engine initialization error:', error);
        if (isComponentMounted) {
          setEngineStatus('Error: ' + error.message);
        }
      }
    }

    function startRenderLoop() {
      let lastTime = performance.now();

      function animate(currentTime) {
        if (!isComponentMounted) return;

        renderFrame(currentTime);
        animationFrameRef.current = requestAnimationFrame(animate);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    initEngine();

    return () => {
      isComponentMounted = false;
      canvas.removeEventListener('contextmenu', preventDefault);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      shutdownEngine();
    };
  }, []);

  return (
    <>
      <canvas
        id="canvas"
        ref={canvasRef}
        className="w-full h-full block absolute top-0 left-0 outline-none"
        onContextMenu={(e) => e.preventDefault()}
        tabIndex="0"
      />
      {engineStatus !== 'Running' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white font-mono text-center">
          <div className="text-lg">{engineStatus}</div>
        </div>
      )}
    </>
  );
}
