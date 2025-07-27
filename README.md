# Oakflip-Final - Full-Stack E-Commerce Platform

A modern, feature-rich e-commerce application built with React, Express.js, and MongoDB. Features multi-language support, user analytics, dynamic shipping calculations, and a complete admin panel.

![Rest Express Screenshot](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600)

## 🚀 Features

### Customer Experience
- **Multi-Language Support**: Automatic IP-based language detection for 5 languages (English, Portuguese, Spanish, French, Chinese)
- **Smart Shopping Cart**: Persistent cart with real-time updates and analytics tracking
- **Dynamic Shipping**: Location-based shipping rates with multiple delivery options
- **Secure Checkout**: Complete order processing with address validation and tax calculations
- **Responsive Design**: Mobile-first design that works on all devices

### Business Intelligence
- **User Analytics**: Track customer behavior, cart abandonment, and conversion rates
- **Session Management**: Cookie-based tracking for detailed user journey insights
- **Admin Dashboard**: Complete product and order management system
- **Real-time Reporting**: Sales analytics and performance metrics

### Technical Excellence
- **Modern Stack**: React + TypeScript frontend with Express.js backend
- **Database Flexibility**: MongoDB primary with PostgreSQL support via Drizzle ORM
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Performance**: Optimized builds with Vite and hot module replacement

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (primary), PostgreSQL (via Drizzle ORM)
- **State Management**: TanStack Query, React Context
- **Testing**: Jest, Supertest
- **Build Tools**: Vite, esbuild

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB instance or PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/rest-express.git
cd rest-express
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=mongodb://localhost:27017/rest-express
# Or for PostgreSQL: postgresql://user:password@localhost:5432/rest-express

# Session Management
SESSION_SECRET=your-super-secret-session-key-here

# Development Settings
NODE_ENV=development
PORT=5000

# Optional: External Services
STRIPE_SECRET_KEY=sk_test_your_stripe_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### 4. Database Setup

**For MongoDB:**
```bash
# Make sure MongoDB is running locally
# The app will create collections automatically
```

**For PostgreSQL:**
```bash
# Run migrations
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

**Important:** Use `npm run dev` (NOT `npm start dev`)

Visit `http://localhost:5000` to see your store!

### Available Commands
- `npm run dev` - Start development server with hot reloading
- `npm start` - Run production server (requires `npm run build` first)
- `npm run build` - Build project for production
- `npm run check` - Run TypeScript type checking

## 🔧 Alternative Setup Methods for Older Systems

### Method 0: Ultra-Simple Version (For macOS Big Sur and Older)

If nothing else works, use the ultra-simple JavaScript-only version:

```bash
# Clone the repository
git clone https://github.com/yourusername/rest-express.git
cd rest-express

# Run the simple setup
chmod +x start-simple.sh
./start-simple.sh
```

**What this does:**
- Uses only plain JavaScript (no TypeScript)
- Requires only Express.js (no complex dependencies)
- Works with Node.js 12+ (compatible with Big Sur)
- No build step needed
- Complete e-commerce frontend with shopping cart
- Full product display, cart functionality, and checkout

**To test it's working:**
- Visit: http://localhost:5000 (complete store interface)
- API endpoints: http://localhost:5000/api/products

**Features included:**
- Product catalog with images
- Shopping cart with add/remove functionality
- Checkout process with order creation
- Responsive design that works on all devices
- Analytics tracking for user behavior

### Method 1: Node Version Manager (Recommended for Newer macOS)

If Docker isn't compatible with your older macOS, use Node Version Manager:

**Install nvm:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install and use Node.js 18 (more compatible with older systems)
nvm install 18
nvm use 18
nvm alias default 18
```

**Quick Setup Script:**
```bash
# Clone and auto-setup for older macOS
git clone https://github.com/yourusername/rest-express.git
cd rest-express
chmod +x setup-legacy-mac.sh
./setup-legacy-mac.sh
```

**Manual Setup:**
```bash
# Clone and setup
git clone https://github.com/yourusername/rest-express.git
cd rest-express
npm install
npm run dev
```

### Method 2: Alternative to tsx

Replace tsx with ts-node for better compatibility:

```bash
# Install ts-node globally
npm install -g ts-node

# Or modify package.json scripts:
```

Edit `package.json`:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development ts-node --esm server/index.ts",
    "dev:legacy": "NODE_ENV=development node --loader ts-node/esm server/index.ts"
  }
}
```

