// Extend window interface for Netlify env
interface Window {
  env?: {
    REACT_APP_BACKEND_URL?: string;
  };
}

// Load backend URL from Netlify environment variables or fallback to config
const getBackendUrl = () => {
  // Check Netlify environment variable first
  if (typeof process !== 'undefined' && process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // Check window.env (injected by Netlify)
  if (typeof window !== 'undefined' && window.env && window.env.REACT_APP_BACKEND_URL) {
    return window.env.REACT_APP_BACKEND_URL;
  }
  
  // Fallback to config.json
  return null;
};

// Dynamic backend URL loading
let BACKEND_URL = 'http://localhost:8000'; // default fallback

// Try to load from environment
const backendUrlFromEnv = getBackendUrl();
if (backendUrlFromEnv) {
  BACKEND_URL = backendUrlFromEnv;
  console.log('[CONFIG] Using backend URL from environment:', BACKEND_URL);
} else {
  // Load from config.json as fallback
  const loadConfig = async () => {
    try {
      const response = await fetch('/config.json');
      if (response.ok) {
        const config = await response.json();
        BACKEND_URL = config.BACKEND_URL || BACKEND_URL;
        console.log('[CONFIG] Using backend URL from config.json:', BACKEND_URL);
      }
    } catch (error) {
      console.warn('[CONFIG] Could not load config, using default backend URL:', error);
    }
  };
  
  // Load config on component mount
  loadConfig();
}

export { BACKEND_URL };