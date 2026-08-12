# =============================================================================
# FinanceBtw -- Local Development Setup Script (Windows PowerShell)
# =============================================================================

Write-Host @"
  _____ _                              ____  _          
 |  ___(_)_ __   __ _ _ __   ___ ___  | __ )| |_ __      __
 | |_  | | '_ \ / _` | '_ \ / __/ _ \ |  _ \| __\ \ /\ / /
 |  _| | | | | | (_| | | | | (_|  __/ | |_) | |_ \ V  V / 
 |_|   |_|_| |_|\__,_|_| |_|\___\___| |____/ \__| \_/\_/  
"@ -ForegroundColor Cyan

Write-Host "[*] Setting up FinanceBtw development environment..." -ForegroundColor Cyan

# 1. Environment file
if (-not (Test-Path .env)) {
    Write-Host "[*] Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

# 2. Python environment
Write-Host "[*] Installing Python backend dependencies..." -ForegroundColor Cyan
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"

# 3. Frontend
Write-Host "[*] Installing React frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

# 4. Pre-commit hooks
Write-Host "[*] Installing pre-commit hooks..." -ForegroundColor Cyan
python -m pre_commit install

Write-Host "`n[OK] Setup complete! Run commands:" -ForegroundColor Green
Write-Host "     Backend:  uvicorn backend.main:app --reload --port 8000"
Write-Host "     Frontend: cd frontend; npm run dev"
Write-Host "     Tests:    python -m pytest tests/ -v"
