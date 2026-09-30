import subprocess
import sys
import os
import time

def run_app():
    # 1. Start FastAPI Backend using uvicorn programmatically
    print("🚀 Starting StackFix Backend...")
    backend_process = subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--reload"])

    # 2. Start Vite Frontend
    print("✨ Starting StackFix Frontend...")
    frontend_dir = os.path.join(os.getcwd(), "stackfix-frontend")
    
    # Use npm on Windows/Mac/Linux
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_process = subprocess.Popen([npm_cmd, "run", "dev"], cwd=frontend_dir)

    try:
        # Keep the master script alive
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down StackFix...")
        backend_process.terminate()
        frontend_process.terminate()

if __name__ == "__main__":
    run_app()