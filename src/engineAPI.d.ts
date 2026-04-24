/**
 * C++ Engine API Reference
 *
 * This file documents all C++ functions exported to JavaScript via Emscripten.
 * These functions are available through the wasmLoader.js module.
 */

// ============================================================================
// EXPORTED C++ FUNCTIONS
// ============================================================================

/**
 * Initialize the WebGL engine
 *
 * Creates a WebGL 2.0 context, compiles shaders, and sets up rendering pipeline.
 * Must be called before any rendering operations.
 *
 * C++ Signature: int initEngine()
 *
 * @returns {number} 1 on success, 0 on failure
 *
 * JavaScript Usage:
 *   const module = await loadWasmEngine();
 *   const success = module.ccall('initEngine', 'number', [], []);
 *   if (success === 1) { console.log('Engine initialized'); }
 */

/**
 * Render a single frame
 *
 * Updates animations and renders the scene. Should be called from
 * requestAnimationFrame loop.
 *
 * C++ Signature: void renderFrame(double currentTime)
 *
 * @param {number} currentTime - Timestamp from performance.now() in milliseconds
 *
 * JavaScript Usage:
 *   function animate(timestamp) {
 *     module.ccall('renderFrame', null, ['number'], [timestamp]);
 *     requestAnimationFrame(animate);
 *   }
 */

/**
 * Shutdown the engine and cleanup resources
 *
 * Destroys WebGL context, frees memory, and cleans up all resources.
 * Should be called when the component unmounts or app closes.
 *
 * C++ Signature: void shutdownEngine()
 *
 * JavaScript Usage:
 *   module.ccall('shutdownEngine', null, [], []);
 */

/**
 * Get the engine version string
 *
 * Returns a string identifying the engine version.
 *
 * C++ Signature: const char* getEngineVersion()
 *
 * @returns {string} Version string (e.g., "Vice City Web Engine v0.1.0")
 *
 * JavaScript Usage:
 *   const version = module.ccall('getEngineVersion', 'string', [], []);
 *   console.log('Engine version:', version);
 */

// ============================================================================
// HELPER FUNCTIONS (wasmLoader.js)
// ============================================================================

/**
 * High-level wrapper functions provided by wasmLoader.js:
 *
 * - loadWasmEngine(): Promise<Module>
 *   Loads the WebAssembly module and returns the Emscripten module object
 *
 * - initializeEngine(): Promise<boolean>
 *   Loads and initializes the engine (combines loadWasmEngine + initEngine)
 *
 * - renderFrame(timestamp: number): void
 *   Wrapper around the C++ renderFrame function
 *
 * - shutdownEngine(): void
 *   Wrapper around the C++ shutdownEngine function
 *
 * - getEngineModule(): Module | null
 *   Returns the loaded engine module (or null if not loaded)
 *
 * - isEngineReady(): boolean
 *   Returns true if the engine is initialized and ready to render
 */

// ============================================================================
// EMSCRIPTEN MODULE METHODS
// ============================================================================

/**
 * The Emscripten module provides these utility methods:
 *
 * - ccall(name, returnType, argTypes, args)
 *   Call a C++ function with JavaScript values
 *
 * - cwrap(name, returnType, argTypes)
 *   Create a JavaScript wrapper for a C++ function
 *
 * Example using cwrap:
 *   const initEngine = module.cwrap('initEngine', 'number', []);
 *   const result = initEngine();  // Returns 1 or 0
 *
 *   const renderFrame = module.cwrap('renderFrame', null, ['number']);
 *   renderFrame(performance.now());
 */

// ============================================================================
// CANVAS REQUIREMENTS
// ============================================================================

/**
 * The C++ engine expects a canvas element with id="canvas" to be present
 * in the DOM before initialization.
 *
 * HTML:
 *   <canvas id="canvas"></canvas>
 *
 * The canvas size is automatically handled by the engine using:
 *   emscripten_get_canvas_element_size("#canvas", &width, &height)
 */

// ============================================================================
// TYPE MAPPINGS (Emscripten)
// ============================================================================

/**
 * JavaScript to C++ type conversions:
 *
 * JavaScript    →  C++ Type         →  Emscripten Type String
 * -----------      -----------          ----------------------
 * number        →  int               →  'number'
 * number        →  float/double      →  'number'
 * string        →  const char*       →  'string'
 * boolean       →  bool              →  'boolean'
 * null/void     →  void              →  null
 * Array         →  pointer           →  'array'
 *
 * Return type can be: 'number', 'string', 'boolean', 'array', or null (void)
 */

export {};  // Make this a module
