import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';
import type { InsertCategory, InsertProduct, InsertDeal, InsertUser } from '@shared/schema';

let app: express.Application;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  await registerRoutes(app);
});

describe('API Routes Tests', () => {
  describe('Categories API', () => {
    test('GET /api/categories should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('POST /api/categories should create a category', async () => {
      const categoryData: InsertCategory = {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        image: 'electronics.jpg'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body).toMatchObject(categoryData);
      expect(response.body._id).toBeDefined();
    });

    test('POST /api/categories should validate required fields', async () => {
      const invalidData = {
        description: 'Missing name field'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Invalid');
    });

    test('GET /api/categories/:id should return specific category', async () => {
      // First create a category
      const categoryData: InsertCategory = {
        name: 'Books',
        description: 'Books and literature'
      };

      const createResponse = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      const categoryId = createResponse.body._id;

      // Then fetch it
      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body).toMatchObject(categoryData);
      expect(response.body._id).toBe(categoryId);
    });

    test('GET /api/categories/:id should return 404 for non-existent category', async () => {
      await request(app)
        .get('/api/categories/999')
        .expect(404);
    });
  });

  describe('Products API', () => {
    let categoryId: string;

    beforeEach(async () => {
      // Create a category for products
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: 'Test Category',
          description: 'Test category for products'
        });
      categoryId = categoryResponse.body._id;
    });

    test('GET /api/products should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('POST /api/products should create a product', async () => {
      const productData: InsertProduct = {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones',
        price: '199.99',
        categoryId,
        image: 'headphones.jpg',
        stock: 50,
        sku: 'WH-001',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body).toMatchObject(productData);
      expect(response.body._id).toBeDefined();
    });

    test('PUT /api/products/:id should update a product', async () => {
      // Create a product first
      const productData: InsertProduct = {
        name: 'Smartphone',
        description: 'Latest smartphone',
        price: '699.99',
        categoryId,
        image: 'phone.jpg',
        stock: 25,
        sku: 'SP-001',
        status: 'active'
      };

      const createResponse = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      const productId = createResponse.body._id;

      // Update the product
      const updateData = {
        price: '649.99',
        stock: 20
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.price).toBe('649.99');
      expect(response.body.stock).toBe(20);
      expect(response.body.name).toBe('Smartphone'); // Unchanged
    });

    test('DELETE /api/products/:id should delete a product', async () => {
      // Create a product first
      const productData: InsertProduct = {
        name: 'Tablet',
        description: 'Tablet device',
        price: '399.99',
        categoryId,
        image: 'tablet.jpg',
        stock: 20,
        sku: 'TB-001',
        status: 'active'
      };

      const createResponse = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      const productId = createResponse.body._id;

      // Delete the product
      await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      // Verify it's deleted
      await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);
    });

    test('GET /api/products should filter by category', async () => {
      // Create products in different categories
      const category2Response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Books',
          description: 'Books category'
        });
      const category2Id = category2Response.body._id;

      await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          description: 'Gaming laptop',
          price: '1299.99',
          categoryId,
          image: 'laptop.jpg',
          stock: 10,
          sku: 'LP-001',
          status: 'active'
        });

      await request(app)
        .post('/api/products')
        .send({
          name: 'Novel',
          description: 'Fiction novel',
          price: '19.99',
          categoryId: category2Id,
          image: 'book.jpg',
          stock: 100,
          sku: 'BK-001',
          status: 'active'
        });

      // Filter by first category
      const response = await request(app)
        .get(`/api/products?category=${categoryId}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Laptop');
    });
  });

  describe('Orders API', () => {
    let productId: string;

    beforeEach(async () => {
      // Create category and product for orders
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
          status: 'active'
        });

      productId = productResponse.body._id;
    });

    test('GET /api/orders should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('POST /api/orders should create an order with items', async () => {
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

      expect(response.body).toMatchObject(orderData.order);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].productId).toBe(productId);
    });

    test('PUT /api/orders/:id/status should update order status', async () => {
      // Create an order first
      const orderData = {
        order: {
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerAddress: '456 Oak Ave',
          customerCity: 'Somewhere',
          customerZip: '67890',
          status: 'pending',
          subtotal: '199.99',
          shipping: '12.99',
          tax: '16.50',
          total: '229.48'
        },
        items: [{
          productId,
          quantity: 2,
          price: '99.99'
        }]
      };

      const createResponse = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      const orderId = createResponse.body._id;

      // Update the status
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'processing' })
        .expect(200);

      expect(response.body.status).toBe('processing');
    });
  });

  describe('Users API', () => {
    test('GET /api/users should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('POST /api/users should create a user', async () => {
      const userData: InsertUser = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject(userData);
      expect(response.body._id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    test('PUT /api/users/:id should update a user', async () => {
      // Create a user first
      const userData: InsertUser = {
        email: 'update@example.com',
        name: 'Update User',
        role: 'customer',
        status: 'active'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body._id;

      // Update the user
      const updateData = {
        status: 'suspended',
        totalOrders: 5
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('suspended');
      expect(response.body.totalOrders).toBe(5);
    });

    test('DELETE /api/users/:id should delete a user', async () => {
      // Create a user first
      const userData: InsertUser = {
        email: 'delete@example.com',
        name: 'Delete User',
        role: 'customer',
        status: 'active'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body._id;

      // Delete the user
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      // Verify it's deleted
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });
  });

  describe('Deals API', () => {
    test('GET /api/deals should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/deals')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('POST /api/deals should create a deal', async () => {
      const dealData: InsertDeal = {
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

      expect(response.body).toMatchObject(dealData);
      expect(response.body._id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    test('PUT /api/deals/:id should update a deal', async () => {
      // Create a deal first
      const dealData: InsertDeal = {
        title: 'Flash Sale',
        description: 'Limited time offer',
        discountType: 'percentage',
        discountValue: 15,
        startDate: '2024-07-01',
        endDate: '2024-07-02',
        isActive: true,
        minOrderAmount: 25,
        maxUses: 50,
        currentUses: 0,
        applicableProducts: [],
        excludedProducts: [],
        applyToAll: true
      };

      const createResponse = await request(app)
        .post('/api/deals')
        .send(dealData)
        .expect(201);

      const dealId = createResponse.body._id;

      // Update the deal
      const updateData = {
        discountValue: 25,
        currentUses: 10
      };

      const response = await request(app)
        .put(`/api/deals/${dealId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.discountValue).toBe(25);
      expect(response.body.currentUses).toBe(10);
      expect(response.body.updatedAt).toBeDefined();
    });

    test('DELETE /api/deals/:id should delete a deal', async () => {
      // Create a deal first
      const dealData: InsertDeal = {
        title: 'Clearance',
        description: 'Final clearance sale',
        discountType: 'fixed',
        discountValue: 30,
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        isActive: false,
        minOrderAmount: 0,
        maxUses: null,
        currentUses: 0,
        applicableProducts: [],
        excludedProducts: [],
        applyToAll: true
      };

      const createResponse = await request(app)
        .post('/api/deals')
        .send(dealData)
        .expect(201);

      const dealId = createResponse.body._id;

      // Delete the deal
      await request(app)
        .delete(`/api/deals/${dealId}`)
        .expect(200);

      // Verify it's deleted
      await request(app)
        .get(`/api/deals/${dealId}`)
        .expect(404);
    });

    test('POST /api/deals should validate required fields', async () => {
      const invalidData = {
        description: '20% off all electronics',
        discountType: 'percentage',
        discountValue: 20
        // Missing required title, startDate, endDate
      };

      const response = await request(app)
        .post('/api/deals')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Invalid');
    });
  });

  describe('Dashboard API', () => {
    beforeEach(async () => {
      // Create test data for dashboard
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: 'Test Category',
          description: 'Test category for dashboard'
        });

      const productResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          description: 'Test product for dashboard',
          price: '100.00',
          categoryId: categoryResponse.body._id,
          image: 'test.jpg',
          stock: 50,
          sku: 'TST-DASH',
          status: 'active'
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
            status: 'completed',
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
          status: 'active'
        });
    });

    test('GET /api/dashboard/stats should return dashboard statistics', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .expect(200);

      expect(response.body.totalRevenue).toBe('118.00');
      expect(response.body.totalOrders).toBe(1);
      expect(response.body.totalProducts).toBe(1);  
      expect(response.body.activeCustomers).toBe(1);
    });
  });
});