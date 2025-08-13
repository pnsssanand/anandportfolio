# Anand Pinisetty - Portfolio Website

## Overview

This is a modern portfolio website for **Anand Pinisetty**, built as a full-stack application using React, TypeScript, and Express.js. The application showcases professional experience, projects, skills, and provides a contact form. It features a luxury dark theme with animated UI components and includes an admin dashboard for content management.

**Created by:** Anand Pinisetty

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with custom luxury dark theme and gold accents
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and interactions
- **State Management**: TanStack React Query for server state and useState for local state
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server**: Express.js with TypeScript running on Node.js
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage)
- **API Design**: RESTful API structure with `/api` prefix for all endpoints
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot module replacement with Vite integration in development mode

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Shared schema definitions using Zod for validation
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle migrations in `./migrations` directory
- **Fallback Storage**: In-memory storage implementation for development

### Authentication and Authorization
- **Authentication Provider**: Firebase Authentication
- **Admin Access**: Role-based access control with specific admin email verification
- **Session Management**: Firebase handles session persistence
- **Protected Routes**: Admin dashboard protected by authentication checks

### External Dependencies

#### Cloud Services
- **Firebase**: Authentication, Firestore database, and Storage
- **Cloudinary**: Image hosting and transformation service
- **Neon Database**: Serverless PostgreSQL hosting

#### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production server builds
- **Drizzle Kit**: Database schema management and migrations

#### UI and Animation Libraries
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Touch-friendly carousel component

#### Styling and Theme
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS Variables**: Luxury dark theme with gold accent colors
- **Google Fonts**: Poppins and Playfair Display typography
- **PostCSS**: CSS processing with Autoprefixer

The architecture follows a monorepo structure with shared types and schemas, enabling type safety across the full stack while maintaining clear separation between client and server code.