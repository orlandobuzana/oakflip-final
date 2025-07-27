# Rest Express E-commerce Application

## Overview

Rest Express is a full-stack e-commerce application built with React, Express, and MongoDB. It features a modern UI using shadcn/ui components, a responsive design, and comprehensive e-commerce functionality including product management, shopping cart, and order processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Dedicated Product Detail Pages & Sale Indicators (January 27, 2025)
- Created full-screen dedicated product detail pages replacing modal expansion
- Added prominent sale symbols and badges to products with discounts
- Made deal cards clickable to redirect directly to product detail page
- Enhanced deals section with better visual hierarchy and sale indicators
- Implemented sale price display with original price strikethrough
- Added fire emoji and percentage savings badges to sale products
- Improved product detail page with enhanced pricing display for sale items
- Created professional full-screen layout with sticky navigation header

### Enhanced Product Cards with Conditional Details Display (January 27, 2025)
- Implemented conditional product details display - only shown when "Details" button is pressed
- Enhanced product cards (400px wide) with multiple image galleries and specifications
- Fixed thumbnail clicking functionality to properly change main product image
- Added small product images (60x60px) to shopping cart for better item identification
- Created toggle functionality for Details button (shows/hides extended product information)
- Improved main image changing mechanism with proper thumbnail border highlighting
- Enhanced cart with quantity controls, product thumbnails, and real-time calculations

### Product Detail Page Integration & Testing Suite (January 27, 2025)
- Converted bottom modal product details into full dedicated product page
- Integrated heart ratings and written reviews into single comprehensive page
- Maintained purchase verification requirement for written reviews (heart ratings available to all)
- Created complete test suite with API and frontend test coverage
- Added automated test runner script (run-tests.sh) with setup and cleanup
- Enhanced product data structure with multiple images and specifications
- Two-column layout: image gallery left, product info and reviews right
- Purchase history check determines review form visibility
- Admin approval workflow maintained for written reviews

### Purchase History & Review Restrictions (January 27, 2025)
- Implemented purchase history tracking system for customers
- Restricted reviews to customers who have actually purchased the product
- Removed general review form from main page (comments section eliminated)
- Reviews now only accessible through individual product detail pages
- Added purchase verification before allowing review submission
- Customers must buy product first before being allowed to write reviews
- One review per customer per product policy enforced
- Server-side validation checks purchase history before accepting reviews
- Purchase history stored and tracked with customer email
- Enhanced security preventing fake reviews from non-customers

### Customer Review System & Image Upload Improvements (January 27, 2025)
- Removed image upload functionality from customer-facing product cards
- Moved photo upload feature to admin-only "Add New Product" form with file picker and URL input
- Implemented complete customer review system with admin approval workflow
- Added 5-star rating system for customers to submit reviews on each product
- Created reviews management section in admin panel with pending/approved filter options
- Reviews require admin approval before being displayed publicly to prevent spam
- Removed automatic countdown timer from deals section (now admin-controlled only)
- Added review summary display on product cards showing average rating and review count
- Created review modal for customers to write detailed reviews with star ratings
- Added reviews API endpoints for CRUD operations and approval workflow
- Enhanced deals management with complete analytics tracking

### Complete Big Sur Compatibility Solution (January 27, 2025)
- Successfully resolved tsx compatibility issues on macOS Big Sur
- Created pure JavaScript server (server-simple.cjs) with CommonJS compatibility
- Built complete e-commerce frontend (public/index.html) with all shopping functionality
- Developed full admin panel (public/admin.html) with authentication and management features
- Implemented 6-product catalog with stock management and category filtering
- Added admin authentication system with password protection (admin123)
- Fixed product card CSS layout with proper flexbox and stock display
- Created start-simple.sh script for easy Big Sur deployment
- Added comprehensive API with products, orders, categories, users, and analytics
- Verified complete functionality: store frontend, admin panel, and REST API all working
- Application successfully running on port 5000 with all features operational

### Frontend Enhancement & UI Polish (January 27, 2025)
- Added complete frontend features: logo with SVG icon, user signup system, deals widget
- Implemented customer reviews system with 5-star ratings and comment functionality
- Enhanced authentication flow with proper user welcome messages and role-based UI
- Fixed oversized hero section and deals banner for better proportions and user experience
- Made deals section clickable for improved user interaction
- Removed login hints from authentication modals for cleaner interface
- Improved mobile responsiveness and visual hierarchy across all components

