#!/usr/bin/env bash
# =============================================================================
# FinanceBtw -- Local Development Setup Script (Linux / macOS)
# =============================================================================

set -e

cat << "EOF"
  _____ _                              ____  _          
 |  ___(_)_ __   __ _ _ __   ___ ___  | __ )| |_ __      __
 | |_  | | '_ \ / _` | '_ \ / __/ _ \ |  _ \| __\ \ /\ / /
 |  _| | | | | | (_| | | | | (_|  __/ | |_) | |_ \ V  V / 
 |_|   |_|_| |_|\__,_|_| |_|\___\___| |____/ \__| \_/\_/  
EOF

echo "[*] Setting up FinanceBtw development environment..."

# 1. Environment file
if [ ! -f .env ]; then
    echo "[*] Creating .env from .env.example..."
    cp .env.example .env
fi

# 2. Python virtual environment
echo "[*] Setting up Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e ".[dev]"

# 3. Frontend dependencies
echo "[*] Installing frontend dependencies..."
cd frontend
npm install
cd ..

# 4. Pre-commit hooks
echo "[*] Installing pre-commit hooks..."
pre-commit install

echo ""
echo "[OK] Setup complete! You can now run:"
echo "     Backend:  uvicorn backend.main:app --reload --port 8000"
echo "     Frontend: cd frontend && npm run dev"
echo "     Tests:    pytest tests/ -v"
