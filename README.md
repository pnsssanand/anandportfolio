# Anand Pinisetty - Portfolio Website

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://typescriptlang.org/)

## Overview

This is a modern portfolio website for **Anand Pinisetty**, built as a full-stack application using React, TypeScript, and Express.js. The application showcases professional experience, projects, skills, and provides a contact form. It features a luxury dark theme with animated UI components and includes an admin dashboard for content management.

**Created by:** Anand Pinisetty

## 🚀 Features

- **Modern Design**: Luxury dark theme with gold accents and smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Admin Dashboard**: Protected admin interface for content management
- **Contact Form**: Interactive contact form with form validation
- **Project Showcase**: Dynamic project gallery with filtering capabilities
- **Performance Optimized**: Fast loading with Vite build system

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn/ui** component library
- **TanStack React Query** for state management
- **Vite** for build tooling

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Firebase Authentication**
- **Neon Database** (serverless PostgreSQL)

### External Services
- **Firebase**: Authentication and storage
- **Cloudinary**: Image hosting and optimization
- **Neon Database**: Serverless PostgreSQL hosting

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/pnsssanand/anandportfolio.git
cd anandportfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in your environment variables in the `.env` file.

4. Set up the database:
```bash
npm run db:push
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Build

Build for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express server
├── shared/                # Shared types and schemas
└── migrations/            # Database migrations
```

## 🎨 Design Features

- **Luxury Dark Theme**: Professional dark color scheme with gold accents
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Modern Typography**: Google Fonts integration with Poppins and Playfair Display
- **Responsive Design**: Mobile-first approach ensuring great experience on all devices

## 🔒 Authentication

The admin dashboard is protected by Firebase Authentication. Only authorized users can access the content management features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anand Pinisetty**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- GitHub: [@pnsssanand](https://github.com/pnsssanand)

---

Built with ❤️ by Anand Pinisetty
