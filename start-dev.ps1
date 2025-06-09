# Wove Development Environment Startup Script
# This script automates the startup of all required services for the Wove development environment

Write-Host "Starting Wove Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to wait for a service to be ready
function Wait-ForService {
    param(
        [string]$ServiceName,
        [int]$Port,
        [int]$TimeoutSeconds = 30
    )
    
    Write-Host "Waiting for $ServiceName to be ready on port $Port..." -ForegroundColor Yellow
    $elapsed = 0
    
    while ($elapsed -lt $TimeoutSeconds) {
        if (Test-Port -Port $Port) {
            Write-Host "$ServiceName is ready!" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 2
        $elapsed += 2
        Write-Host "." -NoNewline -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Warning: $ServiceName may not be ready yet (timeout after $TimeoutSeconds seconds)" -ForegroundColor Red
    return $false
}

# Check for port conflicts
Write-Host "Checking for port conflicts..." -ForegroundColor Cyan

if (Test-Port -Port 3003) {
    Write-Host "Warning: Port 3003 is already in use. Frontend may not start properly." -ForegroundColor Red
}

if (Test-Port -Port 3004) {
    Write-Host "Warning: Port 3004 is already in use. Backend API may not start properly." -ForegroundColor Red
}

if (Test-Port -Port 5432) {
    Write-Host "Info: Port 5432 is in use (PostgreSQL may already be running)" -ForegroundColor Yellow
}

if (Test-Port -Port 6379) {
    Write-Host "Info: Port 6379 is in use (Redis may already be running)" -ForegroundColor Yellow
}

Write-Host ""

# Step 1: Start database services
Write-Host "Step 1: Starting database services..." -ForegroundColor Cyan
try {
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database services started successfully!" -ForegroundColor Green
        
        # Wait for databases to be ready
        Wait-ForService -ServiceName "PostgreSQL" -Port 5432 -TimeoutSeconds 30
        Wait-ForService -ServiceName "Redis" -Port 6379 -TimeoutSeconds 30
    } else {
        Write-Host "Failed to start database services. Please check Docker and docker-compose.yml" -ForegroundColor Red
        Write-Host "Press any key to exit..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}
catch {
    Write-Host "Error starting database services: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""

# Step 2: Start Backend API
Write-Host "Step 2: Starting Backend API..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend\wove-api'; npm run start:local"
    Write-Host "Backend API starting on port 3004..." -ForegroundColor Green
    
    # Wait for backend to be ready
    Wait-ForService -ServiceName "Backend API" -Port 3004 -TimeoutSeconds 45
}
catch {
    Write-Host "Error starting Backend API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 3: Start Frontend
Write-Host "Step 3: Starting Frontend..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend\wove-web'; npm run dev"
    Write-Host "Frontend starting on port 3003..." -ForegroundColor Green
    
    # Wait for frontend to be ready
    Wait-ForService -ServiceName "Frontend" -Port 3003 -TimeoutSeconds 45
}
catch {
    Write-Host "Error starting Frontend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Wove Development Environment Started!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor White
Write-Host "   • Frontend: http://localhost:3003" -ForegroundColor White
Write-Host "   • Backend API: http://localhost:3004" -ForegroundColor White
Write-Host "   • PostgreSQL: localhost:5432" -ForegroundColor White
Write-Host "   • Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "Quick Access:" -ForegroundColor White
Write-Host "   • Access the application at http://localhost:3003" -ForegroundColor White
Write-Host "   • API documentation available at http://localhost:3004/api" -ForegroundColor White
Write-Host "   • Use Ctrl+C in the terminal windows to stop individual services" -ForegroundColor White
Write-Host "   • Run 'docker-compose down' to stop database services" -ForegroundColor White
Write-Host ""

# Keep the script window open
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")