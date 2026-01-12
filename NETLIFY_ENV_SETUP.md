# Netlify Environment Variables Setup

## How to configure backend URL in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Add the following environment variable:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: Your backend URL (e.g., `https://your-ngrok-url.ngrok-free.app`)

## For local development:
Create a `.env.local` file in your project root:
```
VITE_BACKEND_URL=http://localhost:8000
```

## Priority order:
1. `VITE_BACKEND_URL` environment variable (Netlify/production)
2. `config.json` file (fallback)
3. `http://localhost:8000` (default)

The frontend will automatically use the Netlify environment variable if available, making it easy to update the backend URL without rebuilding the frontend.