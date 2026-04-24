#include <emscripten/emscripten.h>
#include <emscripten/html5.h>
#include <GLES3/gl3.h>
#include <cstdio>
#include <cmath>

// Global state
static bool isRunning = false;
static double lastFrameTime = 0.0;
static float rotationAngle = 0.0f;

// Shader sources
const char* vertexShaderSource = R"(
    attribute vec4 position;
    uniform float rotation;
    void main() {
        float s = sin(rotation);
        float c = cos(rotation);
        mat2 rot = mat2(c, s, -s, c);
        vec2 rotatedPos = rot * position.xy;
        gl_Position = vec4(rotatedPos, position.zw);
    }
)";

const char* fragmentShaderSource = R"(
    precision mediump float;
    uniform vec3 color;
    void main() {
        gl_FragColor = vec4(color, 1.0);
    }
)";

// Shader compilation helper
GLuint compileShader(GLenum type, const char* source) {
    GLuint shader = glCreateShader(type);
    glShaderSource(shader, 1, &source, nullptr);
    glCompileShader(shader);

    GLint success;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
    if (!success) {
        char infoLog[512];
        glGetShaderInfoLog(shader, 512, nullptr, infoLog);
        printf("Shader compilation failed: %s\n", infoLog);
    }
    return shader;
}

// WebGL context and program
EMSCRIPTEN_WEBGL_CONTEXT_HANDLE glContext;
GLuint shaderProgram;
GLuint vao, vbo;

// Initialize the engine
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int initEngine() {
        printf("[C++ Engine] Initializing Vice City Web Engine...\n");

        // Create WebGL 2.0 context
        EmscriptenWebGLContextAttributes attrs;
        emscripten_webgl_init_context_attributes(&attrs);
        attrs.majorVersion = 2;
        attrs.minorVersion = 0;

        glContext = emscripten_webgl_create_context("#canvas", &attrs);
        if (glContext <= 0) {
            printf("[C++ Engine] ERROR: Failed to create WebGL context\n");
            return 0;
        }

        emscripten_webgl_make_context_current(glContext);
        printf("[C++ Engine] WebGL 2.0 context created successfully\n");

        // Compile shaders
        GLuint vertexShader = compileShader(GL_VERTEX_SHADER, vertexShaderSource);
        GLuint fragmentShader = compileShader(GL_FRAGMENT_SHADER, fragmentShaderSource);

        // Link shader program
        shaderProgram = glCreateProgram();
        glAttachShader(shaderProgram, vertexShader);
        glAttachShader(shaderProgram, fragmentShader);
        glLinkProgram(shaderProgram);

        GLint success;
        glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
        if (!success) {
            char infoLog[512];
            glGetProgramInfoLog(shaderProgram, 512, nullptr, infoLog);
            printf("[C++ Engine] Shader linking failed: %s\n", infoLog);
            return 0;
        }

        glDeleteShader(vertexShader);
        glDeleteShader(fragmentShader);

        // Create triangle vertex data
        float vertices[] = {
            0.0f,  0.5f, 0.0f, 1.0f,
           -0.5f, -0.5f, 0.0f, 1.0f,
            0.5f, -0.5f, 0.0f, 1.0f
        };

        glGenVertexArrays(1, &vao);
        glGenBuffers(1, &vbo);

        glBindVertexArray(vao);
        glBindBuffer(GL_ARRAY_BUFFER, vbo);
        glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

        GLint posAttrib = glGetAttribLocation(shaderProgram, "position");
        glEnableVertexAttribArray(posAttrib);
        glVertexAttribPointer(posAttrib, 4, GL_FLOAT, GL_FALSE, 0, 0);

        glBindVertexArray(0);

        isRunning = true;
        printf("[C++ Engine] Initialization complete. Engine is ready.\n");
        return 1;
    }

    EMSCRIPTEN_KEEPALIVE
    void renderFrame(double currentTime) {
        if (!isRunning) return;

        // Calculate delta time
        double deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        // Update rotation
        rotationAngle += static_cast<float>(deltaTime) * 0.001f;

        // Get canvas dimensions
        int width, height;
        emscripten_get_canvas_element_size("#canvas", &width, &height);

        // Render
        glViewport(0, 0, width, height);
        glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        glUseProgram(shaderProgram);

        // Set uniforms
        GLint rotationLoc = glGetUniformLocation(shaderProgram, "rotation");
        glUniform1f(rotationLoc, rotationAngle);

        GLint colorLoc = glGetUniformLocation(shaderProgram, "color");
        glUniform3f(colorLoc, 0.0f, 1.0f, 0.5f); // Cyan/green for Vice City vibe

        glBindVertexArray(vao);
        glDrawArrays(GL_TRIANGLES, 0, 3);
        glBindVertexArray(0);
    }

    EMSCRIPTEN_KEEPALIVE
    void shutdownEngine() {
        printf("[C++ Engine] Shutting down...\n");
        isRunning = false;
        glDeleteVertexArrays(1, &vao);
        glDeleteBuffers(1, &vbo);
        glDeleteProgram(shaderProgram);
        emscripten_webgl_destroy_context(glContext);
        printf("[C++ Engine] Engine shutdown complete.\n");
    }

    EMSCRIPTEN_KEEPALIVE
    const char* getEngineVersion() {
        return "Vice City Web Engine v0.1.0";
    }
}

int main() {
    printf("[C++ Engine] Vice City Web Engine loaded. Call initEngine() to start.\n");
    return 0;
}
