cmake_minimum_required(VERSION 3.10)
project(ViceCityWebEngine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
set(SOURCES
    main.cpp
)

# Create the executable
add_executable(engine ${SOURCES})

# Emscripten-specific flags
if (EMSCRIPTEN)
    set_target_properties(engine PROPERTIES
        OUTPUT_NAME "engine"
        SUFFIX ".js"
    )

    # Emscripten compiler and linker flags
    target_compile_options(engine PRIVATE
        -O3                           # Optimize for performance
        -sUSE_WEBGL2=1               # Enable WebGL 2.0
    )

    target_link_options(engine PRIVATE
        -O3
        -sUSE_WEBGL2=1               # Enable WebGL 2.0
        -sALLOW_MEMORY_GROWTH=1      # Allow memory to grow dynamically
        -sEXPORTED_FUNCTIONS=['_main','_initEngine','_renderFrame','_shutdownEngine','_getEngineVersion']
        -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap']
        -sMODULARIZE=1               # Export as ES6 module
        -sEXPORT_NAME=createEngine   # Module factory function name
        -sENVIRONMENT=web            # Target web environment only
        -sINITIAL_MEMORY=16MB        # Initial memory allocation
        -sSTACK_SIZE=1MB             # Stack size
        --no-heap-copy               # Performance optimization
        -sWASM=1                     # Output WebAssembly
    )
endif()
