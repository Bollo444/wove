#!/usr/bin/env pwsh
# Wove Development Environment Stop Script
# This script stops all running Wove services

Write-Host "Stopping Wove Development Environment..." -ForegroundColor Red
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Function to kill processes on a specific port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$ServiceName)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        
        if ($processes) {
            foreach ($processId in $processes) {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "Stopping $ServiceName (PID: $processId)..." -ForegroundColor Yellow
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "$ServiceName stopped" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "No $ServiceName process found on port $Port" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Warning: Could not stop $ServiceName on port $Port`: $($_)" -ForegroundColor Yellow
    }
}

# Stop Frontend (port 3003)
Write-Host "Stopping Frontend..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 3003 -ServiceName "Frontend"

# Stop Backend API (port 3004)
Write-Host "Stopping Backend API..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 3004 -ServiceName "Backend API"

# Stop any Node.js processes that might be running Wove services
Write-Host "Stopping any remaining Node.js processes..." -ForegroundColor Cyan
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.MainWindowTitle -like "*wove*" -or 
        $_.ProcessName -eq "node" -and 
        (Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in @(3003, 3004) })
    }
    
    if ($nodeProcesses) {
        $nodeProcesses | ForEach-Object {
            Write-Host "Stopping Node.js process (PID: $($_.Id))..." -ForegroundColor Yellow
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        Write-Host "Node.js processes stopped" -ForegroundColor Green
    } else {
        Write-Host "No Wove-related Node.js processes found" -ForegroundColor Gray
    }
} catch {
    Write-Host "Warning: Could not stop Node.js processes: $($_)" -ForegroundColor Yellow
}

# Stop Database Services
Write-Host "Stopping database services..." -ForegroundColor Cyan
try {
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database services stopped successfully" -ForegroundColor Green
    } else {
        Write-Host "Warning: Some issues occurred while stopping database services" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error stopping database services: $($_)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Stopped Services:" -ForegroundColor White
Write-Host "   • Frontend (port 3003)" -ForegroundColor Gray
Write-Host "   • Backend API (port 3004)" -ForegroundColor Gray
Write-Host "   • PostgreSQL (port 5432)" -ForegroundColor Gray
Write-Host "   • Redis (port 6379)" -ForegroundColor Gray
Write-Host ""
Write-Host "To restart the development environment, run:" -ForegroundColor Yellow
Write-Host "   .\start-dev.ps1" -ForegroundColor White
Write-Host ""

# Keep the script window open
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")