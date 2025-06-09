# Wove Startup Scripts

This directory contains automated scripts to start and stop the Wove development environment with a single command.

## Available Scripts

### 🚀 Start Scripts

#### `start-dev.ps1` (Recommended)
**PowerShell script with advanced features:**
- ✅ Port conflict detection
- ✅ Service health checks
- ✅ Automatic waiting for services to be ready
- ✅ Colored output and progress indicators
- ✅ Error handling and timeout management

**Usage:**
```powershell
.\start-dev.ps1
```

#### `start-dev.bat`
**Simple batch file for basic usage:**
- ✅ Sequential service startup
- ✅ Basic error checking
- ✅ Compatible with older Windows systems

**Usage:**
```cmd
start-dev.bat
```

### 🛑 Stop Scripts

#### `stop-dev.ps1`
**PowerShell script to cleanly shut down all services:**
- ✅ Stops frontend and backend processes
- ✅ Stops database containers
- ✅ Cleans up remaining Node.js processes
- ✅ Port-based process detection

**Usage:**
```powershell
.\stop-dev.ps1
```

## What the Scripts Do

### Startup Sequence
1. **Database Services** - Starts PostgreSQL and Redis containers
2. **Backend API** - Starts NestJS server on port 3004
3. **Frontend** - Starts Next.js development server on port 3003
4. **Health Checks** - Waits for each service to be ready

### Port Assignments
- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:3004
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed
- PowerShell 5.0+ (for .ps1 scripts)
- All dependencies installed (`npm install` in backend and frontend directories)

## Troubleshooting

### Script Execution Policy (PowerShell)
If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Conflicts
The PowerShell script automatically detects port conflicts and provides warnings. If services are already running, it will notify you instead of trying to start duplicates.

### Service Startup Issues
- **Database connection errors**: Wait a few more seconds for databases to fully initialize
- **Port already in use**: Use the stop script first, then restart
- **npm errors**: Ensure all dependencies are installed in both frontend and backend directories

## Manual Alternative

If you prefer manual control, see [DEVELOPMENT.md](./DEVELOPMENT.md) for step-by-step instructions.

## Quick Reference

```powershell
# Start everything
.\start-dev.ps1

# Stop everything
.\stop-dev.ps1

# Check what's running on ports 3000-3010
netstat -an | findstr :300
```