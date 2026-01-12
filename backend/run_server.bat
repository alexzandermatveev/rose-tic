@echo off
cd /d "%~dp0"
echo Starting Rose Tic Tac Toe backend server...
echo Installing dependencies...
pip install -r requirements_simple.txt
echo Starting server on http://localhost:8000
python simple_backend.py
pause