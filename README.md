# Web GTA Vice City

A web-based reimplementation of GTA Vice City using React, Vite, TailwindCSS, and WebAssembly (C++ engine).

## Architecture

This project combines modern web technologies with a high-performance C++ engine compiled to WebAssembly:

- **Frontend**: React 19 + Vite 8 + TailwindCSS
- **Graphics**: WebGL 2.0 (via C++ OpenGL ES 3.0)
- **Engine**: C++17 compiled to WebAssembly using Emscripten
- **Build Automation**: GitHub Actions for continuous Wasm compilation

## Project Structure

```
.
├── engine/                 # C++ WebAssembly engine source
│   ├── main.cpp           # Engine entry point with WebGL rendering
│   ├── CMakeLists.txt     # Build configuration
│   └── README.md          # Engine documentation
├── public/
│   └── wasm/              # Compiled WebAssembly binaries (auto-generated)
│       ├── engine.js      # Emscripten JS glue code
│       └── engine.wasm    # Compiled Wasm binary
├── src/
│   ├── App.jsx            # Main React application
│   ├── GameCanvas.jsx     # Canvas component with Wasm integration
│   ├── wasmLoader.js      # WebAssembly loader and API
│   └── main.jsx           # React entry point
└── .github/
    └── workflows/
        └── build-wasm.yml # Automated Wasm build pipeline
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) Emscripten SDK for local C++ development

### Installation

```bash
# Clone the repository
git clone https://github.com/Bulk-Tools/Web-GTA-Vice-City.git
cd Web-GTA-Vice-City

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## WebAssembly Engine

The C++ engine is automatically compiled to WebAssembly via GitHub Actions whenever changes are pushed to the `engine/` directory.

### Engine Features

- WebGL 2.0 rendering pipeline
- Hardware-accelerated graphics
- Modular ES6 export for easy integration
- Optimized for web performance

### Local Engine Development

To build the engine locally:

1. Install Emscripten SDK:
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

2. Build the engine:
```bash
cd engine
mkdir -p build && cd build
emcmake cmake ..
emmake make
cp engine.js ../../public/wasm/
cp engine.wasm ../../public/wasm/
```

See `engine/README.md` for detailed engine documentation.

## Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### CI/CD Pipeline

The project includes automated GitHub Actions workflows:

- **build-wasm.yml**: Compiles C++ engine to WebAssembly on every push
  - Triggers on changes to `engine/` directory
  - Uses Emscripten 3.1.56
  - Outputs to `public/wasm/`
  - Auto-commits compiled files on main branch

## Technology Stack

- **React 19.2.5** - UI framework
- **Vite 8** - Build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS
- **C++17** - Engine language
- **Emscripten** - C++ to Wasm compiler
- **WebGL 2.0** - Graphics API
- **OpenGL ES 3.0** - Shader language

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes only. GTA Vice City is a trademark of Rockstar Games.

