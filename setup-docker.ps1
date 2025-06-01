#!/usr/bin/env pwsh
# Docker Environment Setup Script for Wove Project
# This script sets up the complete Docker development environment

Write-Host "Setting up Wove Docker Development Environment" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
try {
    docker-compose version | Out-Null
    Write-Host "[OK] Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Clean up any existing volumes (optional - uncomment if needed)
# Write-Host "Cleaning up volumes..." -ForegroundColor Yellow
# docker-compose down -v

# Build the shared package
Write-Host "Building shared package..." -ForegroundColor Yellow
Set-Location "shared"
npm install
npm run build
Set-Location ".."
Write-Host "[OK] Shared package built successfully" -ForegroundColor Green

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "backend/wove-api"
npm install
Set-Location "../.."
Write-Host "[OK] Backend dependencies installed" -ForegroundColor Green

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "frontend/wove-web"
npm install
Set-Location "../.."
Write-Host "[OK] Frontend dependencies installed" -ForegroundColor Green

# Build and start all services
Write-Host "Building and starting Docker services..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait for services to be ready
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "Checking service status..." -ForegroundColor Yellow
docker-compose ps

# Test database connection
Write-Host "Testing database connection..." -ForegroundColor Yellow
$dbTest = docker-compose exec -T postgres pg_isready -U postgres
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] PostgreSQL is ready" -ForegroundColor Green
} else {
    Write-Host "[WARNING] PostgreSQL might not be ready yet" -ForegroundColor Yellow
}

# Test Redis connection
Write-Host "Testing Redis connection..." -ForegroundColor Yellow
$redisTest = docker-compose exec -T redis redis-cli ping
if ($redisTest -eq "PONG") {
    Write-Host "[OK] Redis is ready" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Redis might not be ready yet" -ForegroundColor Yellow
}

Write-Host "" 
Write-Host "Docker environment setup complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "Redis: localhost:6379" -ForegroundColor Cyan
Write-Host "" 
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env.docker with your actual API keys" -ForegroundColor White
Write-Host "2. Visit http://localhost:3000 to see the frontend" -ForegroundColor White
Write-Host "3. Visit http://localhost:3001/api to see the backend API" -ForegroundColor White
Write-Host "" 
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "- View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "- Stop services: docker-compose down" -ForegroundColor White
Write-Host "- Restart services: docker-compose restart" -ForegroundColor White
Write-Host "- Rebuild services: docker-compose up --build" -ForegroundColor White