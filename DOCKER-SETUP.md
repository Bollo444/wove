# Docker Development Environment Setup

This guide will help you set up the complete Wove development environment using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js](https://nodejs.org/) (for local development and building shared package)
- [Git](https://git-scm.com/) for version control

## Quick Start

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```powershell
# Windows PowerShell
.\setup-docker.ps1
```

```bash
# Linux/macOS
./setup-docker.sh
```

### Option 2: Manual Setup

1. **Build the shared package:**
   ```bash
   cd shared
   npm install
   npm run build
   cd ..
   ```

2. **Start the Docker environment:**
   ```bash
   docker-compose up --build
   ```

3. **Wait for services to start** (usually takes 2-3 minutes)

## Services Overview

Once running, you'll have access to:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js web application |
| Backend API | http://localhost:3001 | NestJS REST API |
| PostgreSQL | localhost:5432 | Database server |
| Redis | localhost:6379 | Cache and message queue |

## Environment Configuration

### Development Environment Files

- `.env.docker` - Used by Docker Compose (contains Docker-specific settings)
- `backend/wove-api/.env.development` - Backend local development
- `frontend/wove-web/.env.local` - Frontend local development

### Required API Keys

Before full functionality, update `.env.docker` with your actual API keys:

```bash
# Google OAuth (for age verification)
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# OpenAI (for AI story generation)
OPENAI_API_KEY=your-actual-openai-api-key

# JWT Secret (generate a secure random string)
JWT_SECRET=your-secure-jwt-secret-key
```

### Getting API Keys

1. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3001/auth/google/callback` to authorized redirect URIs

2. **OpenAI:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an account and add billing information
   - Generate an API key in the API keys section

## Common Commands

### Starting Services
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Accessing Containers
```bash
# Backend container
docker-compose exec api bash

# Frontend container
docker-compose exec web bash

# Database container
docker-compose exec postgres psql -U postgres -d wove

# Redis container
docker-compose exec redis redis-cli
```

## Troubleshooting

### Port Conflicts
If you get port conflict errors:
```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Kill processes using the ports (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up --build

# Check database connection
docker-compose exec postgres pg_isready -U postgres

# Access database directly
docker-compose exec postgres psql -U postgres -d wove
```

### Shared Package Issues
```bash
# Rebuild shared package
cd shared
npm run build
cd ..
docker-compose restart api web
```

### Container Build Issues
```bash
# Clean rebuild
docker-compose down
docker system prune -f
docker-compose up --build
```

## Development Workflow

1. **Code Changes:**
   - Frontend and backend code changes are automatically reloaded
   - Shared package changes require rebuilding: `cd shared && npm run build`

2. **Database Changes:**
   - TypeORM will automatically sync schema changes in development
   - For production, use migrations

3. **Adding Dependencies:**
   ```bash
   # Backend
   docker-compose exec api npm install <package>
   
   # Frontend
   docker-compose exec web npm install <package>
   ```

## Production Considerations

- Change all default passwords and secrets
- Use proper SSL certificates
- Set up proper logging and monitoring
- Use production-grade database configurations
- Implement proper backup strategies

## Next Steps

Once your Docker environment is running:

1. **Test the API:** Visit http://localhost:3001/api
2. **Test the Frontend:** Visit http://localhost:3000
3. **Set up API keys** for full functionality
4. **Start developing** your features!

For more detailed development information, see the main [README.md](./README.md).