## Previous Changes

### GitHub Documentation & Multi-Language System (January 27, 2025)
- Created comprehensive GitHub README with deployment instructions and customization guide
- Added detailed customization sections for branding, colors, logo, and content
- Included MIT license and contributing guidelines for open source collaboration
- Implemented comprehensive test suite for checkout functionality with shipping calculations
- Created user analytics tracking system with cookie-based session management
- Added multi-language translation system supporting 5 languages (English, Portuguese, Spanish, French, Simplified Chinese)
- Integrated automatic IP-based language detection for international users
- Built language selector component with flag indicators and native language names
- Enhanced checkout process with analytics tracking for cart events and conversions
- Added user behavior tracking across all pages with session persistence
- Created analytics API endpoints for admin dashboard insights

### Enhanced Shipping Address & Dynamic Pricing (January 27, 2025)
- Added comprehensive shipping address collection in checkout process
- Implemented dynamic price calculation based on shipping location
- Created shipping zones system (Local, Regional, National, Remote) with different rates
- Added state tax calculation for accurate pricing
- Enhanced checkout UI with state dropdown and shipping method selection
- Updated order schema to include shipping details (phone, state, country, shipping method)
- Integrated shipping rate API endpoint for real-time calculations
- Added visual shipping options with estimated delivery times

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for cart, product, and auth state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: MongoDB with a fallback in-memory storage implementation
- **Schema Validation**: Zod for runtime type checking
- **Build System**: Vite for frontend, esbuild for backend

## Key Components

### Database Layer
- **Primary Storage**: MongoDB with native driver (@neondatabase/serverless package suggests Neon PostgreSQL support)
- **Schema Management**: Drizzle ORM configured for PostgreSQL (drizzle.config.ts)
- **Fallback Storage**: In-memory implementation for development/testing
- **Data Models**: Categories, Products, Orders, OrderItems with proper relationships

### API Layer
- **REST API**: Express.js with TypeScript
- **Route Structure**: Organized in `/api` namespace
- **Error Handling**: Centralized error middleware
- **Logging**: Custom request/response logging middleware

### Frontend Components
- **Product Management**: ProductCard, ProductModal for product display
- **Shopping Cart**: Context-based cart management with persistent storage
- **Checkout Flow**: Multi-step checkout with form validation
- **Admin Panel**: Complete CRUD operations for products and order management
- **Authentication**: Simple role-based auth system (admin/customer)

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Full shadcn/ui implementation
- **Dark Mode Support**: CSS variables-based theming system
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton components and loading indicators

## Data Flow

### Client-Server Communication
1. **Frontend**: React components use TanStack Query for data fetching
2. **API Layer**: Express routes handle CRUD operations
3. **Database**: MongoDB operations through either native driver or Drizzle ORM
4. **Response**: JSON responses with proper error handling

### State Management Flow
1. **Server State**: Managed by TanStack Query with caching and background updates
2. **Client State**: Context providers for cart, product selection, and authentication
3. **Persistence**: Cart data stored in localStorage, auth state in localStorage
4. **Real-time Updates**: Optimistic updates with query invalidation

## External Dependencies

### Core Dependencies
- **Database**: MongoDB via native driver, Drizzle ORM for PostgreSQL
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: Vite with hot module replacement and error overlay
- **Validation**: Zod for schema validation and type safety

### Notable Integrations
- **Replit Integration**: Custom development banner and cartographer plugin
- **Build Optimization**: esbuild for production server builds
- **Development Tools**: tsx for TypeScript execution, custom Vite plugins

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with middleware mode
- **TypeScript**: Real-time compilation and type checking
- **Database**: Flexible storage layer (MongoDB or in-memory fallback)

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server to `dist/index.js`
- **Static Assets**: Express serves frontend build in production
- **Environment**: NODE_ENV-based configuration switching

### Database Configuration
- **MongoDB**: Primary database with connection string from environment
- **PostgreSQL**: Drizzle ORM ready for PostgreSQL via DATABASE_URL
- **Migrations**: Drizzle Kit for schema migrations in `migrations/` directory
- **Fallback**: In-memory storage for development without database setup

The architecture prioritizes developer experience with hot reloading, type safety, and flexible database options while maintaining production readiness with optimized builds and proper error handling.