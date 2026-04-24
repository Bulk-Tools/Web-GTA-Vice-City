/**
 * WebAssembly Engine Loader
 * Handles loading and initialization of the C++ Vice City engine compiled to Wasm
 */

let engineModule = null;
let isInitialized = false;

/**
 * Dynamically loads a script and returns when it's ready
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function loadWasmEngine() {
  if (engineModule) {
    console.log('[Wasm Loader] Engine already loaded');
    return engineModule;
  }

  try {
    console.log('[Wasm Loader] Loading WebAssembly engine module...');

    // Load the Emscripten-generated JS glue code dynamically at runtime
    // This avoids Vite trying to bundle it during build time
    await loadScript('/wasm/engine.js');

    // The script defines a global createEngine function
    if (typeof window.createEngine !== 'function') {
      throw new Error('createEngine function not found after loading engine.js');
    }

    console.log('[Wasm Loader] Initializing engine module...');
    engineModule = await window.createEngine({
      canvas: document.getElementById('canvas'),
      onRuntimeInitialized: () => {
        console.log('[Wasm Loader] Runtime initialized successfully');
      },
      print: (text) => {
        console.log('[C++ Engine]', text);
      },
      printErr: (text) => {
        console.error('[C++ Engine Error]', text);
      }
    });

    console.log('[Wasm Loader] Engine module loaded successfully');
    return engineModule;
  } catch (error) {
    console.error('[Wasm Loader] Failed to load engine:', error);
    throw error;
  }
}

export async function initializeEngine() {
  if (isInitialized) {
    console.log('[Wasm Loader] Engine already initialized');
    return true;
  }

  try {
    const module = await loadWasmEngine();

    console.log('[Wasm Loader] Calling C++ initEngine()...');
    const result = module.ccall('initEngine', 'number', [], []);

    if (result === 1) {
      isInitialized = true;
      console.log('[Wasm Loader] Engine initialized successfully');

      // Get and log engine version
      const versionPtr = module.ccall('getEngineVersion', 'string', [], []);
      console.log('[Wasm Loader] Engine version:', versionPtr);

      return true;
    } else {
      console.error('[Wasm Loader] Engine initialization failed');
      return false;
    }
  } catch (error) {
    console.error('[Wasm Loader] Initialization error:', error);
    return false;
  }
}

export function renderFrame(timestamp) {
  if (!isInitialized || !engineModule) {
    return;
  }

  try {
    engineModule.ccall('renderFrame', null, ['number'], [timestamp]);
  } catch (error) {
    console.error('[Wasm Loader] Render error:', error);
  }
}

export function shutdownEngine() {
  if (!isInitialized || !engineModule) {
    return;
  }

  try {
    console.log('[Wasm Loader] Shutting down engine...');
    engineModule.ccall('shutdownEngine', null, [], []);
    isInitialized = false;
    engineModule = null;
    console.log('[Wasm Loader] Engine shutdown complete');
  } catch (error) {
    console.error('[Wasm Loader] Shutdown error:', error);
  }
}

export function getEngineModule() {
  return engineModule;
}

export function isEngineReady() {
  return isInitialized;
}
