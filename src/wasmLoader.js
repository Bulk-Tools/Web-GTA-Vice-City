export const loadWasmEngine = () => {
  return new Promise((resolve, reject) => {
    if (window.Module) return resolve(window.Module);
    const script = document.createElement('script');
    script.src = '/vicecity.js';
    script.onload = () => {
      console.log("Wasm Engine script loaded.");
      resolve(window.Module);
    };
    script.onerror = () => {
      console.error("Network error fetching Wasm engine. Retrying in 3 seconds...");
      setTimeout(() => loadWasmEngine().then(resolve).catch(reject), 3000);
    };
    document.body.appendChild(script);
  });
};
