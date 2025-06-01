# Wove - Interactive Storytelling Platform

Wove is an innovative interactive storytelling platform that combines collaborative writing with AI assistance to create engaging, age-appropriate stories. The platform supports multimedia generation, real-time collaboration, and digital book creation.

## 🚀 Implementation Status

### Backend Components (NestJS/TypeScript)
| Component | Completion | Status |
|-----------|------------|--------|
| **Authentication & Age Verification** | 85% | ✅ Core auth, JWT, Google OAuth implemented. Age verification service ready. |
| **User Management & Parental Controls** | 90% | ✅ Full user CRUD, parental linking, monitoring controls implemented. |
| **Database Schema & Models** | 95% | ✅ Complete TypeORM entities for all major features. Advanced relationships implemented. |
| **Story Management** | 80% | ✅ Core story CRUD, collaboration, segments. Branching logic partially implemented. |
| **AI Integration** | 60% | ⚠️ Mock AI provider ready. Real AI provider integration pending. Text/image/audio interfaces defined. |
| **Real-time Collaboration** | 75% | ✅ WebSocket gateway, notification system. Advanced session management pending. |
| **Multimedia Processing** | 45% | ⚠️ Storage service ready. AI multimedia generation needs real provider integration. |
| **Content Moderation** | 70% | ✅ Basic moderation controller and service. Advanced AI content filtering pending. |
| **Digital Book Generation** | 55% | ⚠️ Service structure ready. Book compilation and export logic needs completion. |
| **API Endpoints** | 85% | ✅ Most REST endpoints implemented. Some advanced features pending. |

### Frontend Components (Next.js/React/TypeScript)
| Component | Completion | Status |
|-----------|------------|--------|
| **Authentication UI** | 80% | ✅ Login, register, age verification forms implemented. OAuth integration pending. |
| **User Interface & Navigation** | 75% | ✅ Core layout, sidebar, responsive design. Advanced accessibility features pending. |
| **Story Creation & Management** | 70% | ✅ Story cards, segment display, basic creation flow. Advanced editing features pending. |
| **Real-time Collaboration UI** | 65% | ✅ Chat interface, collaborators panel. Real-time indicators and advanced session UI pending. |
| **Multimedia Display** | 80% | ✅ Image, video, audio display components. Dynamic visual effects pending. |
| **Digital Book Viewer** | 50% | ⚠️ Basic viewer structure. Interactive features and page turning effects pending. |
| **Parental Controls Dashboard** | 60% | ⚠️ Basic components ready. Full monitoring interface pending. |
| **Content Moderation Interface** | 40% | ⚠️ Basic structure. Admin tools and reporting interface pending. |
| **Responsive Design** | 70% | ✅ Mobile-friendly layouts. Advanced responsive features pending. |
| **Accessibility Features** | 45% | ⚠️ Basic semantic HTML. Screen reader support and advanced a11y pending. |

### Infrastructure & DevOps
| Component | Completion | Status |
|-----------|------------|--------|
| **Docker Configuration** | 85% | ✅ Docker setup for development. Production optimization pending. |
| **Database Setup** | 90% | ✅ PostgreSQL schema, migrations, indexes implemented. |
| **Testing Framework** | 30% | ⚠️ Jest setup ready. Comprehensive test suites pending. |
| **CI/CD Pipeline** | 25% | ⚠️ GitHub Actions structure. Full automation pending. |
| **Deployment Configuration** | 20% | ⚠️ Basic setup. Production deployment strategy pending. |
| **Monitoring & Logging** | 40% | ⚠️ Basic logging implemented. Advanced monitoring pending. |

### Overall Project Completion: **68%**

## Features

- **Age-Appropriate Content**: Stories tailored for different age groups (kids, teens, adults)
- **AI-Assisted Writing**: Intelligent story continuation and multimedia generation
- **Real-time Collaboration**: Multiple users can contribute to stories simultaneously
- **Multimedia Integration**: Auto-generated images, videos, and audio to enhance storytelling
- **Digital Book Creation**: Convert completed stories into interactive digital books
- **Parental Controls**: Comprehensive monitoring and control features for younger users
- **Content Moderation**: Automated and manual content filtering for safety

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Cache/Sessions**: Redis
- **Real-time**: WebSockets (Socket.IO)
- **Authentication**: JWT with Passport.js
- **File Storage**: Cloud storage integration

### Frontend
- **Framework**: Next.js (React/TypeScript)
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Real-time**: Socket.IO Client
- **UI Components**: Custom components with accessibility focus

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (planned)
- **CI/CD**: GitHub Actions
- **Monitoring**: Logging and performance monitoring

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** 14+
- **Redis** 6+
- **Docker** & Docker Compose (recommended for development)
- **Git**

### Quick Start with Docker (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/wove.git
cd wove
```

2. **Start with Docker Compose:**
```bash
# Copy environment files
cp backend/wove-api/.env.example backend/wove-api/.env
cp frontend/wove-web/.env.example frontend/wove-web/.env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

### Manual Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/your-username/wove.git
cd wove
npm install
```

2. **Setup PostgreSQL database:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE wove_dev;"

# Run migrations
cd backend/wove-api
npm run migration:run
```

3. **Setup Redis:**
```bash
# Start Redis server
redis-server
```

4. **Configure environment variables:**
```bash
# Backend configuration
cp backend/wove-api/.env.example backend/wove-api/.env
# Edit backend/wove-api/.env with your database and Redis credentials

# Frontend configuration
cp frontend/wove-web/.env.example frontend/wove-web/.env
# Edit frontend/wove-web/.env with your API endpoints
```

5. **Start development servers:**
```bash
# Terminal 1 - Backend
cd backend/wove-api
npm run start:dev

# Terminal 2 - Frontend
cd frontend/wove-web
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/wove_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# AI Services (when ready)
OPENAI_API_KEY=your-openai-api-key
STABILITY_AI_API_KEY=your-stability-ai-key

# Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name

# Application
PORT=3001
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### Development Commands

```bash
# Install all dependencies
npm install

# Start development (both frontend and backend)
npm run dev

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Run tests
npm run test

# Build for production
npm run build

# Database migrations
npm run migration:generate
npm run migration:run

# Seed database with sample data
npm run seed
```

## Project Structure

```
wove/
├── backend/wove-api/          # NestJS backend application
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, stories, ai, etc.)
│   │   ├── database/          # Entities, migrations, seeds
│   │   ├── core/              # Guards, interceptors, decorators
│   │   └── shared/            # Shared utilities and types
│   ├── test/                  # Test files
│   └── docs/                  # API documentation
├── frontend/wove-web/         # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js 13+ app router
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom React hooks
│   │   └── styles/            # CSS and theme files
│   └── public/                # Static assets
├── shared/                    # Shared types and utilities
├── KILO.DOCS/                 # Technical specifications
├── docker-compose.yml         # Docker development setup
└── TODO.MD                    # Implementation progress tracking
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
cd backend/wove-api && npm run test

# Run frontend tests
cd frontend/wove-web && npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:3001/api/docs for interactive Swagger documentation.

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.