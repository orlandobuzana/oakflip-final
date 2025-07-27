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
    category: '1',
    stock: 15
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Track your fitness and stay connected',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: '1',
    stock: 8
  },
  {
    id: '3',
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    category: '1',
    stock: 5
  },
  {
    id: '4',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: '1',
    stock: 20
  },
  {
    id: '5',
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: '2',
    stock: 30
  },
  {
    id: '6',
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    category: '2',
    stock: 12
  }
];

let categories = [
  { id: '1', name: 'Electronics', description: 'Latest electronic devices' },
  { id: '2', name: 'Clothing', description: 'Fashion and apparel' },
  { id: '3', name: 'Books', description: 'Books and literature' },
  { id: '4', name: 'Home & Garden', description: 'Home improvement and garden supplies' }
];

let orders = [];
let users = [
  { id: '1', email: 'admin@store.com', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'customer@email.com', role: 'customer', name: 'Demo Customer' }
];
let analytics = { 
  pageViews: 0, 
  sessions: [],
  cartEvents: [],
  conversions: [],
  dailyStats: {}
};

// API Routes
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = products.filter(p => p.category === category);
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
    stock: req.body.stock || 0
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products.splice(index, 1);
  res.json({ message: 'Product deleted successfully' });
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const newCategory = {
    id: Date.now().toString(),
    ...req.body
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.post('/api/orders', (req, res) => {
  const order = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  orders.push(order);
  
  // Track conversion
  analytics.conversions.push({
    orderId: order.id,
    value: order.total,
    timestamp: new Date()
  });
  
  res.status(201).json(order);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  order.status = status;
  res.json(order);
});

// Users API
app.get('/api/users', (req, res) => {
  res.json(users.map(user => ({ ...user, password: undefined })));
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    role: req.body.role || 'customer'
  };
  users.push(newUser);
  res.status(201).json({ ...newUser, password: undefined });
});

// Analytics
app.post('/api/analytics/page-view', (req, res) => {
  analytics.pageViews++;
  const today = new Date().toISOString().split('T')[0];
  
  if (!analytics.dailyStats[today]) {
    analytics.dailyStats[today] = {
      pageViews: 0,
      uniqueVisitors: 0,
      conversions: 0,
      revenue: 0
    };
  }
  
  analytics.dailyStats[today].pageViews++;
  res.json({ success: true });
});

app.post('/api/analytics/cart-event', (req, res) => {
  analytics.cartEvents.push({
    ...req.body,
    timestamp: new Date()
  });
  res.json({ success: true });
});

app.get('/api/analytics/sales', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const salesData = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOrders = orders.filter(order => 
      order.createdAt && order.createdAt.toISOString && 
      order.createdAt.toISOString().split('T')[0] === dateStr
    );
    
    salesData.push({
      date: dateStr,
      sales: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      orders: dayOrders.length
    });
  }
  
  res.json(salesData);
});

app.get('/api/analytics/top-products', (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  // Count product appearances in orders
  const productCounts = {};
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity;
      });
    }
  });
  
  const topProducts = Object.entries(productCounts)
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return {
        productId,
        name: product?.name || 'Unknown Product',
        quantity,
        revenue: product ? product.price * quantity : 0
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
  
  res.json(topProducts);
});

app.get('/api/dashboard/stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;
  
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pageViews: analytics.pageViews,
    pendingOrders,
    lowStockProducts,
    totalUsers: users.length,
    conversionRate: orders.length > 0 ? (analytics.conversions.length / analytics.pageViews * 100).toFixed(2) : 0
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