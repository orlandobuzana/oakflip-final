# Rest Express - Full-Stack E-Commerce Platform

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

## 🐳 Docker Setup (Recommended for Older Systems)

If you're having compatibility issues with `tsx` on older macOS systems, use Docker:

### Development with Docker
```bash
# Start development environment
docker-compose up dev

# Or run in background
docker-compose up -d dev
```

### Production with Docker
```bash
# Build and start production
docker-compose up --build app

# Or run individual container
docker build -t rest-express .
docker run -p 5000:5000 --env-file .env rest-express
```

### Docker Benefits
- Consistent environment across all systems
- No compatibility issues with tsx or Node.js versions
- Includes MongoDB container for easy database setup
- Hot reloading in development mode

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
- **Repository**: https://github.com/yourusername/rest-express
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