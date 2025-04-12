#!/bin/bash

# -----------------------------------------------------------------------------
# Script to start FastAPI backend and Vite frontend for UMBC Inventory App
# - Runs both servers in the same VS Code terminal
# - Backend starts first (in background), frontend second (in foreground)
# -----------------------------------------------------------------------------

# --- CONFIGURABLE PORTS ---
BACKEND_PORT=8000
FRONTEND_PORT=5173

# --- KILL OLD PROCESSES USING THESE PORTS (if any) ---
echo "Checking for existing backend on port $BACKEND_PORT..."
lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null

echo "Checking for existing frontend on port $FRONTEND_PORT..."
lsof -ti:$FRONTEND_PORT | xargs kill -9 2>/dev/null

# --- START BACKEND FIRST ---
echo "Starting FastAPI backend on http://localhost:$BACKEND_PORT ..."
cd backend
source venv/bin/activate
python3 main.py &              # Run backend in background
backend_pid=$!                 # Save backend process ID
cd ..                          # Return to project root

# Give backend a moment to spin up before starting frontend
sleep 1

# --- START FRONTEND NEXT ---
echo "Starting Vite frontend on http://localhost:$FRONTEND_PORT ..."
cd frontend
npm run dev                    # Run frontend in foreground

# --- SHUTDOWN BACKEND WHEN FRONTEND EXITS ---
echo "Frontend exited. Shutting down backend server (PID: $backend_pid)..."
kill $backend_pid
echo "Dev environment stopped."

# -----------------------------------------------------------------------------
# HOW TO USE THIS SCRIPT:
# 1. Place this script in your project root (same level as backend/ and frontend/ folders)
# 2. Make it executable (once): chmod +x start.sh
# 3. Run it: ./start.sh
# 4. To completely exit: press Ctrl+C twice 
# -----------------------------------------------------------------------------