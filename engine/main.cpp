#include <emscripten.h>
#include <emscripten/fetch.h>
#include <iostream>

void downloadSucceeded(emscripten_fetch_t *fetch) {
    std::cout << "[VFS] Successfully downloaded asset: " << fetch->url << " - Size: " << fetch->numBytes << " bytes.\n";
    emscripten_fetch_close(fetch);
}

void downloadFailed(emscripten_fetch_t *fetch) {
    std::cout << "[VFS ERROR] Failed to download asset: " << fetch->url << " - HTTP Code: " << fetch->status << "\n";
    emscripten_fetch_close(fetch);
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void fetchCloudAsset(const char* url) {
        emscripten_fetch_attr_t attr;
        emscripten_fetch_attr_init(&attr);
        strcpy(attr.requestMethod, "GET");
        attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
        attr.onsuccess = downloadSucceeded;
        attr.onerror = downloadFailed;
        emscripten_fetch(&attr, url);
    }

    EMSCRIPTEN_KEEPALIVE
    int initEngine() {
        std::cout << "[WASM ENGINE] Phase 3 Initialized. Virtual File System Ready for Cloud Assets." << std::endl;
        return 1;
    }
}

int main() {
    initEngine();
    return 0;
}
