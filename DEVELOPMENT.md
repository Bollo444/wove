# Wove Development Setup

This guide explains how to run the Wove application locally with proper port configurations to avoid conflicts.

## Port Assignments

- **Frontend (Next.js)**: Port 3003
- **Backend (NestJS)**: Port 3004
- **PostgreSQL**: Port 5432
- **Redis**: Port 6379
- **shadcn-ui-mcp-server**: Port 3002

## Quick Start

### Option 1: Automated Startup (Recommended)

Use the automated startup script to start all services with one command:

**PowerShell (Recommended):**
```powershell
.\start-dev.ps1
```

**Batch File:**
```cmd
start-dev.bat
```

The script will automatically:
1. Start PostgreSQL and Redis databases
2. Start the backend API on port 3004
3. Start the frontend on port 3003
4. Wait for each service to be ready
5. Open new terminal windows for backend and frontend

### Option 2: Manual Startup

#### 1. Start Database Services

First, start the PostgreSQL and Redis services using Docker:

```bash
docker-compose up -d postgres redis
```

#### 2. Start Backend API

Navigate to the backend directory and start the API server:

```bash
cd backend/wove-api
npm run start:local
```

The backend will run on **http://localhost:3004**

#### 3. Start Frontend

Navigate to the frontend directory and start the web application:

```bash
cd frontend/wove-web
npm run dev
```

The frontend will run on **http://localhost:3003**

## Environment Configuration

The project uses `.env.local` for local development configuration. This file contains:

- Fixed port assignments
- Database connection settings
- CORS configuration
- API URLs for frontend-backend communication

## Troubleshooting Port Conflicts

If you encounter port conflicts:

1. Check which ports are in use:
   ```bash
   netstat -an | findstr :300
   ```

2. Stop any conflicting services

3. Use the configured scripts:
   - Frontend: `npm run dev` (automatically uses port 3003)
   - Backend: `npm run start:local` (automatically uses port 3004)

## Stopping Services

### Automated Stop

Use the stop script to cleanly shut down all services:

```powershell
.\stop-dev.ps1
```

This will:
- Stop the frontend and backend processes
- Stop the database containers
- Clean up any remaining Node.js processes

### Manual Stop

1. Press `Ctrl+C` in the frontend and backend terminal windows
2. Stop databases: `docker-compose down`

## Development Workflow

### Recommended Workflow
1. Start all services: `.\start-dev.ps1`
2. Access the application at http://localhost:3003
3. Develop and test your changes
4. Stop all services: `.\stop-dev.ps1`

### Manual Workflow
1. Start databases: `docker-compose up -d postgres redis`
2. Start backend: `cd backend/wove-api && npm run start:local`
3. Start frontend: `cd frontend/wove-web && npm run dev`
4. Access the application at http://localhost:3003

## API Endpoints

- Frontend: http://localhost:3003
- Backend API: http://localhost:3004
- Database: localhost:5432
- Redis: localhost:6379

The frontend is configured to communicate with the backend at the correct port (3004) through the environment configuration.