### Method 3: Pre-compiled JavaScript

Build to JavaScript and run directly:

```bash
# Build the TypeScript
npm run build

# Run the built JavaScript
npm start
```

## 🐳 Docker Setup (For Compatible Systems)

If your system supports Docker, this provides the most consistent environment:

### Prerequisites
1. **Install Docker Desktop**: Download from [docker.com](https://www.docker.com/products/docker-desktop)
2. **Install Docker Compose**: Usually included with Docker Desktop
3. **Verify Installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

### Quick Start with Docker

**Option 1: Development Mode (Recommended)**
```bash
# Clone the repository
git clone https://github.com/yourusername/rest-express.git
cd rest-express

# Start development environment with hot reloading
docker-compose up dev
```

**Option 2: Production Mode**
```bash
# Build and start production environment
docker-compose up --build app
```

### Docker Environment Variables
Create a `.env` file in the project root:
```env
# Database (automatically handled by docker-compose)
DATABASE_URL=mongodb://mongo:27017/rest-express

# Session Management
SESSION_SECRET=your-super-secret-session-key-here

# Optional: Payment Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### Docker Commands Reference

**Development Commands:**
```bash
# Start development server with hot reloading
docker-compose up dev

# Run development in background
docker-compose up -d dev

# View logs
docker-compose logs -f dev

# Stop development environment
docker-compose down
```

**Production Commands:**
```bash
# Build and start production
docker-compose up --build app

# Run production in background
docker-compose up -d app

# Rebuild containers
docker-compose build --no-cache

# Stop all services
docker-compose down
```

**Database Commands:**
```bash
# Start only MongoDB
docker-compose up -d mongo

# Access MongoDB shell
docker-compose exec mongo mongosh rest-express

# View database logs
docker-compose logs mongo
```

**Maintenance Commands:**
```bash
# Remove all containers and volumes
docker-compose down -v

# Clean up Docker system
docker system prune -a

# View running containers
docker ps

# View all containers
docker ps -a
```

### Docker Troubleshooting

**Common Issues and Solutions:**

1. **Port Already in Use**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Or change port in docker-compose.yml
   ports:
     - "3000:5000"  # Use port 3000 instead
   ```

2. **Container Build Failures**
   ```bash
   # Clean build cache
   docker-compose build --no-cache
   
   # Remove all containers and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build dev
   ```

3. **Database Connection Issues**
   ```bash
   # Restart MongoDB container
   docker-compose restart mongo
   
   # Check MongoDB status
   docker-compose exec mongo mongosh --eval "db.adminCommand('ismaster')"
   ```

4. **Permission Issues (macOS/Linux)**
   ```bash
   # Fix ownership of node_modules
   sudo chown -R $(whoami) node_modules
   ```

5. **Memory Issues on Older Systems**
   ```bash
   # Increase Docker memory limit in Docker Desktop preferences
   # Recommended: 4GB RAM, 2GB Swap
   ```

### Docker Benefits for Older Systems
- **No Node.js Version Conflicts**: Uses Node.js 20 LTS in container
- **No tsx Compatibility Issues**: All TypeScript execution happens in container
- **Consistent MongoDB**: Same database version across all environments
- **Hot Reloading**: Development mode still provides live updates
- **Easy Cleanup**: Remove everything with `docker-compose down -v`

### Performance Tips
- **Development**: Use `docker-compose up dev` for hot reloading
- **Production Testing**: Use `docker-compose up app` to test production build
- **Memory Usage**: Close unused Docker containers to free memory
- **Fast Rebuilds**: Only rebuild when package.json changes

### Accessing Your Application
- **Development**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin
- **API Documentation**: All endpoints available at `/api/*`

### Method Comparison for Older macOS

| Feature | Simple JS | nvm + Node 18 | ts-node | Pre-compiled JS | Docker |
|---------|-----------|-------------|---------|----------------|--------|
| Big Sur Compatibility | ✅ Highest | ✅ High | ✅ High | ✅ Highest | ❌ Limited |
| Setup Complexity | Low | Low | Medium | High |
| Memory Usage | Low | Low | Lowest | High |
| Hot Reloading | ✅ | ✅ | ❌ | ✅ |
| TypeScript Support | ✅ | ✅ | Build-time only | ✅ |

### Recommended Approach for macOS Big Sur and Older:
1. **Start here**: Ultra-simple JavaScript version (no TypeScript)
2. **If that works**: Try nvm with Node.js 16-18
3. **If tsx still fails**: Switch to ts-node
4. **For production**: Use pre-compiled JavaScript
5. **Last resort**: Docker (usually not compatible with older macOS)

## 🎨 Customization Guide

### 1. Brand Name and Logo

**Update Site Name:**
```typescript
// client/src/components/Header.tsx
const siteName = "Your Store Name";
```

**Replace Logo:**
1. Add your logo to `client/public/logo.png`
2. Update the Header component:
```typescript
// client/src/components/Header.tsx
<img src="/logo.png" alt="Your Store" className="h-8 w-auto" />
```

### 2. Color Scheme

**Primary Colors:**
Edit `client/src/index.css`:
```css
:root {
  --primary: 210 40% 98%;        /* Light blue */
  --primary-foreground: 222.2 84% 4.9%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 94%;
  /* Add your custom colors */
  --brand-primary: 260 100% 50%;  /* Purple */
  --brand-secondary: 340 100% 50%; /* Pink */
}
```

**Apply Custom Colors:**
```typescript
// Use in your components
className="bg-[hsl(var(--brand-primary))] text-white"
```

### 3. Product Categories

**Update Default Categories:**
```typescript
// server/storage.ts - Update the defaultCategories array
const defaultCategories = [
  { id: '1', name: 'Your Category 1', description: 'Description' },
  { id: '2', name: 'Your Category 2', description: 'Description' },
];
```

### 4. Hero Section Images

**Homepage Hero:**
```typescript
// client/src/pages/HomePage.tsx
style={{
  backgroundImage: "url('your-hero-image-url')"
}}
```

**Product Images:**
Update product data in `server/storage.ts` with your product image URLs.

### 5. Multi-Language Content

**Add New Languages:**
```typescript
// shared/translations.ts
export const supportedLanguages = [
  // Add your language
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const translations = {
  // Add translations
  de: {
    home: 'Startseite',
    products: 'Produkte',
    // ... more translations
  }
};
```

### 6. Shipping Configuration

**Update Shipping Zones:**
```typescript
// server/shippingRates.ts
export const shippingZones = {
  local: { rate: 5.99, label: 'Local Delivery' },
  regional: { rate: 9.99, label: 'Regional Shipping' },
  // Add your zones
};
```

### 7. Email Templates

**Order Confirmation:**
Create custom email templates in `server/templates/`:
```html
<!-- server/templates/order-confirmation.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Order Confirmation - {{storeName}}</title>
</head>
<body>
  <h1>Thank you for your order!</h1>
  <!-- Your custom email template -->
</body>
</html>
```

## 🔧 Advanced Configuration

### Payment Integration
```typescript
// Add to .env
STRIPE_SECRET_KEY=sk_live_your_live_key
PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Analytics Setup
```typescript
// Add Google Analytics
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
```



## 📊 Analytics Dashboard

Access detailed analytics at `/admin` (requires admin authentication):
- Daily/weekly/monthly sales reports
- Customer behavior tracking
- Cart abandonment analysis
- Product performance metrics
- Geographic sales distribution

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern=checkout
npm test -- --testPathPattern=analytics
```

## 📚 API Documentation

### Products API
```bash
GET /api/products          # Get all products
GET /api/products/:id      # Get product by ID
POST /api/products         # Create product (admin)
PUT /api/products/:id      # Update product (admin)
DELETE /api/products/:id   # Delete product (admin)
```

### Orders API
```bash
POST /api/orders           # Create order
GET /api/orders            # Get user orders
GET /api/admin/orders      # Get all orders (admin)
```

### Analytics API
```bash
POST /api/analytics/session     # Create tracking session
POST /api/analytics/page-view   # Track page view
POST /api/analytics/cart-event  # Track cart events
GET /api/analytics/summary      # Get analytics summary (admin)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Open a GitHub issue for bugs or feature requests  
- **Repository**: https://github.com/orlandobuzana/oakflip-final
- **Discussions**: Use GitHub Discussions for questions

## 🏗 Architecture

```
rest-express/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (cart, auth, language)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities and API client
├── server/                 # Express.js backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   ├── analytics.ts        # Analytics tracking
│   └── __tests__/          # Backend tests
├── shared/                 # Shared types and schemas
│   ├── schema.ts           # Database schemas
│   └── translations.ts     # Multi-language support
└── README.md              # This file
```

---

**Made with ❤️ for modern e-commerce**

Ready to build something amazing? Star this repo and let's grow together!
