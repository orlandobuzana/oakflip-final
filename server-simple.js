// Simple JavaScript server for older macOS systems
const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory storage
let products = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality sound with noise cancellation',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: '1'
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Track your fitness and stay connected',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: '1'
  }
];

let categories = [
  { id: '1', name: 'Electronics', description: 'Latest electronic devices' },
  { id: '2', name: 'Clothing', description: 'Fashion and apparel' }
];

let orders = [];
let analytics = { pageViews: 0, sessions: [] };

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/orders', (req, res) => {
  const order = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Analytics
app.post('/api/analytics/page-view', (req, res) => {
  analytics.pageViews++;
  res.json({ success: true });
});

app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    pageViews: analytics.pageViews
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});