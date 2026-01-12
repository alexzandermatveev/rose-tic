#!/usr/bin/env python3
"""
Unified launcher for Tic-Tac-Toe backend services on PythonAnywhere
Runs both FastAPI backend and Telegram bot in background processes
"""

import os
import sys
import subprocess
import signal
import time
from pathlib import Path

# Configuration
PROJECT_DIR = Path(__file__).parent.absolute()
BACKEND_SCRIPT = PROJECT_DIR / "simple_backend.py"
BOT_SCRIPT = PROJECT_DIR / "telegram_bot.py"
PID_FILE = PROJECT_DIR / "services.pid"

def start_services():
    """Start both backend and bot services"""
    print("🚀 Starting Tic-Tac-Toe services...")
    
    # Start backend with port checking
    print("Starting backend server...")
    backend_env = os.environ.copy()
    backend_env["PORT"] = "8001"  # Use different port
    
    backend_process = subprocess.Popen([
        sys.executable, str(BACKEND_SCRIPT)
    ], env=backend_env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Wait for backend to start
    time.sleep(3)
    
    # Check if backend started successfully
    backend_check = subprocess.run([
        "curl", "-s", "http://localhost:8001/", "--max-time", "5"
    ], capture_output=True)
    
    if backend_check.returncode != 0:
        print("⚠️ Backend failed to start. Checking error output...")
        stdout, stderr = backend_process.communicate(timeout=1)
        if stderr:
            print(f"Backend error: {stderr.decode()}")
        return False
    
    print("✅ Backend started successfully")
    
    # Start bot
    print("Starting Telegram bot...")
    bot_process = subprocess.Popen([
        sys.executable, str(BOT_SCRIPT)
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Save process IDs
    with open(PID_FILE, 'w') as f:
        f.write(f"{backend_process.pid},{bot_process.pid}")
    
    print(f"✅ Services started!")
    print(f"Backend PID: {backend_process.pid}")
    print(f"Bot PID: {bot_process.pid}")
    print(f"PIDs saved to: {PID_FILE}")

def stop_services():
    """Stop all running services"""
    print("🛑 Stopping services...")
    
    if PID_FILE.exists():
        try:
            with open(PID_FILE, 'r') as f:
                pids = f.read().strip().split(',')
                backend_pid, bot_pid = int(pids[0]), int(pids[1])
            
            # Kill processes
            os.kill(backend_pid, signal.SIGTERM)
            os.kill(bot_pid, signal.SIGTERM)
            
            print(f"✅ Killed processes: {backend_pid}, {bot_pid}")
            PID_FILE.unlink()
            
        except Exception as e:
            print(f"⚠️ Error stopping processes: {e}")
            # Try to kill any remaining python processes
            subprocess.run(["pkill", "-f", "simple_backend.py"])
            subprocess.run(["pkill", "-f", "telegram_bot.py"])
    else:
        print("No PID file found. Trying to kill processes by name...")
        subprocess.run(["pkill", "-f", "simple_backend.py"])
        subprocess.run(["pkill", "-f", "telegram_bot.py"])

def status():
    """Check status of services"""
    if PID_FILE.exists():
        try:
            with open(PID_FILE, 'r') as f:
                pids = f.read().strip().split(',')
                backend_pid, bot_pid = int(pids[0]), int(pids[1])
            
            # Check if processes are still running
            backend_running = subprocess.run(["ps", "-p", str(backend_pid)], 
                                           capture_output=True).returncode == 0
            bot_running = subprocess.run(["ps", "-p", str(bot_pid)], 
                                       capture_output=True).returncode == 0
            
            # Check if backend is actually responding
            if backend_running:
                backend_responding = subprocess.run([
                    "curl", "-s", "http://localhost:8001/", "--max-time", "3"
                ], capture_output=True).returncode == 0
                backend_status = "🟢 Running" if backend_responding else "🟡 Not responding"
            else:
                backend_status = "🔴 Stopped"
            
            print(f"📊 Service Status:")
            print(f"Backend (PID {backend_pid}): {backend_status}")
            print(f"Bot (PID {bot_pid}): {'🟢 Running' if bot_running else '🔴 Stopped'}")
            
        except Exception as e:
            print(f"Error checking status: {e}")
    else:
        print("🔴 No services running (no PID file)")

def restart_services():
    """Restart all services"""
    print("🔄 Restarting services...")
    stop_services()
    time.sleep(2)
    start_services()

def main():
    if len(sys.argv) < 2:
        print("Usage: python launcher.py [start|stop|status|restart]")
        print("  start   - Start backend and bot services")
        print("  stop    - Stop all services")
        print("  status  - Check service status")
        print("  restart - Restart all services")
        return
    
    command = sys.argv[1].lower()
    
    if command == "start":
        start_services()
    elif command == "stop":
        stop_services()
    elif command == "status":
        status()
    elif command == "restart":
        restart_services()
    else:
        print(f"Unknown command: {command}")
        print("Available commands: start, stop, status, restart")

if __name__ == "__main__":
    main()