// Dynamic backend URL loading with Vite environment support
let BACKEND_URL = 'http://localhost:8000'; // default fallback

// Check for Vite environment variable
const viteBackendUrl = import.meta.env.VITE_BACKEND_URL;
if (viteBackendUrl) {
  BACKEND_URL = viteBackendUrl;
  console.log('[CONFIG] Using backend URL from VITE_BACKEND_URL:', BACKEND_URL);
}

export { BACKEND_URL };