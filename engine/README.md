# Vice City Web Engine (C++ → WebAssembly)

This directory contains the C++ source code for the Vice City Web Engine, which is compiled to WebAssembly using Emscripten.

## Architecture

The engine is built with:
- **C++17** - Core language
- **Emscripten** - C++ to WebAssembly compiler toolchain
- **WebGL 2.0** - Graphics rendering via OpenGL ES 3.0
- **CMake** - Build system configuration

## Files

- `main.cpp` - Main engine entry point with WebGL rendering
- `CMakeLists.txt` - CMake build configuration with Emscripten settings

## Build System

The engine uses CMake with Emscripten-specific flags:
- Modular ES6 export via `MODULARIZE=1`
- WebGL 2.0 support
- Dynamic memory growth
- Optimized for web performance (O3)

## Exported Functions

The following C++ functions are exported to JavaScript:

### `initEngine()`
Initializes the WebGL 2.0 context, compiles shaders, and sets up the rendering pipeline.

**Returns:** `1` on success, `0` on failure

### `renderFrame(double timestamp)`
Renders a single frame with the given timestamp.

**Parameters:**
- `timestamp` - Current time in milliseconds (from `performance.now()`)

### `shutdownEngine()`
Cleans up all WebGL resources and shuts down the engine.

### `getEngineVersion()`
Returns the engine version string.

**Returns:** `const char*` version string

## Development

### Prerequisites

- Emscripten SDK (version 3.1.56 or later)
- CMake 3.10 or later
- A C++17 compatible compiler

### Local Build

```bash
# Navigate to engine directory
cd engine

# Create build directory
mkdir -p build
cd build

# Configure with Emscripten
emcmake cmake ..

# Build
emmake make

# Output files will be:
# - build/engine.js (JavaScript glue code)
# - build/engine.wasm (WebAssembly binary)
```

### Adding New Features

1. Add your C++ code to `main.cpp` or create new source files
2. If adding new files, update `CMakeLists.txt` in the `SOURCES` section
3. Export new functions using `EMSCRIPTEN_KEEPALIVE` and add them to `EXPORTED_FUNCTIONS` in `CMakeLists.txt`
4. Rebuild and test

### Debugging

Enable Emscripten debugging:
```bash
emcmake cmake -DCMAKE_BUILD_TYPE=Debug ..
```

Add these flags to `CMakeLists.txt` for detailed debugging:
```cmake
-gsource-map
-sASSERTIONS=1
-sSAFE_HEAP=1
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/build-wasm.yml`) automatically:
1. Builds the engine on every push to `engine/` directory
2. Compiles to WebAssembly using Emscripten
3. Copies output to `public/wasm/`
4. Commits and pushes the compiled files (on main branch)

## Integration with React Frontend

The compiled Wasm module is loaded by `src/wasmLoader.js`, which provides a clean JavaScript API:

```javascript
import { initializeEngine, renderFrame } from './wasmLoader';

// Initialize
await initializeEngine();

// Render loop
function animate(timestamp) {
  renderFrame(timestamp);
  requestAnimationFrame(animate);
}
```

## Performance Considerations

- The engine uses WebGL 2.0 for hardware-accelerated graphics
- Memory is allowed to grow dynamically (16MB initial, expandable)
- Code is optimized with `-O3` flag
- Stack size is set to 1MB for complex operations

## Future Enhancements

Planned additions:
- 3D model loading and rendering
- Texture management system
- Physics engine integration
- Audio system via Web Audio API
- Input handling (keyboard, mouse, touch, gamepad)
- Scene graph and entity component system
