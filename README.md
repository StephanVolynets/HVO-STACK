<div align="center">
  
<h1 style="font-size: 50px">Human Voice Over STACK</h1> 

*Transforming Ideas Into Possibilities*

<img src="https://img.shields.io/badge/last%20commit-today-brightgreen" style="margin:8px;" />
<img src="https://img.shields.io/badge/typescript-98.4%25-blue" style="margin:8px;" />
<img src="https://img.shields.io/badge/languages-8-blueviolet" style="margin:8px;" />

---

_Built with the tools and technologies:_

<p align="center">
  <img src="https://img.shields.io/badge/Express-000.svg?logo=express&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/JSON-000.svg?logo=json&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Markdown-333.svg?logo=markdown&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/SWR-333.svg?logo=swr&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/npm-CB3837.svg?logo=npm&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Redis-DC382D.svg?logo=redis&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28.svg?logo=firebase&logoColor=black" style="margin:8px;" />
  <img src="https://img.shields.io/badge/.ENV-ECD53F.svg?logo=dotenv&logoColor=black" style="margin:8px;" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?logo=javascript&logoColor=black" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B.svg?logo=nodemon&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/GNU%20Bash-4EAA25.svg?logo=gnubash&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Passport-34E27A.svg?logo=passport&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/i18next-26A69A.svg?logo=i18next&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/React-61DAFB.svg?logo=react&logoColor=black" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Yarn-2C8EBB.svg?logo=yarn&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Docker-2496ED.svg?logo=docker&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?logo=typescript&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/tsnode-3178C6.svg?logo=ts-node&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Lodash-3492FF.svg?logo=lodash&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Prisma-2D3748.svg?logo=prisma&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Zod-3F3D56.svg?logo=zod&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3.svg?logo=eslint&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Swiper-6332F6.svg?logo=swiper&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Axios-5A29E4.svg?logo=axios&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Terraform-7B42BC.svg?logo=terraform&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/dateFns-EC5990.svg?logo=date-fns&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?logo=reacthookform&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384.svg?logo=chartdotjs&logoColor=white" style="margin:8px;" />
  <img src="https://img.shields.io/badge/YAML-FFA000.svg?logo=yaml&logoColor=white" style="margin:8px;" />
</p>
<br>

<h1>ABOUT</h2>


> **HVO STACK** powers scalable, automated pipelines for multilingual video localization. This system handles high volume video processing, seamless API integrations, and dynamic automations, helping Human Voice Over (HVO) deliver world class localized video content at scale.
---
# HVO-STACK Documentation 
</div>


## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Backend (NestJS API)](#backend-nestjs-api)
7. [Frontend (Next.js/Blitz)](#frontend-nextjsblitz)
8. [Shared Library](#shared-library)
9. [Database Schema](#database-schema)
10. [Authentication](#authentication)
11. [API Endpoints](#api-endpoints)
12. [Environment Variables](#environment-variables)
13. [Development Workflow](#development-workflow)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Troubleshooting](#troubleshooting)

---

## Project Overview

HVO-STACK (Human Voice Over Stack) is a comprehensive video localization platform that enables content creators to translate and dub their videos into multiple languages. The platform manages the entire localization workflow from transcription to final audio engineering.

### Key Features
- Automated video ingestion from YouTube, Google Drive, and direct uploads
- Multi-stage localization workflow (Transcription → Translation → Voice-over → Audio Engineering)
- Role-based access control for different user types
- Integration with external services (Box.com, Sonix, Firebase)
- Real-time task tracking and notification system

---

## Architecture

The project follows a microservices architecture with clear separation of concerns:

```
HVO-STACK/
├── hvo-web-main/              # Frontend Next.js application
├── hvo-api-main/              # Backend NestJS API
├── hvo-shared-main/           # Shared TypeScript types and utilities
├── ms-video-compression-main/ # Video processing microservice
├── ms-external-video-processor-main/ # External video handler
└── media-services-infrastructure-main/ # Infrastructure as Code
```

### System Architecture Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js App    │────▶│  NestJS API     │────▶│  PostgreSQL     │
│  (Port 3000)    │     │  (Port 8080)    │     │  (Port 5432)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                        
        │                        ▼                        
        │               ┌─────────────────┐              
        │               │                 │              
        └──────────────▶│  Firebase Auth  │              
                        │                 │              
                        └─────────────────┘              
                                 │                        
                        ┌────────┴────────┐              
                        ▼                 ▼              
                ┌─────────────┐   ┌─────────────┐       
                │  Box API    │   │  Sonix API  │       
                └─────────────┘   └─────────────┘       
```

---

## Technology Stack

### Frontend (hvo-web-main)
- **Framework**: Next.js 14.2.2 with Blitz.js
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Emotion CSS-in-JS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Internationalization**: i18next
- **Charts**: Chart.js
- **Build Tool**: Webpack (via Next.js)

### Backend (hvo-api-main)
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.13
- **Authentication**: Firebase Admin SDK + Passport
- **Queue System**: Bull/BullMQ + Redis
- **File Storage**: Box API + Google Cloud Storage
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer
- **Notifications**: Discord.js

### Shared Dependencies
- **TypeScript**: Type safety across the stack
- **Zod**: Schema validation
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

## Project Structure

### Backend Structure (hvo-api-main)
```
hvo-api-main/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Database seeding
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── video/           # Video management
│   │   ├── task/            # Task management
│   │   ├── user/            # User management
│   │   ├── creator/         # Creator management
│   │   ├── staff/           # Staff management
│   │   ├── storage/         # File storage
│   │   └── notifications/   # Notification system
│   ├── common/              # Shared utilities
│   ├── config/              # Configuration
│   └── main.ts             # Application entry point
├── docker-compose.yml       # PostgreSQL setup
└── package.json            # Dependencies
```

### Frontend Structure (hvo-web-main)
```
hvo-web-main/
├── src/
│   ├── pages/              # Next.js pages (routes)
│   ├── features/           # Feature-based modules
│   ├── core/               # Core utilities
│   │   ├── components/     # Shared components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/           # Libraries and utilities
│   ├── services/          # API services
│   └── styles/            # Global styles
├── public/                # Static assets
├── next.config.js         # Next.js configuration
└── package.json          # Dependencies
```

---

## Getting Started

### Prerequisites

1. **System Requirements**
   - Node.js v18 or higher
   - Yarn package manager
   - PostgreSQL 16
   - Redis (for queue management)
   - Docker (optional, but recommended)

2. **Required Accounts/Access**
   - Firebase project with Authentication enabled
   - Box.com developer account
   - Discord bot token (for notifications)
   - Sonix API key (for transcription)
   - Gmail account (for email notifications)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HVO-STACK
   ```

2. **Install dependencies for all projects**
   ```bash
   # Backend
   cd hvo-api-main
   yarn install

   # Frontend
   cd ../hvo-web-main
   yarn install

   # Shared library
   cd ../hvo-shared-main
   yarn install
   ```

3. **Set up PostgreSQL database**
   
   Using Docker (recommended):
   ```bash
   cd hvo-api-main
   docker-compose up -d
   ```
   
   Or install PostgreSQL locally and create database:
   ```sql
   CREATE DATABASE hvo_db;
   ```

4. **Configure environment variables**
   
   Backend:
   ```bash
   cd hvo-api-main
   cp .env.development .env
   # Edit .env with your credentials
   ```
   
   Frontend:
   ```bash
   cd hvo-web-main
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

5. **Run database migrations**
   ```bash
   cd hvo-api-main
   yarn prisma:dev
   ```

6. **Seed the database (optional)**
   ```bash
   yarn prisma:seed
   ```

7. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd hvo-api-main
   yarn dev
   # Runs on http://localhost:8080
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd hvo-web-main
   yarn dev
   # Runs on http://localhost:3000
   ```

---

## Backend (NestJS API)

### Key Modules

1. **Auth Module** (`src/modules/auth/`)
   - Firebase authentication integration
   - JWT token validation
   - Role-based access control (RBAC)
   - Custom guards and decorators

2. **Video Module** (`src/modules/video/`)
   - Video CRUD operations
   - Video submission workflow
   - Integration with external video sources
   - Video status tracking

3. **Task Module** (`src/modules/task/`)
   - Task creation and assignment
   - Task status management
   - Staff allocation
   - Work submission handling

4. **Storage Module** (`src/modules/storage/`)
   - Box.com API integration
   - File upload/download
   - Google Cloud Storage integration
   - File metadata management

5. **Notifications Module** (`src/modules/notifications/`)
   - Email notifications (Nodemailer)
   - Discord notifications
   - Event-driven notifications

### Database Models (Prisma)

Key entities defined in `prisma/schema.prisma`:

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  firebase_uid  String   @unique
  role          Role
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
}

model Video {
  id              String   @id @default(cuid())
  title           String
  youtube_url     String?
  status          VideoStatus
  creator_id      String
  audio_dubs      AudioDub[]
  tasks           Task[]
  created_at      DateTime @default(now())
}

model Task {
  id              String   @id @default(cuid())
  type            TaskType
  status          TaskStatus
  video_id        String
  language_id     String
  assigned_to     String?
  created_at      DateTime @default(now())
}
```

### API Security

- **Authentication**: Firebase ID token validation
- **Authorization**: Role-based guards (`@Roles()` decorator)
- **Validation**: Zod schemas for request validation
- **Rate Limiting**: Implemented on sensitive endpoints
- **CORS**: Configured for frontend origin

---

## Frontend (Next.js/Blitz)

### Page Structure

The frontend follows Next.js App Router conventions:

```
pages/
├── api/              # API routes (if any)
├── auth/             # Authentication pages
│   ├── login.tsx
│   └── signup.tsx
├── dashboard/        # Main application
│   ├── index.tsx     # Dashboard home
│   ├── videos/       # Video management
│   ├── tasks/        # Task management
│   └── settings/     # User settings
└── _app.tsx         # App wrapper
```

### Key Features

1. **Authentication Flow**
   - Firebase Auth integration
   - Protected routes using middleware
   - Session management with cookies
   - Auto-refresh of tokens

2. **State Management**
   - React Query for server state
   - Context API for global state
   - Local storage for preferences

3. **UI Components**
   - Material-UI component library
   - Custom theme configuration
   - Responsive design
   - Dark mode support

4. **Form Handling**
   - React Hook Form integration
   - Zod schema validation
   - Error handling and display
   - File upload components

### API Integration

API services are organized in `src/services/`:

```typescript
// Example: Video Service
export const videoService = {
  getVideos: async (params) => {
    const response = await apiClient.get('/videos', { params });
    return response.data;
  },
  
  createVideo: async (data) => {
    const response = await apiClient.post('/videos', data);
    return response.data;
  }
};
```

---

## Shared Library

The `hvo-shared-main` package contains shared types and utilities:

```typescript
// Shared types
export interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Zod schemas
export const CreateVideoSchema = z.object({
  title: z.string().min(1),
  youtube_url: z.string().url().optional(),
  languages: z.array(z.string())
});

// Constants
export const TASK_TYPES = {
  TRANSCRIPTION: 'TRANSCRIPTION',
  TRANSLATION: 'TRANSLATION',
  VOICE_OVER: 'VOICE_OVER',
  AUDIO_ENGINEERING: 'AUDIO_ENGINEERING'
} as const;
```

---

## Database Schema

### Entity Relationship Diagram

```
User ──┬──▶ Creator
       ├──▶ Staff
       └──▶ Vendor

Creator ──▶ Video ──┬──▶ Task ──▶ Staff
                    └──▶ AudioDub

Video ──▶ VideoProcessingIssue
Task ──▶ Feedback
```

### Key Tables

1. **users** - Core user authentication and profile
2. **creators** - Content creator profiles
3. **videos** - Video metadata and status
4. **tasks** - Work items in the localization pipeline
5. **audio_dubs** - Language-specific audio versions
6. **staff** - Workers who perform tasks
7. **languages** - Supported languages
8. **feedback** - Quality control feedback

---

## Authentication

### Frontend Authentication Flow

1. User logs in with Firebase Auth
2. Firebase returns ID token
3. Token stored in cookie (`__session`)
4. Token sent with API requests in Authorization header
5. Backend validates token with Firebase Admin SDK

### Backend Authentication

```typescript
// Firebase Strategy (Passport)
@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  async validate(payload: DecodedIdToken) {
    // Find user in database by Firebase UID
    const user = await this.userService.findByFirebaseUid(payload.uid);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

// Usage in controllers
@UseGuards(FirebaseAuthGuard)
@Roles(Role.ADMIN, Role.VENDOR)
@Get('protected-route')
async protectedRoute() {
  // Only accessible by ADMIN and VENDOR roles
}
```

---

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/login              # Login with Firebase token
POST   /api/auth/verify-token       # Verify token validity
GET    /api/auth/profile            # Get current user profile
POST   /api/auth/logout             # Logout user
```

### Video Management
```
GET    /api/videos                  # List all videos (paginated)
POST   /api/videos/initiate-video-submission     # Start video upload
POST   /api/videos/finalize-video-submission/:creatorId  # Complete upload
GET    /api/videos/library/:creatorId            # Creator's videos
GET    /api/videos/review/:creatorId             # Videos in review
GET    /api/videos/:videoId                      # Get video details
PUT    /api/videos/:videoId                      # Update video
DELETE /api/videos/:videoId                      # Delete video
POST   /api/videos/:videoId/approve              # Approve video
POST   /api/videos/:videoId/reject               # Reject video
```

### Task Management
```
GET    /api/tasks                   # List all tasks
POST   /api/tasks/assign-staff      # Assign staff to task
POST   /api/tasks/:taskId/submit    # Submit completed work
POST   /api/tasks/:taskId/complete  # Mark task as complete
GET    /api/tasks/pending-staff-assignment  # Tasks needing assignment
GET    /api/tasks/resources         # Get task resources
```

### User Management
```
GET    /api/users                   # List all users
POST   /api/users                   # Create user
GET    /api/users/:userId           # Get user details
PUT    /api/users/:userId           # Update user
DELETE /api/users/:userId           # Delete user
```

### Creator Management
```
GET    /api/creators                # List all creators
POST   /api/creators                # Create creator profile
GET    /api/creators/:creatorId     # Get creator details
PUT    /api/creators/:creatorId     # Update creator
GET    /api/creators/:creatorId/channels  # Get YouTube channels
```

### Staff Management
```
GET    /api/staff                   # List all staff
POST   /api/staff                   # Create staff member
GET    /api/staff/:staffId          # Get staff details
GET    /api/staff/:staffId/tasks    # Get staff's tasks
PUT    /api/staff/:staffId          # Update staff
```

### Storage Endpoints
```
POST   /api/storage/upload          # Upload file to Box
GET    /api/storage/download/:fileId # Download file from Box
DELETE /api/storage/:fileId         # Delete file
GET    /api/storage/folder/:folderId # List folder contents
```

---

## Environment Variables

### Backend Environment Variables (.env)

```bash
# Database Configuration
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/hvo_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=hvo_db
POSTGRES_PORT=5432

# Application Settings
APP_ENV=local                       # local | development | production
NODE_ENV=development               # development | production
PORT=8080                          # API server port
CLIENT_URL=http://localhost:3000   # Frontend URL
ADMIN_CLIENT_URL=http://localhost:3001  # Admin panel URL

# Firebase Configuration
FIREBASE_PROJECT_ID=hxxxx
FIREBASE_CLIENT_EMAIL=xxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
STORAGE_BUCKET=human-voice-over-prod.appspot.com

# Box API Configuration
BOX_CLIENT_ID=xxxxx
BOX_CLIENT_SECRET=xxxx
BOX_ENTERPRISE_ID=xxxx
BOX_CONFIG_BASE_64=<base64 encoded Box config JSON>

# External APIs
SONIX_API_KEY=your-sonix-api-key   # For transcription service
GCP_PROJECT_ID=human-voice-over-prod # Google Cloud project

# Discord Configuration
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_CHANNEL_ID=your-channel-id

# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=xxx

# Redis Configuration (for queues)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Bull Queue Configuration
BULL_REDIS_HOST=localhost
BULL_REDIS_PORT=6379
```

### Frontend Environment Variables (.env.local)

```bash
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx

# API Configuration
NEXT_PUBLIC_API_ENDPOINT=http://localhost:8080/api
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000

# Application Settings
NEXT_PUBLIC_APP_TYPE=main          # main | staff | admin
NEXT_PUBLIC_APP_NAME=HVO Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true

# Third-party Services
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Email Rendering
EMAIL_RENDER_ACCESS_TOKEN=your-token
```

---

## Development Workflow

### Git Workflow

1. **Branching Strategy**
   - `master` - Production-ready code
   - `develop` - Integration branch
   - `feature/*` - New features
   - `bugfix/*` - Bug fixes
   - `hotfix/*` - Emergency fixes

2. **Commit Messages**
   Follow conventional commits:
   ```
   feat: add video upload progress indicator
   fix: resolve authentication token refresh issue
   docs: update API endpoint documentation
   refactor: reorganize video service methods
   test: add unit tests for task assignment
   ```

### Code Style

1. **TypeScript Guidelines**
   - Use strict mode
   - Define interfaces for all data structures
   - Avoid `any` type
   - Use enums for constants

2. **Naming Conventions**
   - Files: `kebab-case.ts`
   - Classes: `PascalCase`
   - Functions/Variables: `camelCase`
   - Constants: `UPPER_SNAKE_CASE`

3. **File Organization**
   - One component per file
   - Group related files in modules
   - Keep files under 300 lines
   - Extract reusable logic to hooks/utilities

### Development Commands

```bash
# Backend Commands
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn test             # Run tests
yarn test:e2e         # Run e2e tests
yarn lint             # Run linter
yarn format           # Format code
yarn prisma:dev       # Run migrations (dev)
yarn prisma:generate  # Generate Prisma client
yarn prisma:studio    # Open Prisma Studio

# Frontend Commands
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run linter
yarn test             # Run tests
yarn analyze          # Analyze bundle size
```

---

## Testing

### Backend Testing

1. **Unit Tests** (Jest)
   ```typescript
   describe('VideoService', () => {
     it('should create a video', async () => {
       const video = await service.create(mockVideoData);
       expect(video).toBeDefined();
       expect(video.title).toBe(mockVideoData.title);
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   describe('Video Controller (e2e)', () => {
     it('/api/videos (GET)', () => {
       return request(app.getHttpServer())
         .get('/api/videos')
         .expect(200)
         .expect((res) => {
           expect(res.body).toHaveProperty('data');
         });
     });
   });
   ```

### Frontend Testing

1. **Component Tests** (React Testing Library)
   ```typescript
   describe('VideoCard', () => {
     it('renders video title', () => {
       render(<VideoCard video={mockVideo} />);
       expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
     });
   });
   ```

2. **E2E Tests** (Cypress/Playwright)
   ```typescript
   describe('Video Upload Flow', () => {
     it('uploads a video successfully', () => {
       cy.visit('/dashboard/videos/new');
       cy.fillVideoForm(mockVideoData);
       cy.submitForm();
       cy.url().should('include', '/dashboard/videos');
     });
   });
   ```

---

## Deployment

### Backend Deployment

1. **Build the application**
   ```bash
   yarn build
   ```

2. **Set production environment variables**

3. **Run database migrations**
   ```bash
   yarn prisma:migrate:deploy
   ```

4. **Start the server**
   ```bash
   yarn start:prod
   ```

### Frontend Deployment

1. **Build the application**
   ```bash
   yarn build
   ```

2. **Deploy to hosting service**
   - Vercel (recommended for Next.js)
   - Firebase Hosting
   - AWS Amplify

### Docker Deployment

Backend Dockerfile example:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY . .
RUN yarn build
EXPOSE 8080
CMD ["yarn", "start:prod"]
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check PostgreSQL is running
   - Verify connection string in .env
   - Ensure database exists
   - Check firewall/network settings

2. **Authentication Errors**
   - Verify Firebase credentials
   - Check token expiration
   - Ensure Firebase project ID matches
   - Clear browser cookies

3. **Box API Issues**
   - Verify Box app credentials
   - Check Box folder permissions
   - Ensure enterprise ID is correct
   - Review Box API rate limits

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify all environment variables
   - Review TypeScript errors

### Debug Mode

Enable debug logging:
```bash
# Backend
DEBUG=* yarn dev

# Frontend
NEXT_PUBLIC_ENABLE_DEBUG=true yarn dev
```

### Logs

- Backend logs: Check console output
- Frontend logs: Browser developer console
- Database logs: PostgreSQL logs
- Queue logs: Redis/Bull dashboard

---

## Current Development Status

### Completed Features
- ✅ User authentication with Firebase
- ✅ Basic CRUD operations for videos, tasks, users
- ✅ Box.com integration for file storage
- ✅ Role-based access control
- ✅ Email notifications
- ✅ Database schema and migrations

### In Progress
- 🔄 Video processing pipeline optimization
- 🔄 Enhanced dashboard analytics
- 🔄 Bulk operations for video management
- 🔄 Advanced search and filtering

### Planned Features
- 📋 Real-time collaboration features
- 📋 Advanced reporting and analytics
- 📋 Mobile application
- 📋 AI-powered quality checks
- 📋 Automated workflow optimization

### Known Issues
- Discord bot token needs to be updated
- Some email templates need styling improvements
- Performance optimization needed for large video libraries
- Better error handling in video upload process

---

## Resources

### Internal Documentation
- API Documentation: http://localhost:8080/api/docs (Swagger)
- Database Schema: See `prisma/schema.prisma`
- Component Storybook: (if configured)

### External Resources
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Box API Documentation](https://developer.box.com/)

---

## Appendix

### Glossary
- **Creator**: Content creator who uploads videos
- **Staff**: Workers who perform localization tasks
- **Vendor**: Third-party service providers
- **Audio Dub**: Language-specific audio track
- **Task**: Unit of work in the localization pipeline

### Acronyms
- **RBAC**: Role-Based Access Control
- **JWT**: JSON Web Token
- **DTO**: Data Transfer Object

---

Last Updated: June 2025
Version: 1.0.0
