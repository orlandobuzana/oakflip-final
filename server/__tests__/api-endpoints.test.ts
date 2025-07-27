// Simplified API endpoint tests that work with current setup
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';

let app: express.Application;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  await registerRoutes(app);
});

beforeEach(async () => {
  // Simple cleanup - reset storage
  const { storage } = await import('../storage');
  (storage as any).categories.clear();
  (storage as any).products.clear();
  (storage as any).orders.clear();
  (storage as any).orderItems.clear();
  (storage as any).users.clear();
  (storage as any).deals.clear();
  
  (storage as any).currentCategoryId = 1;
  (storage as any).currentProductId = 1;
  (storage as any).currentOrderId = 1;
  (storage as any).currentOrderItemId = 1;
  (storage as any).currentUserId = 1;  
  (storage as any).currentDealId = 1;
});

describe('API Endpoint Tests', () => {
  describe('Categories API', () => {
    test('POST /api/categories should create a category', async () => {
      const categoryData = {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        image: 'electronics.jpg'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body.name).toBe('Electronics');
      expect(response.body._id).toBeDefined();
    });

    test('GET /api/categories should return categories', async () => {
      // Create a category first
      await request(app)
        .post('/api/categories')
        .send({
          name: 'Books',
          description: 'Books and literature'
        });

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Books');
    });
  });

  describe('Products API', () => {
    let categoryId: string;

    beforeEach(async () => {
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: 'Test Category',
          description: 'Test category for products'
        });
      categoryId = categoryResponse.body._id;
    });

    test('POST /api/products should create a product', async () => {
      const productData = {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones',
        price: '199.99',
        categoryId,
        image: 'headphones.jpg',
        stock: 50,
        sku: 'WH-001',
        status: 'active',
        rating: '4.5',
        reviewCount: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body.name).toBe('Wireless Headphones');
      expect(response.body.price).toBe('199.99');
      expect(response.body._id).toBeDefined();
    });

    test('GET /api/products should return products', async () => {
      await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          description: 'Test product',
          price: '99.99',
          categoryId,
          image: 'test.jpg',
          stock: 25,
          sku: 'TST-001',
          status: 'active',
          rating: '4.0',
          reviewCount: 5
        });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Product');
    });
  });

  describe('Orders API', () => {
    let productId: string;

    beforeEach(async () => {
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: 'Test Category',
          description: 'Test category'
        });

      const productResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          description: 'Test product for orders',
          price: '99.99',
          categoryId: categoryResponse.body._id,
          image: 'test.jpg',
          stock: 100,
          sku: 'TST-001',
          status: 'active',
          rating: '4.0',
          reviewCount: 5
        });

      productId = productResponse.body._id;
    });

    test('POST /api/orders should create an order', async () => {
      const orderData = {
        order: {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerAddress: '123 Main St',
          customerCity: 'Anytown',
          customerZip: '12345',
          status: 'pending',
          subtotal: '99.99',
          shipping: '9.99',
          tax: '8.25',
          total: '118.23'
        },
        items: [{
          productId,
          quantity: 1,
          price: '99.99'
        }]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body.customerName).toBe('John Doe');
      expect(response.body.total).toBe('118.23');
      expect(response.body.items).toHaveLength(1);
    });
  });

  describe('Users API', () => {
    test('POST /api/users should create a user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
        status: 'active',
        totalOrders: 0,
        totalSpent: '0.00'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.email).toBe('test@example.com');
      expect(response.body.name).toBe('Test User');
      expect(response.body._id).toBeDefined();
    });
  });

  describe('Deals API', () => {
    test('POST /api/deals should create a deal', async () => {
      const dealData = {
        title: 'Summer Sale',
        description: '20% off all electronics',
        discountType: 'percentage',
        discountValue: 20,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        isActive: true,
        minOrderAmount: 50,
        maxUses: 100,
        currentUses: 0,
        applicableProducts: [],
        excludedProducts: [],  
        applyToAll: true
      };

      const response = await request(app)
        .post('/api/deals')
        .send(dealData)
        .expect(201);

      expect(response.body.title).toBe('Summer Sale');
      expect(response.body.discountType).toBe('percentage');
      expect(response.body.discountValue).toBe(20);
      expect(response.body._id).toBeDefined();
    });
  });

  describe('Dashboard API', () => {
    test('GET /api/dashboard/stats should return stats', async () => {
      // Create some test data
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: 'Test Category',
          description: 'Test category for dashboard'
        });

      const productResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Dashboard Product',
          description: 'Product for dashboard testing',
          price: '100.00',
          categoryId: categoryResponse.body._id,
          image: 'dashboard.jpg',
          stock: 50,
          sku: 'DASH-001',
          status: 'active',
          rating: '4.2',
          reviewCount: 8
        });

      await request(app)
        .post('/api/orders')
        .send({
          order: {
            customerName: 'Dashboard Customer',
            customerEmail: 'dashboard@example.com',
            customerAddress: '123 Dashboard St',
            customerCity: 'Dashboardville',
            customerZip: '12345',
            status: 'delivered',
            subtotal: '100.00',
            shipping: '10.00',
            tax: '8.00',
            total: '118.00'
          },
          items: [{
            productId: productResponse.body._id,
            quantity: 1,
            price: '100.00'
          }]
        });

      await request(app)
        .post('/api/users')
        .send({
          email: 'dashboard-user@example.com',
          name: 'Dashboard User',
          role: 'customer',
          status: 'active',
          totalOrders: 1,
          totalSpent: '118.00'
        });

      const response = await request(app)
        .get('/api/dashboard/stats')
        .expect(200);

      expect(response.body.totalRevenue).toBe('118.00');
      expect(response.body.totalOrders).toBe(1);
      expect(response.body.totalProducts).toBe(1);
      expect(response.body.activeCustomers).toBe(1);
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for non-existent resources', async () => {
      await request(app)
        .get('/api/categories/999999')
        .expect(404);

      await request(app)
        .get('/api/products/999999')
        .expect(404);

      await request(app)
        .get('/api/orders/999999')
        .expect(404);

      await request(app)
        .get('/api/users/999999')
        .expect(404);

      await request(app)
        .get('/api/deals/999999')
        .expect(404);
    });

    test('Should return 400 for invalid data', async () => {
      await request(app)
        .post('/api/categories')
        .send({ description: 'Missing name field' })
        .expect(400);

      await request(app)
        .post('/api/products')
        .send({
          name: 'Invalid Product',
          description: 'Missing required fields'
        })
        .expect(400);
    });
  });
});