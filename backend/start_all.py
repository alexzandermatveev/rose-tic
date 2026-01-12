import asyncio
import subprocess
import os
from telegram_bot import main as start_bot

async def start_backend():
    """Start FastAPI backend"""
    import uvicorn
    from simple_backend import app
    
    print("🚀 Starting FastAPI backend...")
    uvicorn.run(
        "simple_backend:app",
        host="0.0.0.0",
        port=int(os.getenv("BACKEND_PORT", 8000)),
        reload=True
    )

async def main():
    """Start both backend and bot"""
    print("🎯 Starting Rose Tic Tac Toe services...")
    
    # Start backend in background
    backend_process = subprocess.Popen([
        "python", "-c", 
        "import uvicorn; from simple_backend import app; uvicorn.run('simple_backend:app', host='0.0.0.0', port=8000, reload=True)"
    ])
    
    try:
        # Start bot
        print("🤖 Starting Telegram bot...")
        start_bot()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down services...")
        backend_process.terminate()
        backend_process.wait()

if __name__ == "__main__":
    asyncio.run(main())